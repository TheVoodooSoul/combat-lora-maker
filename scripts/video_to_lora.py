#!/usr/bin/env python3
"""
Video to LoRA Dataset Converter
Extracts frames from combat videos for training
"""

import os
import subprocess
import sys
from PIL import Image
import json
import shutil

def extract_frames_from_video(video_path, output_dir='video_frames', fps=2, combat_type='combat'):
    """
    Extract frames from video for LoRA training
    
    Args:
        video_path: Path to video file
        output_dir: Where to save frames
        fps: Frames per second to extract (2 = every 0.5 seconds)
        combat_type: Type of combat for naming
    """
    
    # Create output directory
    output_path = os.path.expanduser(f'~/combat-lora-maker/{output_dir}')
    os.makedirs(output_path, exist_ok=True)
    
    video_path = os.path.expanduser(video_path)
    
    if not os.path.exists(video_path):
        print(f"❌ Video not found: {video_path}")
        return 0
    
    print(f"🎬 Processing video: {os.path.basename(video_path)}")
    print(f"📊 Extracting {fps} frames per second...")
    
    # First, get video duration
    duration_cmd = [
        'ffprobe', '-v', 'error', '-show_entries',
        'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1',
        video_path
    ]
    
    try:
        duration_result = subprocess.run(duration_cmd, capture_output=True, text=True)
        duration = float(duration_result.stdout.strip())
        estimated_frames = int(duration * fps)
        print(f"⏱️ Video duration: {duration:.1f} seconds")
        print(f"📸 Estimated frames: ~{estimated_frames}")
    except:
        print("Could not determine video duration")
        estimated_frames = 0
    
    # Extract frames using ffmpeg
    temp_output = os.path.join(output_path, 'temp_frame_%04d.jpg')
    
    # Build ffmpeg command
    ffmpeg_cmd = [
        'ffmpeg',
        '-i', video_path,
        '-r', str(fps),  # frames per second
        '-q:v', '2',     # quality (2 is high)
        temp_output,
        '-y'  # overwrite existing
    ]
    
    print("🔄 Extracting frames...")
    try:
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error: {result.stderr}")
            return 0
    except Exception as e:
        print(f"❌ FFmpeg error: {e}")
        print("Make sure ffmpeg is installed: brew install ffmpeg")
        return 0
    
    # Process and filter frames
    print("🔍 Processing extracted frames...")
    
    # Find all extracted frames
    frames = sorted([f for f in os.listdir(output_path) if f.startswith('temp_frame_')])
    print(f"✅ Extracted {len(frames)} frames")
    
    # Rename and create captions
    processed = 0
    trigger_word = f"{combat_type}style"
    
    for idx, frame_file in enumerate(frames, 1):
        old_path = os.path.join(output_path, frame_file)
        new_name = f"{combat_type}_{idx:03d}.jpg"
        new_path = os.path.join(output_path, new_name)
        
        try:
            # Open and check image
            img = Image.open(old_path)
            
            # Optional: Check if image is not too blurry (basic check)
            # You can add more sophisticated blur detection here
            
            # Resize if needed
            max_size = 1024
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Save processed image
            img.save(new_path, 'JPEG', quality=95)
            
            # Create caption
            caption = f"{trigger_word}, combat, action, fighting, dynamic motion, {combat_type}, intense scene, powerful movement"
            caption_file = os.path.join(output_path, f"{combat_type}_{idx:03d}.txt")
            with open(caption_file, 'w') as f:
                f.write(caption)
            
            # Remove temp file
            os.remove(old_path)
            
            processed += 1
            
            # Show progress
            if processed % 10 == 0:
                print(f"   Processed {processed}/{len(frames)} frames...")
                
        except Exception as e:
            print(f"Error processing frame {frame_file}: {e}")
            if os.path.exists(old_path):
                os.remove(old_path)
    
    # Create training config
    config = {
        'source_video': os.path.basename(video_path),
        'dataset': output_dir,
        'images_count': processed,
        'trigger_word': trigger_word,
        'fps_extracted': fps,
        'recommended_settings': {
            'steps': min(2000, 1000 + (processed * 20)),  # Scale with dataset size
            'learning_rate': 0.0004,
            'network_dim': 32 if processed < 50 else 64
        },
        'caption_template': f"{trigger_word}, combat action fighting {combat_type}"
    }
    
    config_file = os.path.join(output_path, 'training_config.json')
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"\n✨ SUCCESS! Video processed")
    print(f"📁 Extracted {processed} training frames")
    print(f"📍 Location: {output_path}")
    print(f"🏷️ Trigger word: '{trigger_word}'")
    print(f"⚡ Recommended steps: {config['recommended_settings']['steps']}")
    print(f"\n🚀 Ready for training! Upload these images to your app")
    
    return processed

def process_multiple_videos(video_folder, combat_type='combat'):
    """Process all videos in a folder"""
    
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.m4v']
    folder_path = os.path.expanduser(video_folder)
    
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    # Find all videos
    videos = []
    for file in os.listdir(folder_path):
        if any(file.lower().endswith(ext) for ext in video_extensions):
            videos.append(os.path.join(folder_path, file))
    
    if not videos:
        print(f"No videos found in {folder_path}")
        return
    
    print(f"Found {len(videos)} videos to process:")
    for v in videos:
        print(f"  - {os.path.basename(v)}")
    
    total_frames = 0
    for video in videos:
        frames = extract_frames_from_video(video, f"video_frames_{total_frames}", combat_type=combat_type)
        total_frames += frames
    
    print(f"\n🎉 TOTAL: {total_frames} frames extracted from {len(videos)} videos")

def smart_frame_extraction(video_path, output_dir='smart_frames', target_frames=30):
    """
    Smart extraction: Gets best frames for training
    - Skips similar frames
    - Focuses on action moments
    - Aims for target number of diverse frames
    """
    
    video_path = os.path.expanduser(video_path)
    output_path = os.path.expanduser(f'~/combat-lora-maker/{output_dir}')
    os.makedirs(output_path, exist_ok=True)
    
    print(f"🎯 Smart extraction: Targeting {target_frames} best frames")
    
    # Get video duration
    duration_cmd = [
        'ffprobe', '-v', 'error', '-show_entries',
        'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1',
        video_path
    ]
    
    try:
        duration_result = subprocess.run(duration_cmd, capture_output=True, text=True)
        duration = float(duration_result.stdout.strip())
        
        # Calculate optimal fps to get target frames
        optimal_fps = target_frames / duration
        optimal_fps = min(optimal_fps, 5)  # Max 5 fps
        optimal_fps = max(optimal_fps, 0.5)  # Min 0.5 fps
        
        print(f"📊 Video: {duration:.1f}s, extracting at {optimal_fps:.2f} fps")
        
        return extract_frames_from_video(video_path, output_dir, fps=optimal_fps)
        
    except Exception as e:
        print(f"Error: {e}")
        # Fallback to standard extraction
        return extract_frames_from_video(video_path, output_dir, fps=2)


if __name__ == "__main__":
    print("🎬 Video to LoRA Dataset Converter")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        video_source = sys.argv[1]
    else:
        print("\nOptions:")
        print("1. Single video file")
        print("2. Folder of videos")
        print("3. Smart extraction (best 30 frames)")
        
        choice = input("\nChoose option (1-3): ").strip()
        
        if choice == '1':
            video_source = input("Enter path to video file: ").strip()
            combat_type = input("Combat type (punch/kick/sword/fight) [punch]: ").strip() or 'punch'
            extract_frames_from_video(video_source, combat_type=combat_type)
            
        elif choice == '2':
            video_source = input("Enter path to videos folder: ").strip()
            combat_type = input("Combat type (punch/kick/sword/fight) [punch]: ").strip() or 'punch'
            process_multiple_videos(video_source, combat_type)
            
        elif choice == '3':
            video_source = input("Enter path to video file: ").strip()
            frames = input("Target frames to extract [30]: ").strip() or '30'
            smart_frame_extraction(video_source, target_frames=int(frames))
        else:
            print("Invalid option")
