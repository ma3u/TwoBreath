#!/bin/bash
# Assemble a YouTube draft cut: bg image (Ken Burns) + chapter card overlay + narration + Lyria bed.
# Usage: ./build-video.sh <video-folder>
# Example: ./build-video.sh video-01-morning-ritual
set -euo pipefail

VIDEO_DIR="${1:?need video folder}"
HERE="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$HERE/.."

case "$VIDEO_DIR" in
  video-01-*) BG_IMG="$ASSETS/og-02-silhouette.png" ;;
  video-02-*) BG_IMG="$ASSETS/og-01-iconic-circles.png" ;;
  video-03-*) BG_IMG="$ASSETS/og-03-breath-waves.png" ;;
  *) echo "no bg mapping for $VIDEO_DIR"; exit 1 ;;
esac

cd "$HERE/$VIDEO_DIR"

CARDS="cards"
NARR="narration"
WORK="build"
mkdir -p "$WORK"

echo "[1/4] Rasterising cards (transparent scrim, Playfair)..."
for svg in "$CARDS"/*.svg; do
  base=$(basename "$svg" .svg)
  png="$WORK/$base.png"
  if [ ! -f "$png" ] || [ "$svg" -nt "$png" ]; then
    # Drop bg rect to 55% opacity so the bg video shows through.
    sed 's|fill="#1a1714"/>|fill="#1a1714" fill-opacity="0.55"/>|' "$svg" > "$WORK/$base.svg"
    sips -s format png "$WORK/$base.svg" --out "$png" >/dev/null
    rm "$WORK/$base.svg"
  fi
done

echo "[2/4] Building per-section segments (bg ken-burns + card overlay)..."
> "$WORK/concat.txt"
last_card=""
for narr in "$NARR"/*.wav; do
  base=$(basename "$narr" .wav)
  num="${base%%-*}"
  card=$(ls "$WORK/${num}-"*.png 2>/dev/null | head -n1 || true)
  if [ -z "$card" ]; then
    echo "  ! no card for $base, reusing previous"
    card="${last_card:-$WORK/01-hook.png}"
  fi
  last_card="$card"

  seg="$WORK/seg-$base.mp4"
  if [ ! -f "$seg" ] || [ "$narr" -nt "$seg" ] || [ "$card" -nt "$seg" ]; then
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$narr")
    dur_plus=$(awk -v d="$dur" 'BEGIN{print d+0.4}')
    frames=$(awk -v d="$dur_plus" 'BEGIN{print int(d*30)+1}')
    ffmpeg -loglevel error -y \
      -loop 1 -i "$BG_IMG" \
      -loop 1 -i "$card" \
      -i "$narr" \
      -filter_complex "[0:v]scale=2200:1240:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(1.0+on/${frames}*0.18,1.18)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${frames}:s=1920x1080:fps=30[bg];[bg][1:v]overlay=0:0[v];[2:a]apad=pad_dur=0.4[a]" \
      -map "[v]" -map "[a]" \
      -t "$dur_plus" \
      -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
      -c:a aac -b:a 192k -ar 48000 \
      "$seg"
  fi
  echo "file 'seg-$base.mp4'" >> "$WORK/concat.txt"
done

echo "[3/4] Concatenating sections..."
ffmpeg -loglevel error -y -f concat -safe 0 -i "$WORK/concat.txt" -c copy "$WORK/voice-track.mp4"

echo "[4/4] Mixing music bed under voice..."
TOTAL_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/voice-track.mp4")
ffmpeg -loglevel error -y \
  -i "$WORK/voice-track.mp4" \
  -stream_loop -1 -i "$ASSETS/twobreath-ambient-02-sustain.wav" \
  -filter_complex "[1:a]volume=0.18,atrim=0:${TOTAL_DUR}[bed];[0:a][bed]amix=inputs=2:duration=first:dropout_transition=2[mix]" \
  -map 0:v -map "[mix]" \
  -c:v copy -c:a aac -b:a 192k \
  -t "$TOTAL_DUR" \
  "../${VIDEO_DIR}-draft.mp4"

echo "DONE: $HERE/${VIDEO_DIR}-draft.mp4"
