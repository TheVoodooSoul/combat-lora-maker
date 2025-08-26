'use client';

import Link from 'next/link';
import Image from 'next/image';

// Sample LoRA products data
const featuredLoras = [
  {
    id: 1,
    name: "Epic Sword Combat V2",
    category: "Medieval",
    price: 14.99,
    image: "/api/placeholder/400/300",
    description: "Realistic sword fighting animations and poses",
    rating: 4.8,
    downloads: 324
  },
  {
    id: 2,
    name: "Martial Arts Master",
    category: "Hand-to-Hand",
    price: 19.99,
    image: "/api/placeholder/400/300",
    description: "Professional kung-fu and MMA combat poses",
    rating: 4.9,
    downloads: 567
  },
  {
    id: 3,
    name: "Gunfight Dynamics",
    category: "Modern",
    price: 12.99,
    image: "/api/placeholder/400/300",
    description: "Tactical shooting stances and action sequences",
    rating: 4.7,
    downloads: 445
  },
  {
    id: 4,
    name: "Superhero Action Pack",
    category: "Fantasy",
    price: 24.99,
    image: "/api/placeholder/400/300",
    description: "Dynamic flying and power poses",
    rating: 5.0,
    downloads: 892
  }
];

const categories = [
  { name: "All", count: 156 },
  { name: "Medieval", count: 34 },
  { name: "Modern", count: 28 },
  { name: "Sci-Fi", count: 22 },
  { name: "Fantasy", count: 31 },
  { name: "Martial Arts", count: 41 }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                CombatLoRA
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/catalog" className="hover:text-orange-400 transition">Catalog</Link>
                <Link href="/categories" className="hover:text-orange-400 transition">Categories</Link>
                <Link href="/about" className="hover:text-orange-400 transition">About</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-800 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
              <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:from-red-600 hover:to-orange-600 transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Premium Combat <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">LoRA Models</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional-grade LoRA models for epic combat scenes, martial arts, and action sequences. Instant download, lifetime access.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/catalog" className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-lg font-semibold hover:from-red-600 hover:to-orange-600 transition">
              Browse Catalog
            </Link>
            <Link href="/popular" className="px-8 py-3 border border-gray-600 rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
              Most Popular
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <div key={cat.name} className="text-center">
                <div className="text-2xl font-bold text-orange-400">{cat.count}</div>
                <div className="text-sm text-gray-400">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured LoRAs</h2>
            <Link href="/catalog" className="text-orange-400 hover:text-orange-300 transition">
              View all →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoras.map((lora) => (
              <div key={lora.id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                    {lora.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{lora.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{lora.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm">{lora.rating}</span>
                      <span className="text-gray-500 text-sm">({lora.downloads})</span>
                    </div>
                    <span className="text-xl font-bold text-orange-400">${lora.price}</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:from-red-600 hover:to-orange-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CombatLoRA</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Download</h3>
              <p className="text-gray-400">Get your LoRA files immediately after purchase. No waiting, no hassle.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-400">Professional-grade models tested on multiple platforms and scenarios.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Updates</h3>
              <p className="text-gray-400">Get free updates and improvements to your purchased models forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 CombatLoRA. Premium combat and action LoRA models for AI generation.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
