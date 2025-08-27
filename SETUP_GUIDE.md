# Combat LoRA Maker - Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get fal.ai API Key
1. Go to https://fal.ai
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key

### Step 2: Add to Vercel
1. Go to your Vercel dashboard
2. Select "combat-lora-maker" project
3. Go to Settings → Environment Variables
4. Add: `FAL_API_KEY` = your_key_here

### Step 3: Start Training!
- Upload your combat images
- Select a preset (Sword, Martial Arts, etc.)
- Click "Start Training"
- LoRA will be ready in ~20 minutes

---

## 💰 Cost Breakdown

### fal.ai Pricing
- **WAN 2.2 LoRA**: ~$0.50-1.00 per training
- **Flux LoRA**: ~$1.00-2.00 per training
- **SDXL LoRA**: ~$0.30-0.80 per training

### To Make $100/day
- Train 5 LoRAs × $1 = $5 cost
- Sell 5 LoRAs × $25 = $125 revenue
- **Profit: $120/day**

---

## 🤖 Automated Batch Training

### Set It and Forget It!
```javascript
// The app can train multiple LoRAs overnight
// Just upload images once, it creates 4 variations:
- Sword Combat Style
- Martial Arts Style  
- Gunfight Style
- Superhero Style
```

### How It Works:
1. Upload 20-50 combat images
2. Click "Start Batch Training"
3. Go to sleep
4. Wake up to 4 completed LoRAs
5. List them for sale

---

## 📊 Training Tips

### Best Image Requirements:
- **Quantity**: 15-30 images per LoRA
- **Quality**: 1024x1024 or higher
- **Variety**: Different angles, poses, lighting
- **Consistency**: Same style/character

### Optimal Settings:
- **Steps**: 800-1200 (quality vs speed)
- **Learning Rate**: 0.0003-0.0005
- **Network Dim**: 16 (good balance)

---

## 🔄 Alternative Services

### Option A: RunPod (More Control)
```bash
# Rent GPU: $0.40-2.00/hour
# Install kohya_ss or OneTrainer
# Train via their UI
```

### Option B: Replicate (Simple but Pricey)
```bash
# Similar to fal.ai
# ~$2-5 per LoRA
# Good for testing
```

### Option C: Local Training (M2 Mac)
```bash
# VERY SLOW (8-12 hours per LoRA)
# Uses mlx-stable-diffusion
# Not recommended for production
```

---

## 📈 Scaling Strategy

### Phase 1: Manual (Now)
- Train 2-3 LoRAs daily
- Test what sells best
- Build initial catalog

### Phase 2: Semi-Auto (Week 2)
- Use batch training
- Train 10 LoRAs overnight
- Focus on marketing

### Phase 3: Full Auto (Month 2)
- Scrape combat images
- Auto-generate variations
- Auto-list on marketplace
- 50+ LoRAs weekly

---

## 🛠️ Troubleshooting

### "Training Failed"
- Check API key is correct
- Ensure images are under 10MB each
- Verify you have API credits

### "Too Expensive"
- Reduce steps to 600-800
- Use smaller network dim (8 or 16)
- Train SDXL instead of Flux

### "Poor Quality"
- Need more/better images
- Increase steps to 1500+
- Add more detailed captions

---

## 📞 Support

- **fal.ai Docs**: https://fal.ai/docs
- **Discord**: Join their Discord for help
- **Email**: support@fal.ai

---

## Next Steps:
1. Copy `.env.example` to `.env.local`
2. Add your FAL_API_KEY
3. Run `npm run dev`
4. Start training your first LoRA!
