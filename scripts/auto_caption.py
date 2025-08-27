#!/usr/bin/env python3
"""
Auto-Captioning System for LoRA Training
Generates proper captions for combat images
"""

import os
import json
from typing import Dict, List

class CombatCaptionGenerator:
    def __init__(self):
        # Caption templates for different combat types
        self.caption_templates = {
            'punching': {
                'base_tags': ['combat', 'action', 'fighting', 'dynamic pose'],
                'specific_tags': [
                    'punching', 'boxing', 'fist', 'strike', 'jab', 'cross',
                    'uppercut', 'hook', 'combat stance', 'fighter'
                ],
                'style_tags': ['intense', 'powerful', 'aggressive', 'athletic'],
                'trigger_word': 'punchstyle'
            },
            'kicking': {
                'base_tags': ['combat', 'action', 'fighting', 'martial arts'],
                'specific_tags': [
                    'kicking', 'high kick', 'roundhouse', 'side kick', 
                    'front kick', 'leg strike', 'taekwondo', 'karate'
                ],
                'style_tags': ['dynamic', 'flexible', 'powerful', 'acrobatic'],
                'trigger_word': 'kickstyle'
            },
            'sword': {
                'base_tags': ['combat', 'weapon', 'blade', 'fighting'],
                'specific_tags': [
                    'sword fighting', 'sword stance', 'blade combat',
                    'slashing', 'parry', 'thrust', 'duel', 'swordsman'
                ],
                'style_tags': ['epic', 'medieval', 'samurai', 'warrior'],
                'trigger_word': 'swordstyle'
            },
            'grappling': {
                'base_tags': ['combat', 'wrestling', 'mma', 'ground fighting'],
                'specific_tags': [
                    'grappling', 'takedown', 'submission', 'wrestling',
                    'ground and pound', 'mount', 'guard', 'clinch'
                ],
                'style_tags': ['intense', 'technical', 'close combat'],
                'trigger_word': 'grapplestyle'
            }
        }
        
        # Negative prompts to avoid
        self.negative_prompts = {
            'general': [
                'blurry', 'low quality', 'pixelated', 'distorted',
                'amateur', 'poorly lit', 'out of focus'
            ],
            'combat_specific': [
                'static pose', 'standing still', 'relaxed', 'casual',
                'non-combat', 'peaceful', 'slow motion'
            ]
        }

    def generate_caption(self, combat_type: str, image_name: str, 
                        custom_tags: List[str] = None) -> Dict:
        """Generate a complete caption for an image"""
        
        template = self.caption_templates.get(combat_type, self.caption_templates['punching'])
        
        # Build positive caption
        caption_parts = []
        
        # Add trigger word first (most important)
        caption_parts.append(template['trigger_word'])
        
        # Add base tags
        caption_parts.extend(template['base_tags'])
        
        # Add specific tags (randomly select some for variety)
        import random
        num_specific = min(4, len(template['specific_tags']))
        selected_specific = random.sample(template['specific_tags'], num_specific)
        caption_parts.extend(selected_specific)
        
        # Add style tags
        num_style = min(2, len(template['style_tags']))
        selected_style = random.sample(template['style_tags'], num_style)
        caption_parts.extend(selected_style)
        
        # Add custom tags if provided
        if custom_tags:
            caption_parts.extend(custom_tags)
        
        # Build negative prompt
        negative_parts = []
        negative_parts.extend(self.negative_prompts['general'])
        negative_parts.extend(self.negative_prompts['combat_specific'])
        
        return {
            'image': image_name,
            'caption': ', '.join(caption_parts),
            'negative': ', '.join(negative_parts),
            'trigger_word': template['trigger_word']
        }

    def auto_caption_directory(self, directory: str, combat_type: str):
        """Auto-caption all images in a directory"""
        
        captions = []
        caption_file = os.path.join(directory, 'captions.json')
        
        # Get all image files
        image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        images = [f for f in os.listdir(directory) 
                 if any(f.lower().endswith(ext) for ext in image_extensions)]
        
        print(f"Found {len(images)} images to caption")
        
        for img in images:
            # Generate caption
            caption_data = self.generate_caption(combat_type, img)
            captions.append(caption_data)
            
            # Also create individual text files (some trainers need this)
            txt_filename = os.path.splitext(img)[0] + '.txt'
            txt_path = os.path.join(directory, txt_filename)
            with open(txt_path, 'w') as f:
                f.write(caption_data['caption'])
            
            print(f"Captioned: {img}")
        
        # Save all captions to JSON
        with open(caption_file, 'w') as f:
            json.dump(captions, f, indent=2)
        
        print(f"\n✅ Saved {len(captions)} captions to {caption_file}")
        return captions

    def create_training_config(self, directory: str, combat_type: str):
        """Create a complete training configuration file"""
        
        config = {
            'dataset_path': directory,
            'combat_type': combat_type,
            'trigger_word': self.caption_templates[combat_type]['trigger_word'],
            'training_settings': {
                'base_model': 'WAN 2.2',
                'steps': 1000,
                'learning_rate': 0.0004,
                'batch_size': 1,
                'network_dim': 16,
                'network_alpha': 8,
                'resolution': 1024
            },
            'augmentation': {
                'random_flip': True,
                'color_jitter': 0.1,
                'random_crop': False,
                'rotation_degrees': 15
            }
        }
        
        config_path = os.path.join(directory, 'training_config.json')
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✅ Saved training config to {config_path}")
        return config


# TAGGING PROCESS EXPLAINED
"""
The tagging/captioning process for LoRA training:

1. **Trigger Word**: Most important - unique identifier for your LoRA
   Example: "punchstyle" - this activates your LoRA

2. **Hierarchy of Tags**: Order matters!
   - Trigger word first
   - Main action (punching, kicking)
   - Style descriptors (dynamic, powerful)
   - Context (combat, fighting)

3. **Consistency**: All images should have similar base tags
   This tells the model what features to learn

4. **Variety**: Add some varying tags for diversity
   Helps the model generalize better

5. **Negative Prompts**: What to avoid
   Helps the model learn what NOT to generate
"""

# VIDEO vs IMAGE TRAINING
"""
Video Training Process (Different from Images):

1. **Extract Frames**:
   - Use ffmpeg to extract frames
   - Select keyframes (action moments)
   - Typically 1-5 fps for action sequences
   
2. **Frame Selection**:
   - Remove blurry frames
   - Keep diverse angles/poses
   - Aim for 30-50 unique frames

3. **Temporal Consistency**:
   - Videos provide natural pose variation
   - Better for learning motion sequences
   - More consistent lighting/style

Example frame extraction:
ffmpeg -i combat_video.mp4 -r 2 -q:v 2 frame_%04d.jpg
"""

def extract_video_frames(video_path: str, output_dir: str, fps: int = 2):
    """Extract frames from video for training"""
    import subprocess
    
    os.makedirs(output_dir, exist_ok=True)
    
    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-r', str(fps),  # frames per second
        '-q:v', '2',     # quality (2 is high)
        os.path.join(output_dir, 'frame_%04d.jpg')
    ]
    
    try:
        subprocess.run(cmd, check=True)
        
        # Count extracted frames
        frames = [f for f in os.listdir(output_dir) if f.startswith('frame_')]
        print(f"✅ Extracted {len(frames)} frames to {output_dir}")
        return len(frames)
    except subprocess.CalledProcessError as e:
        print(f"Error extracting frames: {e}")
        return 0


if __name__ == "__main__":
    # Example workflow
    captioner = CombatCaptionGenerator()
    
    # Auto-caption a directory of punching images
    image_dir = os.path.expanduser('~/combat-lora-maker/training_data/punching')
    if os.path.exists(image_dir):
        captioner.auto_caption_directory(image_dir, 'punching')
        captioner.create_training_config(image_dir, 'punching')
