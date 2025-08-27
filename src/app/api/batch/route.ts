import { NextRequest, NextResponse } from 'next/server';

// Combat style templates for automated generation
const COMBAT_TEMPLATES = [
  {
    name: 'sword_master',
    triggerWord: 'swordcombat',
    basePrompt: 'warrior with sword, dynamic pose, action scene',
    negativePrompt: 'static, blurry, low quality',
    steps: 1000,
    lr: 0.0004,
  },
  {
    name: 'martial_arts_pro',
    triggerWord: 'martialcombat',
    basePrompt: 'martial artist, kung fu action, dynamic kick',
    negativePrompt: 'weapons, static pose',
    steps: 1000,
    lr: 0.0004,
  },
  {
    name: 'gunfight_tactical',
    triggerWord: 'gunaction',
    basePrompt: 'soldier with rifle, tactical combat, action pose',
    negativePrompt: 'medieval, swords, fantasy',
    steps: 1200,
    lr: 0.0003,
  },
  {
    name: 'superhero_flight',
    triggerWord: 'heroaction',
    basePrompt: 'superhero flying, dynamic action, power pose',
    negativePrompt: 'realistic, mundane, static',
    steps: 1500,
    lr: 0.0003,
  }
];

// Queue for batch processing
const trainingQueue: Array<{
  name: string;
  triggerWord: string;
  basePrompt: string;
  negativePrompt: string;
  steps: number;
  lr: number;
  images?: string[];
  status: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  jobId?: string;
  estimatedTime?: number;
  progress?: number;
  downloadUrl?: string;
  error?: string;
}> = [];
let isProcessing = false;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, images } = body;

  if (action === 'start_batch') {
    // Add all templates to queue
    COMBAT_TEMPLATES.forEach(template => {
      trainingQueue.push({
        ...template,
        images,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    });

    // Start processing if not already running
    if (!isProcessing) {
      processQueue();
    }

    return NextResponse.json({
      success: true,
      message: `Added ${COMBAT_TEMPLATES.length} LoRAs to training queue`,
      queue: trainingQueue,
    });
  }

  if (action === 'get_status') {
    return NextResponse.json({
      isProcessing,
      queue: trainingQueue,
      completed: trainingQueue.filter(item => item.status === 'completed').length,
      pending: trainingQueue.filter(item => item.status === 'pending').length,
      processing: trainingQueue.filter(item => item.status === 'processing').length,
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

async function processQueue() {
  isProcessing = true;

  while (trainingQueue.some(item => item.status === 'pending')) {
    // Find next pending item
    const nextItem = trainingQueue.find(item => item.status === 'pending');
    if (!nextItem) break;

    // Update status
    nextItem.status = 'processing';
    nextItem.startedAt = new Date().toISOString();

    try {
      // Call training API
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: nextItem.images,
          config: {
            modelName: nextItem.name,
            steps: nextItem.steps,
            lr: nextItem.lr,
            triggerWord: nextItem.triggerWord,
            caption: nextItem.basePrompt,
            networkDim: 16,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        nextItem.status = 'training';
        nextItem.jobId = result.jobId;
        nextItem.estimatedTime = result.estimatedTime;

        // Poll for completion
        await waitForCompletion(nextItem);
      } else {
        nextItem.status = 'failed';
        nextItem.error = result.error;
      }
    } catch {
      nextItem.status = 'failed';
      nextItem.error = 'Training request failed';
    }

    // Wait between jobs to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  isProcessing = false;
}

async function waitForCompletion(item: typeof trainingQueue[0]) {
  let attempts = 0;
  const maxAttempts = 120; // Check for 2 hours max

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/train?jobId=${item.jobId}`);
      const status = await response.json();

      if (status.status === 'COMPLETED') {
        item.status = 'completed';
        item.downloadUrl = status.downloadUrl;
        item.completedAt = new Date().toISOString();
        break;
      } else if (status.status === 'FAILED') {
        item.status = 'failed';
        item.error = 'Training failed';
        break;
      }

      // Update progress
      item.progress = status.progress || 0;

    } catch (error) {
      console.error('Status check failed:', error);
    }

    // Wait 1 minute before next check
    await new Promise(resolve => setTimeout(resolve, 60000));
    attempts++;
  }

  if (attempts >= maxAttempts) {
    item.status = 'timeout';
    item.error = 'Training took too long';
  }
}
