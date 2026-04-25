#!/bin/bash
# Assemble a YouTube draft cut from cards + narration + Lyria bed.
# Usage: ./build-video.sh <video-folder>
# Example: ./build-video.sh video-01-morning-ritual
set -euo pipefail

VIDEO_DIR="${1:?need video folder}"
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE/$VIDEO_DIR"

CARDS="cards"
NARR="narration"
WORK="build"
mkdir -p "$WORK"

echo "[1/4] Rasterising SVG cards..."
for svg in "$CARDS"/*.svg; do
  base=$(basename "$svg" .svg)
  png="$WORK/$base.png"
  [ -f "$png" ] || sips -s format png "$svg" --out "$png" >/dev/null
done

echo "[2/4] Building per-section segments..."
> "$WORK/concat.txt"
sections=()
for narr in "$NARR"/*.wav; do
  base=$(basename "$narr" .wav)
  # Find matching card by leading section number, fall back gracefully
  num="${base%%-*}"
  card=$(ls "$WORK/${num}-"*.png 2>/dev/null | head -n1 || true)
  if [ -z "$card" ]; then
    echo "  ! no card for $base, reusing previous"
    card="${last_card:-$WORK/01-hook.png}"
  fi
  last_card="$card"
  seg="$WORK/seg-$base.mp4"
  if [ ! -f "$seg" ]; then
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$narr")
    # Add 0.4s tail of silence so the card doesn't snap
    ffmpeg -loglevel error -y \
      -loop 1 -i "$card" \
      -i "$narr" \
      -filter_complex "[1:a]apad=pad_dur=0.4[a]" \
      -map 0:v -map "[a]" \
      -t "$(awk -v d="$dur" 'BEGIN{print d+0.4}')" \
      -c:v libx264 -tune stillimage -pix_fmt yuv420p -r 30 \
      -c:a aac -b:a 192k -ar 48000 \
      "$seg"
  fi
  echo "file 'seg-$base.mp4'" >> "$WORK/concat.txt"
  sections+=("$seg")
done

echo "[3/4] Concatenating sections..."
ffmpeg -loglevel error -y -f concat -safe 0 -i "$WORK/concat.txt" -c copy "$WORK/voice-track.mp4"

echo "[4/4] Mixing music bed under voice..."
TOTAL_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/voice-track.mp4")
BED_DIR="$HERE/../"  # marketing/assets/
ffmpeg -loglevel error -y \
  -i "$WORK/voice-track.mp4" \
  -stream_loop -1 -i "$BED_DIR/twobreath-ambient-02-sustain.wav" \
  -filter_complex "[1:a]volume=0.18,atrim=0:${TOTAL_DUR}[bed];[0:a][bed]amix=inputs=2:duration=first:dropout_transition=2[mix]" \
  -map 0:v -map "[mix]" \
  -c:v copy -c:a aac -b:a 192k \
  -t "$TOTAL_DUR" \
  "${VIDEO_DIR}-draft.mp4"

mv "${VIDEO_DIR}-draft.mp4" "../${VIDEO_DIR}-draft.mp4"
echo "DONE: $HERE/${VIDEO_DIR}-draft.mp4"
