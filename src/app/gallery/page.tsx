'use client';

import { useState } from 'react';
import Link from 'next/link';

// Your LoRA showcase data - add your best visual examples here
const loraShowcase = [
  {
    id: 1,
    name: 'Punch Master v2',
    triggerWord: 'punchstyle',
    category: 'Hand Combat',
    price: 24.99,
    heroImage: '/showcase/punch_hero.jpg', // Your best punch example
    galleryImages: [
      '/showcase/punch_1.jpg',
      '/showcase/punch_2.jpg',
      '/showcase/punch_3.jpg',
      '/showcase/punch_4.jpg'
    ],
    description: 'Professional boxing and MMA striking poses with dynamic impact',
    downloads: 234,
    rating: 4.9,
    showcasePrompts: [
      'punchstyle, boxer throwing knockout punch, dynamic action',
      'punchstyle, MMA fighter jab, octagon, intense combat',
      'punchstyle, street fighter uppercut, urban setting'
    ]
  },
  {
    id: 2,
    name: 'Blade Combat Elite',
    triggerWord: 'swordstyle',
    category: 'Weapon Combat',
    price: 29.99,
    heroImage: '/showcase/sword_hero.jpg',
    galleryImages: [
      '/showcase/sword_1.jpg',
      '/showcase/sword_2.jpg',
      '/showcase/sword_3.jpg',
      '/showcase/sword_4.jpg'
    ],
    description: 'Epic sword fighting stances and blade combat choreography',
    downloads: 456,
    rating: 5.0,
    showcasePrompts: [
      'swordstyle, samurai mid-swing, cherry blossoms, epic battle',
      'swordstyle, knight parrying attack, medieval castle',
      'swordstyle, dual wielding warrior, fantasy setting'
    ]
  },
  {
    id: 3,
    name: 'Martial Arts Master',
    triggerWord: 'kickstyle',
    category: 'Martial Arts',
    price: 22.99,
    heroImage: '/showcase/kick_hero.jpg',
    galleryImages: [
      '/showcase/kick_1.jpg',
      '/showcase/kick_2.jpg',
      '/showcase/kick_3.jpg',
      '/showcase/kick_4.jpg'
    ],
    description: 'High kicks, flying moves, and acrobatic martial arts',
    downloads: 678,
    rating: 4.8,
    showcasePrompts: [
      'kickstyle, flying roundhouse kick, dojo setting',
      'kickstyle, taekwondo high kick, tournament arena',
      'kickstyle, capoeira spinning kick, beach sunset'
    ]
  }
];

export default function Gallery() {
  const [selectedLora, setSelectedLora] = useState(loraShowcase[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Combat LoRA Maker
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-orange-400 transition">Create</Link>
                <Link href="/gallery" className="text-orange-400">Gallery</Link>
                <Link href="/catalog" className="hover:text-orange-400 transition">Store</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">LoRA Showcase Gallery</h1>
          <p className="text-gray-400">Premium combat LoRAs with visual examples</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LoRA List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Available LoRAs</h2>
            {loraShowcase.map((lora) => (
              <div
                key={lora.id}
                onClick={() => {
                  setSelectedLora(lora);
                  setActiveImageIndex(0);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedLora.id === lora.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{lora.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{lora.category}</p>
                    <div className="flex items-center mt-2">
                      <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                        {lora.triggerWord}
                      </code>
                      <span className="ml-auto text-orange-400 font-bold">
                        ${lora.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{lora.rating}</span>
                  <span className="ml-2">({lora.downloads} downloads)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Showcase */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 relative">
                {/* This is where your hero image would go */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🥊</div>
                    <p className="text-gray-400">Upload your best examples here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedLora.galleryImages[activeImageIndex]}
                    </p>
                  </div>
                </div>
                {/* Image navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {selectedLora.galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === activeImageIndex ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {selectedLora.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                    idx === activeImageIndex ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🎯</div>
                      <p className="text-xs">Example {idx + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info & Prompts */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">{selectedLora.name}</h3>
                <p className="text-gray-400 mb-4">{selectedLora.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Trigger Word</h4>
                    <code className="bg-gray-800 px-3 py-2 rounded block">
                      {selectedLora.triggerWord}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Category</h4>
                    <span className="bg-gray-800 px-3 py-2 rounded block">
                      {selectedLora.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="font-medium mb-3">Example Prompts</h4>
                <div className="space-y-2">
                  {selectedLora.showcasePrompts.map((prompt, idx) => (
                    <div key={idx} className="bg-gray-800 rounded p-3 text-sm">
                      <code className="text-green-400">{prompt}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition">
                  Purchase ${selectedLora.price}
                </button>
                <button className="px-6 py-3 border border-gray-600 rounded-lg font-semibold hover:bg-gray-800 transition">
                  Try Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
