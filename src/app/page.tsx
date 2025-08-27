'use client';

import { useState } from 'react';
import Link from 'next/link';

// Training presets for different combat styles
const trainingPresets = {
  'custom': {
    name: 'Custom Settings',
    steps: 2000,
    lr: 0.0001,
    networkDim: 32,
    networkAlpha: 16,
    caption: 'dynamic action pose, combat scene',
    negativePrompt: 'blurry, low quality, static'
  },
  'sword_combat': {
    name: 'Sword Combat',
    steps: 2000,
    lr: 0.0001,
    networkDim: 32,
    networkAlpha: 16,
    caption: 'warrior wielding sword, dynamic combat pose, action scene',
    negativePrompt: 'blurry, low quality, static pose'
  },
  'martial_arts': {
    name: 'Martial Arts',
    steps: 1500,
    lr: 0.0001,
    networkDim: 32,
    networkAlpha: 16,
    caption: 'martial artist, kung fu stance, dynamic kick, combat pose',
    negativePrompt: 'weapons, armor, static'
  },
  'gunfight': {
    name: 'Gunfight Action',
    steps: 1800,
    lr: 0.00012,
    networkDim: 64,
    networkAlpha: 32,
    caption: 'soldier aiming rifle, tactical combat, action pose, gunfight',
    negativePrompt: 'medieval, swords, fantasy'
  },
  'superhero': {
    name: 'Superhero Action',
    steps: 2500,
    lr: 0.00008,
    networkDim: 128,
    networkAlpha: 64,
    caption: 'superhero flying pose, dynamic action, power stance, cape flowing',
    negativePrompt: 'realistic, mundane, static'
  }
};

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [trainingImages, setTrainingImages] = useState<File[]>([]);
  const [trainingConfig, setTrainingConfig] = useState(trainingPresets.custom);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('setup');
  const [baseModel, setBaseModel] = useState('wan_2.2');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTrainingImages(Array.from(e.target.files));
    }
  };

  const startTraining = async () => {
    if (trainingImages.length === 0) {
      alert('Please upload training images first!');
      return;
    }

    setIsTraining(true);
    setActiveTab('progress');
    setTrainingProgress(0);

    try {
      // Convert images to base64 for API
      const imagePromises = trainingImages.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      const images = await Promise.all(imagePromises);

      // Call training API
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          config: {
            ...trainingConfig,
            modelName: `combat_lora_${Date.now()}`,
            triggerWord: 'combat_style',
            baseModel: baseModel,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Start polling for progress
        const jobId = result.jobId;
        const checkInterval = setInterval(async () => {
          const statusResponse = await fetch(`/api/train?jobId=${jobId}`);
          const status = await statusResponse.json();
          
          setTrainingProgress(status.progress || 0);
          
          if (status.status === 'COMPLETED') {
            clearInterval(checkInterval);
            setIsTraining(false);
            setTrainingProgress(100);
            alert(`Training complete! Download URL: ${status.downloadUrl}`);
          } else if (status.status === 'FAILED') {
            clearInterval(checkInterval);
            setIsTraining(false);
            alert('Training failed. Please try again.');
          }
        }, 30000); // Check every 30 seconds
      } else {
        alert('Failed to start training. Check your API key.');
        setIsTraining(false);
      }
    } catch (error) {
      console.error('Training error:', error);
      alert('Training error. Please check console.');
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Combat LoRA Maker
              </h1>
              <div className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setActiveTab('setup')}
                  className={`${activeTab === 'setup' ? 'text-orange-400' : 'hover:text-orange-400'} transition`}
                >
                  Setup
                </button>
                <button 
                  onClick={() => setActiveTab('dataset')}
                  className={`${activeTab === 'dataset' ? 'text-orange-400' : 'hover:text-orange-400'} transition`}
                >
                  Dataset
                </button>
                <button 
                  onClick={() => setActiveTab('training')}
                  className={`${activeTab === 'training' ? 'text-orange-400' : 'hover:text-orange-400'} transition`}
                >
                  Training
                </button>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className={`${activeTab === 'progress' ? 'text-orange-400' : 'hover:text-orange-400'} transition`}
                >
                  Progress
                </button>
                <Link href="/gallery" className="hover:text-orange-400 transition">My LoRAs</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">ComfyUI: Connected</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'setup' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Create Combat LoRA</h2>
              <p className="text-gray-400">Configure your training parameters for combat and action scenes</p>
            </div>

            {/* Preset Selection */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Start Presets</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(trainingPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPreset(key);
                      setTrainingConfig(preset);
                    }}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedPreset === key 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold mb-1">{preset.name}</div>
                      <div className="text-sm text-gray-400">Steps: {preset.steps}</div>
                      <div className="text-sm text-gray-400">Dim: {preset.networkDim}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Training Configuration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Model Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Model</label>
                    <select 
                      value={baseModel}
                      onChange={(e) => setBaseModel(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    >
                      <option value="wan_2.2">WAN 2.2 (Default)</option>
                      <option value="sdxl">SDXL 1.0</option>
                      <option value="sd15">SD 1.5</option>
                      <option value="sd21">SD 2.1</option>
                      <option value="pony">Pony Diffusion V6</option>
                      <option value="flux-dev">Flux Dev</option>
                      <option value="flux-schnell">Flux Schnell</option>
                      <option value="custom">Custom Checkpoint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Training Steps: {trainingConfig.steps}</label>
                    <input 
                      type="range" 
                      min="500" 
                      max="5000" 
                      step="100"
                      value={trainingConfig.steps}
                      onChange={(e) => setTrainingConfig({...trainingConfig, steps: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Learning Rate: {trainingConfig.lr}</label>
                    <input 
                      type="range" 
                      min="0.00001" 
                      max="0.001" 
                      step="0.00001"
                      value={trainingConfig.lr}
                      onChange={(e) => setTrainingConfig({...trainingConfig, lr: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Network Dimension: {trainingConfig.networkDim}</label>
                    <select 
                      value={trainingConfig.networkDim}
                      onChange={(e) => setTrainingConfig({...trainingConfig, networkDim: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    >
                      <option value="8">8 (Smallest)</option>
                      <option value="16">16</option>
                      <option value="32">32 (Balanced)</option>
                      <option value="64">64</option>
                      <option value="128">128 (Largest)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Caption Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trigger Word</label>
                    <input 
                      type="text"
                      placeholder="e.g., combat_style"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption Template</label>
                    <textarea 
                      value={trainingConfig.caption}
                      onChange={(e) => setTrainingConfig({...trainingConfig, caption: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Negative Prompt</label>
                    <textarea 
                      value={trainingConfig.negativePrompt}
                      onChange={(e) => setTrainingConfig({...trainingConfig, negativePrompt: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Training Dataset</h2>
              <p className="text-gray-400">Upload and manage your combat training images</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <label className="cursor-pointer">
                  <span className="text-lg">Drop combat images here or click to browse</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/jpg,image/png,image/webp" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                </label>
                <p className="text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
              </div>

              {trainingImages.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">{trainingImages.length} images uploaded</h4>
                    <button className="text-red-400 hover:text-red-300">Clear all</button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {trainingImages.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-xs">{img.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Data Augmentation</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Random Flip</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Color Jitter</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Random Crop</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Rotation (±15°)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Noise Addition</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span>Blur Variation</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Training Control</h2>
              <p className="text-gray-400">Start and monitor your LoRA training</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Training Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model:</span>
                      <span>{baseModel === 'wan_2.2' ? 'WAN 2.2' : baseModel.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Images:</span>
                      <span>{trainingImages.length} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Steps:</span>
                      <span>{trainingConfig.steps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Learning Rate:</span>
                      <span>{trainingConfig.lr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Dim:</span>
                      <span>{trainingConfig.networkDim}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Time:</span>
                      <span>{Math.round(trainingConfig.steps / 100)} minutes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Output Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">LoRA Name</label>
                      <input 
                        type="text"
                        placeholder="my_combat_lora_v1"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Save Location</label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm">
                        <option>ComfyUI/models/loras</option>
                        <option>A1111/models/Lora</option>
                        <option>Custom Path...</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button 
                  onClick={startTraining}
                  disabled={isTraining || trainingImages.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-orange-600 transition"
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>
                {isTraining && (
                  <button className="px-8 py-3 border border-gray-600 rounded-lg font-semibold hover:bg-gray-800 transition">
                    Pause
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Training Progress</h2>
              <p className="text-gray-400">Monitor your LoRA training in real-time</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Overall Progress</span>
                  <span>{trainingProgress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>Step {Math.round(trainingProgress * trainingConfig.steps / 100)} / {trainingConfig.steps}</span>
                  <span>~{Math.round((100 - trainingProgress) * trainingConfig.steps / 10000)} min remaining</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Loss Graph</h4>
                  <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Loss visualization</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Sample Output</h4>
                  <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Generated sample</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Training Log</h4>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                  <div className="text-green-400">[INFO] Training started...</div>
                  <div className="text-gray-400">[INFO] Loading model: WAN 2.2</div>
                  <div className="text-gray-400">[INFO] Dataset: {trainingImages.length} images loaded</div>
                  <div className="text-gray-400">[INFO] Batch size: 1, Gradient accumulation: 1</div>
                  {trainingProgress > 20 && <div className="text-gray-400">[STEP 500] Loss: 0.0823</div>}
                  {trainingProgress > 40 && <div className="text-gray-400">[STEP 1000] Loss: 0.0654</div>}
                  {trainingProgress > 60 && <div className="text-gray-400">[STEP 1500] Loss: 0.0521</div>}
                  {trainingProgress > 80 && <div className="text-gray-400">[STEP 2000] Loss: 0.0412</div>}
                  {trainingProgress === 100 && <div className="text-green-400">[SUCCESS] Training complete! LoRA saved.</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
