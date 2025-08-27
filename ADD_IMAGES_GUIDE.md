# How to Add Showcase Images to Your Gallery

## Quick Setup (2 minutes)

### Step 1: Create Showcase Folder
```bash
mkdir -p public/showcase
```

### Step 2: Add Your Best Images
Place your best visual examples in `public/showcase/`:

```
public/showcase/
├── punch_hero.jpg      # Main hero image for punching LoRA
├── punch_1.jpg         # Gallery image 1
├── punch_2.jpg         # Gallery image 2
├── punch_3.jpg         # Gallery image 3
├── punch_4.jpg         # Gallery image 4
├── sword_hero.jpg      # Main hero for sword LoRA
├── sword_1.jpg         # Gallery images...
└── kick_hero.jpg       # Main hero for kicking LoRA
```

### Step 3: Image Requirements
- **Hero Image**: 1920x1080 or 16:9 aspect ratio
- **Gallery Thumbnails**: 512x512 or square
- **Format**: JPG or PNG
- **Size**: Under 500KB each for fast loading

## Adding Images - 3 Methods

### Method 1: Generate with Your LoRA (Best)
After training a LoRA, generate showcase images:
```
Prompt: "punchstyle, professional boxer mid-punch, dramatic lighting, high quality"
Settings: 
- Steps: 30
- CFG: 7
- Size: 1024x1024
```

### Method 2: Use Free Stock Photos
Download high-quality examples from:
- Pexels.com (search "boxing", "martial arts")
- Unsplash.com (search "combat sports")
- Your training dataset best examples

### Method 3: AI Generate Examples
Use any AI image generator:
```
"Professional photograph of boxer throwing punch, dynamic action, studio lighting"
```

## Visual Appeal Tips

### For Hero Images:
- **Dynamic Action**: Mid-motion shots work best
- **Good Lighting**: Dramatic lighting sells
- **Clear Focus**: Subject should be prominent
- **Professional Quality**: Sharp, high-res

### Gallery Organization:
```javascript
// In src/app/gallery/page.tsx, update the showcase data:
const loraShowcase = [
  {
    name: 'Your LoRA Name',
    heroImage: '/showcase/your_hero.jpg',  // Update path
    galleryImages: [
      '/showcase/your_1.jpg',  // Your actual images
      '/showcase/your_2.jpg',
      '/showcase/your_3.jpg',
      '/showcase/your_4.jpg'
    ],
  }
]
```

## Quick Example Commands

### Optimize Images for Web:
```bash
# Install ImageMagick first
brew install imagemagick

# Resize and optimize all images
for img in public/showcase/*.jpg; do
  convert "$img" -resize 1920x1080 -quality 85 "$img"
done
```

### Generate Placeholder Images:
If you don't have images yet, use placeholders:
```bash
# Create colored placeholders
convert -size 1920x1080 xc:red public/showcase/punch_hero.jpg
convert -size 512x512 xc:blue public/showcase/punch_1.jpg
```

## Marketing Impact

Good showcase images increase sales by 3-5x because:
- **Trust**: Shows real results
- **Quality**: Demonstrates professional output  
- **Variety**: Shows flexibility of your LoRA
- **Inspiration**: Gives buyers ideas

## Pro Layout Tips

### Hero Section:
- 1 stunning hero image (your absolute best)
- Shows the main action clearly
- High contrast for impact

### Gallery Grid:
- 4-6 variations showing different:
  - Angles (front, side, 3/4)
  - Intensities (light, medium, heavy action)
  - Contexts (ring, street, dojo)
  - Styles (realistic, stylized)

### Example Showcase Structure:

**Punching LoRA:**
- Hero: Boxer mid-knockout punch
- Gallery 1: Jab from side angle
- Gallery 2: Uppercut from below
- Gallery 3: Training on heavy bag
- Gallery 4: Street fight scene

**Sword LoRA:**
- Hero: Samurai mid-slash with motion blur
- Gallery 1: Defensive parry stance
- Gallery 2: Dual wielding pose
- Gallery 3: Knight in combat
- Gallery 4: Fantasy warrior

## Testing Your Gallery

1. Add images to `public/showcase/`
2. Run locally: `npm run dev`
3. Visit: http://localhost:3000/gallery
4. Check all images load properly
5. Deploy: `git add . && git commit -m "Add showcase images" && git push`
