#!/usr/bin/env node
/**
 * TwoBreath – Pitch Page ElevenLabs narration
 * Generates 7 chapter audio files for pitch.html using Matthi + Dascha voice clones.
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

// ── Pitch narration (EN only — this is the hackathon pitch) ──
const PITCH = [
  {
    key: 'p00-hero', voice: 'matthi',
    text: `One breath. Two souls. Every morning.
Three years ago, something in our relationship got quiet. Oxytocin fades after twelve to eighteen months. Passionate love drops by year seven. It happens to every couple.
So we started breathing together. Fifteen minutes, every morning, for three years. We tried every breathing app on the iPhone. None of them were built for two.
So we built our own. And this weekend, we built AnswerAtlas — to make sure every couple in the world can find us.`,
  },
  {
    key: 'p01-problem', voice: 'dascha',
    text: `A couple in Tokyo. Tuesday night, eleven forty-seven.
She types into ChatGPT: "a breathing app we can do together," in Japanese. ChatGPT answers in perfect Japanese. It recommends Calm, Headspace, Breathe. None of them were built for two. They close the app.
That's our problem. In 2026, a couple's first impression of us is not our App Store page. It is what ChatGPT says about us — in English, in Japanese, in German — at eleven forty-seven at night, when one of them just had a hard day.`,
  },
  {
    key: 'p02-matrix', voice: 'matthi',
    text: `So this weekend we built AnswerAtlas, powered by Peec AI.
Three markets — United States, Japan, Germany. Four Apple device classes — iPhone, iPad, Apple Watch, Apple ecosystem. Twelve cells. Each one shows how often AI answers recommend a breathing app built for two.
Japan is twelve of twelve empty. Germany is mostly empty. Even the United States, where Calm dominates, has zero citations for couples. Read this grid like a compass. The red cells are not losses. They are the exact coordinates Peec AI tells us to attack first.`,
  },
  {
    key: 'p03-market', voice: 'dascha',
    text: `We pulled the numbers. The meditation app shelf is overbuilt. The couple app shelf is empty.
Two thousand five hundred meditation apps have launched since 2015. Calm alone holds thirty percent of the global market. The meditation app market will reach six point seven billion dollars in 2026. Wellness apps together will reach forty-five billion by 2034.
Of the top ten meditation apps, zero are built for two people breathing together. That is the gap.`,
  },
  {
    key: 'p04-trends', voice: 'matthi',
    text: `And couples are searching.
The number one relationship trend of 2026 is "deepening existing relationships, not finding new ones." Couples are actively looking for paired rituals. Emotional depth. Embodied practice as a counterbalance to screens.
Every longevity intervention today — Zone 2, fasting, cold plunge, HRV tracking — is individual. But Harvard's 86-year study of adult development shows that relationship quality predicts lifespan more than almost anything else. We are the first longevity protocol for couples.`,
  },
  {
    key: 'p05-tools', voice: 'dascha',
    text: `Our production stack for this weekend.
CapCut Desktop Pro and Descript for video. ElevenLabs for voice cloning — you are listening to my real voice right now, cloned, and in the demo you will hear Matthi speaking Japanese in his own voice, even though he does not speak Japanese.
Nano Banana 2 for the Tokyo couple image. Lovable for the AnswerAtlas dashboard. Peec AI for the compass. Gemini 3 for native Japanese content. Tavily, ai-coustics, and Entire for the last mile.`,
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
function synthesize(voiceId, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.80, style: 0.18 },
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

  console.log(`\n── Pitch narration (EN, ${PITCH.length} chapters) ──`);
  for (const track of PITCH) {
    const outFile = path.join(dir, `${track.key}.mp3`);
    if (!FORCE && fs.existsSync(outFile)) {
      console.log(`  skip (exists): ${track.key}.mp3`);
      continue;
    }
    const voiceId = track.voice === 'matthi' ? MATTHI_ID : DASCHA_ID;
    process.stdout.write(`  [${track.voice}] ${track.key}.mp3 … `);
    try {
      const audio = await synthesize(voiceId, track.text);
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
