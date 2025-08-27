#!/bin/bash

# Create ultimate dataset directory
rm -rf ultimate_punch_dataset
mkdir ultimate_punch_dataset

echo "Combining all punch datasets..."

# Counter for unique naming
counter=1

# Copy from training_ready
for img in training_ready/*.jpg; do
  if [ -f "$img" ]; then
    cp "$img" "ultimate_punch_dataset/punch_$(printf '%03d' $counter).jpg"
    txt="${img%.jpg}.txt"
    if [ -f "$txt" ]; then
      cp "$txt" "ultimate_punch_dataset/punch_$(printf '%03d' $counter).txt"
    fi
    ((counter++))
  fi
done

# Copy from each video folder
for folder in punch_video_*; do
  if [ -d "$folder" ]; then
    for img in "$folder"/*.jpg; do
      if [ -f "$img" ]; then
        cp "$img" "ultimate_punch_dataset/punch_$(printf '%03d' $counter).jpg"
        txt="${img%.jpg}.txt"
        if [ -f "$txt" ]; then
          cp "$txt" "ultimate_punch_dataset/punch_$(printf '%03d' $counter).txt"
        fi
        ((counter++))
      fi
    done
  fi
done

total=$(ls ultimate_punch_dataset/*.jpg 2>/dev/null | wc -l)
echo "✅ Combined $total images into ultimate_punch_dataset/"
echo "📁 Ready for upload: ultimate_punch_dataset/"
