import { NextRequest, NextResponse } from 'next/server';

// fal.ai API configuration
const FAL_API_KEY = process.env.FAL_API_KEY || '';

// Base model URL mapping for fal.ai
const BASE_MODEL_URLS: Record<string, string> = {
  'wan_2.2': 'https://fal.run/fal-ai/wan-lora-training',  // WAN 2.2 specific endpoint
  'flux-dev': 'https://fal.run/fal-ai/flux-lora-fast-training',
  'flux-schnell': 'https://fal.run/fal-ai/flux-lora-fast-training',
  'sdxl': 'https://fal.run/fal-ai/fast-sdxl-lora-training',
  'sd15': 'https://fal.run/fal-ai/sd-lora-training',
  'sd21': 'https://fal.run/fal-ai/sd-lora-training',
  'pony': 'https://fal.run/fal-ai/pony-lora-training',
  'custom': 'https://fal.run/fal-ai/flux-lora-fast-training', // Default to flux for custom
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, config } = body;

    // Get the appropriate API endpoint for the base model
    const baseModel = config.baseModel || 'wan_2.2';
    const apiUrl = BASE_MODEL_URLS[baseModel] || BASE_MODEL_URLS['flux-dev'];

    // Adjust resolution based on model
    const resolution = baseModel === 'sd15' || baseModel === 'sd21' ? 512 : 1024;

    // Prepare training configuration for fal.ai
    const trainingPayload = {
      // Model configuration
      model_name: config.modelName || 'combat_lora_v1',
      resolution: resolution,
      base_model: baseModel === 'wan_2.2' ? 'wan-2.2' : baseModel,
      
      // Training parameters
      steps: config.steps || 1000,
      learning_rate: config.lr || 0.0004,
      
      // LoRA specific settings
      lora_rank: config.networkDim || 16,
      
      // Training images (URLs or base64)
      images_data_url: images,
      
      // Captions and trigger word
      trigger_word: config.triggerWord || 'combat_style',
      caption: config.caption || 'dynamic combat action pose',
      
      // Output format
      output_format: 'safetensors',
    };

    // Call fal.ai API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingPayload),
    });

    if (!response.ok) {
      throw new Error(`Training failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Return the training job ID for tracking
    return NextResponse.json({
      success: true,
      jobId: result.request_id,
      estimatedTime: Math.round(config.steps / 50), // Rough estimate in minutes
      downloadUrl: result.lora_url, // Will be available when complete
    });

  } catch (error) {
    console.error('Training error:', error);
    return NextResponse.json(
      { success: false, error: 'Training failed' },
      { status: 500 }
    );
  }
}

// Check training status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://fal.run/status/${jobId}`, {
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
      },
    });

    const status = await response.json();

    return NextResponse.json({
      status: status.status, // 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED'
      progress: status.progress || 0,
      downloadUrl: status.lora_url,
      logs: status.logs,
    });

  } catch {
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
