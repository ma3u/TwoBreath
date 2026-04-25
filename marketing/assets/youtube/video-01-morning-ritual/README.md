# Video 1 — Synchronized Breathing for Couples (Morning Ritual)

Companion media kit for shooting Video 1 from `marketing/youtube-scripts.md`.
Voice: Iapetus (Gemini TTS), warm grounded male, meditation-teacher cadence.

## Section-by-section asset map

| # | Time      | Card                          | Narration              | Notes |
|---|-----------|-------------------------------|------------------------|-------|
| 1 | 0:00–0:15 | `cards/01-hook.svg`           | `narration/01-hook.wav`     | Verbatim hook |
| 2 | 0:15–0:45 | `cards/02-7yr-shift.svg`      | `narration/02-7yr-shift.wav`| Helen Fisher + Gottman framing |
| 3 | 0:45–2:00 | `cards/03-science.svg` + `04-polyvagal.svg` + `05-coherent.svg` | `narration/03-science.wav` | Polyvagal + HRV science |
| 4 | 2:00–4:30 | `cards/06-ritual.svg`         | `narration/04-ritual.wav`   | The 10-min ritual — speak slowly with the count beats |
| 5 | 4:30–5:30 | `cards/07-30days.svg`         | `narration/05-30days.wav`   | Outcomes / proof |
| 6 | 5:30–6:30 | `cards/08-start.svg`          | `narration/06-start.wav`    | TestFlight CTA |
| 7 | 6:30–7:00 | (no card — close on faces)    | `narration/07-outro.wav`    | Reverent closer |

## Music bed

`marketing/assets/twobreath-ambient-01-opening.wav` (intro)
`marketing/assets/twobreath-ambient-02-sustain.wav` (main bed under sections 3–6)
`marketing/assets/twobreath-ambient-03-closing.wav` (under section 7 outro)

Concatenate via:
`ffmpeg -i 01-opening.wav -i 02-sustain.wav -i 03-closing.wav -filter_complex concat=n=3:v=0:a=1 video-01-bed.wav`

Drop the bed at -22 to -26 dB under voice; lift to -16 dB for the silent ritual demo (section 4) and the outro (section 7).

## How to use

This is a **scratch / B-track**, not the final voiceover — you'll re-record the talking-head parts live (per `youtube-shooting-checklist.md`). Use the narration WAVs to:
- Time your live takes against the same pacing
- Drop into the timeline as placeholder while you shoot
- Use as audio when cutting B-roll-only sections (e.g., the ritual demo at 2:00–4:30 doesn't need a talking head)

Cards are SVG (1920×1080). Rasterize to PNG via `rsvg-convert card.svg -o card.png` or open in Chrome and screenshot.
