#!/usr/bin/env python3
"""
Combat Image Scraper - Finds open source training images
"""

import os
import time
import requests
from typing import List, Dict
import hashlib

class CombatImageScraper:
    def __init__(self):
        self.sources = {
            # Free stock photo sites with combat/action content
            'pexels': {
                'api_key': 'YOUR_PEXELS_API_KEY',  # Free at pexels.com
                'base_url': 'https://api.pexels.com/v1/search',
                'headers': {'Authorization': 'YOUR_PEXELS_API_KEY'}
            },
            'unsplash': {
                'api_key': 'YOUR_UNSPLASH_KEY',  # Free at unsplash.com/developers
                'base_url': 'https://api.unsplash.com/search/photos',
            },
            'pixabay': {
                'api_key': 'YOUR_PIXABAY_KEY',  # Free at pixabay.com/api
                'base_url': 'https://pixabay.com/api/',
            }
        }
        
        # Combat-specific search queries
        self.combat_queries = {
            'punching': [
                'boxer punching', 'mma fighter punch', 'martial arts punch',
                'boxing training', 'punching bag', 'shadowboxing',
                'kickboxing punch', 'combat sports punch'
            ],
            'kicking': [
                'martial arts kick', 'taekwondo kick', 'muay thai kick',
                'karate kick', 'high kick', 'roundhouse kick'
            ],
            'sword': [
                'sword fighting', 'fencing', 'kendo', 'samurai sword',
                'medieval sword combat', 'sword training'
            ],
            'general_combat': [
                'mma fighting', 'martial arts combat', 'boxing match',
                'wrestling', 'self defense', 'combat sports'
            ]
        }

    def scrape_pexels(self, query: str, per_page: int = 30) -> List[Dict]:
        """Scrape images from Pexels (CC0 license)"""
        images = []
        headers = self.sources['pexels']['headers']
        url = self.sources['pexels']['base_url']
        
        params = {
            'query': query,
            'per_page': per_page,
            'orientation': 'landscape'  # Better for training
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                for photo in data.get('photos', []):
                    images.append({
                        'url': photo['src']['large'],
                        'source': 'pexels',
                        'query': query,
                        'photographer': photo.get('photographer', 'Unknown'),
                        'license': 'CC0'
                    })
        except Exception as e:
            print(f"Pexels error: {e}")
        
        return images

    def scrape_unsplash(self, query: str, per_page: int = 30) -> List[Dict]:
        """Scrape from Unsplash (free with attribution)"""
        images = []
        api_key = self.sources['unsplash']['api_key']
        url = self.sources['unsplash']['base_url']
        
        params = {
            'query': query,
            'per_page': per_page,
            'client_id': api_key
        }
        
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                for photo in data.get('results', []):
                    images.append({
                        'url': photo['urls']['regular'],
                        'source': 'unsplash',
                        'query': query,
                        'photographer': photo['user']['name'],
                        'license': 'Unsplash License'
                    })
        except Exception as e:
            print(f"Unsplash error: {e}")
        
        return images

    def download_images(self, images: List[Dict], output_dir: str, combat_type: str):
        """Download and organize images"""
        os.makedirs(output_dir, exist_ok=True)
        type_dir = os.path.join(output_dir, combat_type)
        os.makedirs(type_dir, exist_ok=True)
        
        downloaded = 0
        for idx, img in enumerate(images):
            try:
                response = requests.get(img['url'], stream=True)
                if response.status_code == 200:
                    # Create unique filename
                    ext = img['url'].split('.')[-1].split('?')[0]
                    if ext not in ['jpg', 'jpeg', 'png']:
                        ext = 'jpg'
                    
                    filename = f"{combat_type}_{idx+1:03d}_{img['source']}.{ext}"
                    filepath = os.path.join(type_dir, filename)
                    
                    with open(filepath, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                    
                    downloaded += 1
                    print(f"Downloaded: {filename}")
                    
                    # Save metadata
                    metadata_file = os.path.join(type_dir, 'metadata.txt')
                    with open(metadata_file, 'a') as f:
                        f.write(f"{filename}: {img['photographer']} ({img['license']})\n")
                    
                time.sleep(0.5)  # Be respectful to APIs
            except Exception as e:
                print(f"Download error: {e}")
        
        return downloaded

    def auto_collect_combat_dataset(self, combat_type: str = 'punching', 
                                   target_count: int = 30):
        """Automatically collect a full dataset for training"""
        all_images = []
        
        # Get queries for this combat type
        queries = self.combat_queries.get(combat_type, ['combat sports'])
        
        for query in queries:
            if len(all_images) >= target_count:
                break
            
            print(f"Searching for: {query}")
            
            # Try multiple sources
            images = self.scrape_pexels(query, per_page=10)
            all_images.extend(images)
            
            # images = self.scrape_unsplash(query, per_page=10)
            # all_images.extend(images)
            
            time.sleep(1)  # Rate limiting
        
        # Remove duplicates based on URL
        seen = set()
        unique_images = []
        for img in all_images:
            if img['url'] not in seen:
                seen.add(img['url'])
                unique_images.append(img)
        
        # Download the images
        print(f"\nFound {len(unique_images)} unique images")
        output_dir = os.path.expanduser('~/combat-lora-maker/training_data')
        downloaded = self.download_images(unique_images[:target_count], 
                                        output_dir, combat_type)
        
        print(f"\n✅ Downloaded {downloaded} images to {output_dir}/{combat_type}")
        return downloaded


# Additional sources to consider:
OPEN_SOURCE_DATASETS = {
    'fighting_game_sprites': {
        'url': 'https://www.spriters-resource.com/',
        'license': 'Fair use for training',
        'description': 'Game sprites for combat poses'
    },
    'martial_arts_commons': {
        'url': 'https://commons.wikimedia.org/wiki/Category:Martial_arts',
        'license': 'CC BY-SA',
        'description': 'Wikipedia martial arts images'
    },
    'open_game_art': {
        'url': 'https://opengameart.org/art-search?keys=combat',
        'license': 'Various open licenses',
        'description': 'Game art with combat animations'
    },
    'mixamo_animations': {
        'url': 'https://www.mixamo.com/',
        'license': 'Free with Adobe account',
        'description': '3D combat animations (screenshot for 2D)'
    }
}


if __name__ == "__main__":
    # Example usage
    scraper = CombatImageScraper()
    
    # Collect punching dataset
    scraper.auto_collect_combat_dataset('punching', target_count=30)
    
    # Collect other types
    # scraper.auto_collect_combat_dataset('kicking', target_count=30)
    # scraper.auto_collect_combat_dataset('sword', target_count=30)
