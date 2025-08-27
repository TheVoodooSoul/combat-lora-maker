# Complete LoRA Training Workflow

## 📊 The Numbers That Matter

### Image Requirements:
- **Minimum**: 10 images (poor quality, not recommended)
- **Good**: 15-25 images (balanced quality/effort)
- **Best**: 25-40 images (high quality)
- **Overkill**: 50+ images (diminishing returns)

### For "Punching" LoRA Example:
```
What You Need:
- 5-8 different angles (front, side, 3/4)
- 3-5 different punch types (jab, cross, hook)
- 3-4 different subjects (varied body types)
- 2-3 lighting conditions
= ~25 total images
```

## 🔄 Complete Process Flow

### Step 1: Image Collection (3 Methods)

#### Method A: Automated Scraping (Easiest)
```bash
# Install requirements
pip install requests pillow

# Run scraper
python scripts/scrape_images.py

# This automatically:
# - Searches multiple free sources
# - Downloads 30 images
# - Organizes by combat type
# - Adds attribution metadata
```

#### Method B: Video Frame Extraction (Best Quality)
```bash
# If you have combat videos:
ffmpeg -i fight_video.mp4 -r 2 frames/frame_%04d.jpg

# This extracts 2 frames per second
# From a 30-second fight scene = 60 frames
# Select best 25-30 frames
```

#### Method C: Manual Collection
Best sources for free combat images:
- Pexels.com (CC0 license)
- Unsplash.com (free with attribution)
- Pixabay.com (CC0 license)
- WikiCommons (various CC licenses)
- Your own photos/videos

### Step 2: Auto-Captioning (Critical!)

```bash
# Run auto-captioner
python scripts/auto_caption.py

# This generates for each image:
# - image_001.txt with caption
# - captions.json with all data
# - training_config.json
```

#### Caption Structure:
```
punchstyle, combat, action, fighting, punching, boxing, strike, powerful
```

**Important**: Trigger word (`punchstyle`) comes FIRST!

### Step 3: Image Preparation

```python
Requirements:
- Resolution: 512x512 minimum, 1024x1024 ideal
- Format: JPG or PNG
- Size: Under 10MB each
- Quality: Clear, well-lit, in focus
```

### Step 4: Upload & Train

1. Go to your app
2. Upload prepared images
3. Settings already optimized:
   - Steps: 1000 (20 min training)
   - Learning Rate: 0.0004
   - Network Dim: 16
4. Click "Start Training"

## 🎬 Video vs Image Training

### Video Advantages:
- **Temporal consistency** - Same lighting/style
- **Natural variation** - Smooth pose transitions
- **More data** - 30 sec video = 60+ frames
- **Better motion** - Learns movement sequences

### Video Workflow:
```bash
# 1. Extract frames
ffmpeg -i combat_video.mp4 -r 3 frames/frame_%04d.jpg

# 2. Remove bad frames
# Delete blurry, duplicate, or poor frames

# 3. Auto-caption remaining
python scripts/auto_caption.py

# 4. Train as normal
```

## 🏷️ Tagging Best Practices

### Hierarchy (Order Matters!):
1. **Trigger word** - `punchstyle` (your LoRA activation word)
2. **Main action** - `punching, boxing`
3. **Descriptors** - `dynamic, powerful`
4. **Context** - `combat, fighting`
5. **Style** - `athletic, intense`

### Good Caption:
```
punchstyle, punching, boxing, dynamic pose, combat, powerful strike, athletic fighter
```

### Bad Caption:
```
man in gym doing exercise with gloves
```

## 🤖 Full Automation Pipeline

### Set up once, run forever:
```python
# 1. Configure sources
SOURCES = ['pexels', 'unsplash', 'pixabay']
COMBAT_TYPES = ['punching', 'kicking', 'sword']

# 2. Daily automation
for combat_type in COMBAT_TYPES:
    # Scrape 30 images
    scraper.auto_collect(combat_type)
    
    # Auto-caption
    captioner.auto_caption(combat_type)
    
    # Upload to fal.ai
    train_lora(combat_type)
    
    # Sleep 30 min between
    time.sleep(1800)
```

## 💡 Pro Tips

### Quality over Quantity:
- 20 great images > 50 mediocre images
- Consistent style > random mix
- Clear action > blurry motion

### Diversity Matters:
- Different angles of same action
- Various body types/genders
- Multiple environments
- Range of intensities

### Common Mistakes:
❌ All images from same angle
❌ Blurry or low-res images
❌ Inconsistent art styles
❌ Missing trigger word
❌ Too many unrelated tags

### Testing Your LoRA:
After training, test with:
```
Prompt: "punchstyle, fighter throwing powerful punch, dynamic action"
Negative: "static, blurry, low quality"
```

## 📈 Scaling Strategy

### Phase 1: Manual (Week 1)
- Collect 25 images manually
- Caption manually
- Train 1-2 LoRAs daily

### Phase 2: Semi-Auto (Week 2)
- Use scraper for images
- Auto-caption
- Train 3-5 LoRAs daily

### Phase 3: Full Auto (Month 1)
- Automated pipeline
- 10+ LoRAs daily
- Focus on marketing/sales

## 🎯 Expected Results

### Per LoRA:
- Training time: 15-25 minutes
- Cost: $0.50-1.50
- File size: 50-200MB
- Quality: Professional grade

### Success Metrics:
- Good LoRA: Consistent style activation
- Great LoRA: Flexible across prompts
- Perfect LoRA: Maintains quality at various strengths

## Example Commands

### Quick Start:
```bash
# 1. Collect images for punching
python scripts/scrape_images.py --type punching --count 25

# 2. Caption them
python scripts/auto_caption.py --dir training_data/punching

# 3. Upload to app and train!
```

### From Video:
```bash
# 1. Extract frames
ffmpeg -i fight.mp4 -r 2 -q:v 2 punching/frame_%04d.jpg

# 2. Caption
python scripts/auto_caption.py --dir punching

# 3. Train
```
