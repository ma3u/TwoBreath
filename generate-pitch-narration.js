#!/usr/bin/env node
/**
 * TwoBreath – Pitch Page ElevenLabs narration
 * Generates 7 chapter audio files for pitch.html using Matthi + Dascha voice clones.
 *
 * v2: per-voice settings (Dascha more expressive), text synced to on-page copy.
 *
 * Usage:
 *   node generate-pitch-narration.js [--force]
 *
 * Output: audio/narration/pitch/p00-hero.mp3 … p06-close.mp3
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Load .env ──────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  });
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) { console.error('ELEVENLABS_API_KEY not found in .env'); process.exit(1); }

const MATTHI_ID = process.env.MATTHI_VOICE_ID || 'w7F1JFG89AI4I4krk4Kl';
const DASCHA_ID = process.env.DASCHA_VOICE_ID || 'rqgOd6dahLA4WFEQXV0J';

const FORCE = process.argv.includes('--force');

// ── Per-voice settings — tuned for clear distinction ──
// Matthi: grounded, steady, a touch more formal
// Dascha: warmer, more expressive, softer pacing
const VOICE_SETTINGS = {
  matthi: { stability: 0.55, similarity_boost: 0.88, style: 0.22, use_speaker_boost: true },
  dascha: { stability: 0.38, similarity_boost: 0.88, style: 0.42, use_speaker_boost: true },
};

// ── Pitch narration — text synced to what the page shows ──
const PITCH = [
  {
    key: 'p00-hero', voice: 'matthi',
    text: `One breath. Two souls.
Three years ago, something in our relationship got quiet. So we started breathing together, every morning, for fifteen minutes. For three years.
We tried every breathing app on the iPhone. Calm. Headspace. Othership. Breathwrk. We paid six hundred dollars over three years, for apps that never knew we were two.
Two thousand five hundred meditation apps exist today. Zero were built for two. So we built our own. And this weekend, we built AnswerAtlas — because in 2026, a couple's first impression of us is not our App Store page. It is what ChatGPT says about us, in English, in Japanese, in German, at eleven forty-seven at night — when one of them just had a hard day.`,
  },
  {
    key: 'p01-problem', voice: 'dascha',
    text: `A couple in Tokyo. Tuesday night. Eleven forty-seven pm.
She types into ChatGPT, in Japanese: "a breathing app we can do together."
ChatGPT answers in perfect Japanese. It recommends Calm. Headspace. Breathe.
None of them were built for two. They close the app.
That is our problem. Our app is ready. The science is settled. The ritual works. But across three markets and four Apple device classes, AI answers recommend us exactly zero times. That is the gap AnswerAtlas closes.`,
  },
  {
    key: 'p02-matrix', voice: 'matthi',
    text: `So this weekend we built AnswerAtlas, powered by Peec AI.
Three markets: United States, Japan, Germany. Four Apple device classes: iPhone, iPad, Apple Watch, and the Apple ecosystem. Twelve cells. Each cell shows how often AI answers recommend a breathing app built for two.
Japan is twelve of twelve empty. Germany is mostly empty. Even the United States, where Calm dominates, has zero citations for couples.
Read this grid like a compass. The red cells are not losses. They are the exact coordinates Peec AI tells us to attack first.`,
  },
  {
    key: 'p03-market', voice: 'dascha',
    text: `We pulled the numbers. The meditation app shelf is overbuilt. The couple app shelf is empty.
Two thousand five hundred meditation apps have launched since 2015. Calm alone holds thirty percent of the global market. Meditation apps will reach six point seven billion dollars this year. Wellness apps together will reach forty-five billion by 2034.
Of the top ten meditation apps, zero are built for two people breathing together. That is the gap. And that is what we fill.`,
  },
  {
    key: 'p04-trends', voice: 'matthi',
    text: `And couples are searching.
The number one relationship trend of 2026 is deepening existing relationships — not finding new ones. Emotional depth. Embodied practice as a counterbalance to screens.
Every longevity intervention today — Zone 2, fasting, cold plunge, HRV tracking — is individual. But Harvard's eighty-six year study of adult development shows that relationship quality predicts lifespan more than almost anything else.
We are the first longevity protocol for couples.`,
  },
  {
    key: 'p05-tools', voice: 'dascha',
    text: `Our production stack, for this weekend.
CapCut Desktop Pro and Descript for video. ElevenLabs for voice cloning — the voice you are hearing right now is mine. Cloned. And in the video demo, Matthi will speak Japanese — in his own real voice — even though he does not speak Japanese.
Nano Banana 2 for the Tokyo couple image. Lovable for the AnswerAtlas dashboard. Peec AI is the compass. Gemini 3 writes native Japanese content. Tavily finds our citations. ai-coustics cleans the breath audio. Entire keeps a human in the loop.`,
  },
  {
    key: 'p06-close', voice: 'matthi',
    text: `We are not here to sell another two hundred dollar subscription. We lived that for three years.
We are here to build a community. Of couples. In three languages. Who breathe together on purpose. Every morning.
Oxytocin fades. We cannot stop that. But we can build the morning that brings it back — for us, and for every couple who recognizes themselves in this.
One breath. Two souls. Launch July first, 2026. Join us.`,
  },
];

// ── ElevenLabs TTS ──────────────────────────────────────
function synthesize(voiceId, text, voiceKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: VOICE_SETTINGS[voiceKey],
    });
    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Accept': 'audio/mpeg',
      },
    };
    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', d => { err += d; });
        res.on('end', () => reject(new Error(`ElevenLabs ${res.statusCode}: ${err}`)));
        return;
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Main ────────────────────────────────────────────────
async function main() {
  const dir = path.join(__dirname, 'audio', 'narration', 'pitch');
  fs.mkdirSync(dir, { recursive: true });

  console.log(`\n── Pitch narration v2 (EN, ${PITCH.length} chapters) ──`);
  for (const track of PITCH) {
    const outFile = path.join(dir, `${track.key}.mp3`);
    if (!FORCE && fs.existsSync(outFile)) {
      console.log(`  skip (exists): ${track.key}.mp3`);
      continue;
    }
    const voiceId = track.voice === 'matthi' ? MATTHI_ID : DASCHA_ID;
    process.stdout.write(`  [${track.voice}] ${track.key}.mp3 … `);
    try {
      const audio = await synthesize(voiceId, track.text, track.voice);
      fs.writeFileSync(outFile, audio);
      const sizeKB = Math.round(audio.length / 1024);
      console.log(`done (${sizeKB} KB)`);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
    }
  }
  console.log(`\nDone. Pitch audio written to audio/narration/pitch/`);
}

main().catch(err => { console.error(err); process.exit(1); });
