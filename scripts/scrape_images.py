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
        # Using direct URLs for free combat images (no API needed)
        self.free_combat_images = {
            'punching': [
                # Free stock images from various sources
                'https://images.pexels.com/photos/598686/pexels-photo-598686.jpeg?w=1024',
                'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?w=1024',
                'https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?w=1024',
                'https://images.pexels.com/photos/6740755/pexels-photo-6740755.jpeg?w=1024',
                'https://images.pexels.com/photos/6740059/pexels-photo-6740059.jpeg?w=1024',
                'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?w=1024',
                'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?w=1024',
                'https://images.pexels.com/photos/6740301/pexels-photo-6740301.jpeg?w=1024',
                'https://images.pexels.com/photos/4752861/pexels-photo-4752861.jpeg?w=1024',
                'https://images.pexels.com/photos/5750957/pexels-photo-5750957.jpeg?w=1024',
                'https://cdn.pixabay.com/photo/2017/06/16/20/26/boxing-2410207_960_720.jpg',
                'https://cdn.pixabay.com/photo/2015/05/26/09/24/boxer-784474_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/03/27/20/52/boxer-1284012_960_720.jpg',
                'https://cdn.pixabay.com/photo/2015/09/04/23/46/box-923471_960_720.jpg',
                'https://cdn.pixabay.com/photo/2014/10/06/23/57/boxers-477423_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/03/27/19/43/martial-arts-1283853_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/11/29/02/22/boxer-1867015_960_720.jpg',
                'https://cdn.pixabay.com/photo/2019/10/29/11/22/boxing-4586719_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/05/10/14/49/boxing-1383797_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/11/29/06/17/adult-1867743_960_720.jpg'
            ],
            'kicking': [
                'https://cdn.pixabay.com/photo/2016/11/21/17/33/martial-arts-1846560_960_720.jpg',
                'https://cdn.pixabay.com/photo/2017/01/14/08/15/kick-1979181_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/11/29/03/52/fight-1867126_960_720.jpg'
            ],
            'sword': [
                'https://cdn.pixabay.com/photo/2017/04/27/08/28/knight-2264826_960_720.jpg',
                'https://cdn.pixabay.com/photo/2016/11/29/13/15/sword-1869818_960_720.jpg'
            ]
        }
        
        self.sources = {
            # Keeping structure for future API integration
            'direct': {
                'api_key': 'none',
                'base_url': 'direct_download'
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
        print(f"\n🎯 Starting automated collection for '{combat_type}' LoRA")
        print(f"Target: {target_count} images\n")
        
        # Use pre-collected free images
        if combat_type in self.free_combat_images:
            urls = self.free_combat_images[combat_type]
            images = []
            
            for i, url in enumerate(urls[:target_count]):
                images.append({
                    'url': url,
                    'source': 'pixabay' if 'pixabay' in url else 'pexels',
                    'photographer': 'Various',
                    'license': 'CC0 / Pexels License'
                })
            
            # Download the images
            print(f"Found {len(images)} free combat images")
            output_dir = os.path.expanduser('~/combat-lora-maker/training_data')
            downloaded = self.download_images(images, output_dir, combat_type)
            
            print(f"\n✅ Downloaded {downloaded} images to {output_dir}/{combat_type}")
            print(f"\n📁 Next step: Run auto-captioning on these images!")
            return downloaded
        else:
            print(f"Combat type '{combat_type}' not found. Available: punching, kicking, sword")
            return 0


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
