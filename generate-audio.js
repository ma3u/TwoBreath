#!/usr/bin/env node
/**
 * TwoBreath – ElevenLabs audio generator
 * Generates DE and JA breathing guidance audio using the ElevenLabs API.
 *
 * Usage:
 *   node generate-audio.js
 *
 * Reads ELEVENLABS_API_KEY from .env (or process.env).
 * Outputs audio files to audio/matthi/{lang}/ and audio/dascha/{lang}/
 *
 * ElevenLabs voice IDs:
 *   Discover yours at: https://api.elevenlabs.io/v1/voices
 *   Set MATTHI_VOICE_ID and DASCHA_VOICE_ID in .env or below.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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

// ── Voice IDs – replace with actual IDs from your ElevenLabs account ──
const VOICE_IDS = {
  matthi: process.env.MATTHI_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Adam (default fallback)
  dascha: process.env.DASCHA_VOICE_ID || '21m00Tcm4TlvDq8ikWAM', // Rachel (default fallback)
};

// ── Texts per language ──────────────────────────────────
const TEXTS = {
  de: {
    'breathe-in': 'Einatmen',
    'hold':        'Halten',
    'breathe-out': 'Ausatmen',
  },
  ja: {
    'breathe-in': '吸って',
    'hold':        '止めて',
    'breathe-out': '吐いて',
  },
};

// ── ElevenLabs TTS request ──────────────────────────────
function synthesize(voiceId, text, modelId = 'eleven_multilingual_v2') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
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
  for (const [speaker, voiceId] of Object.entries(VOICE_IDS)) {
    for (const [lang, phrases] of Object.entries(TEXTS)) {
      const dir = path.join(__dirname, 'audio', speaker, lang);
      fs.mkdirSync(dir, { recursive: true });

      for (const [key, text] of Object.entries(phrases)) {
        const outFile = path.join(dir, `${key}.mp3`);
        if (fs.existsSync(outFile)) {
          console.log(`  skip (exists): ${outFile}`);
          continue;
        }
        process.stdout.write(`  generating ${speaker}/${lang}/${key}.mp3 ("${text}") … `);
        try {
          const audio = await synthesize(voiceId, text);
          fs.writeFileSync(outFile, audio);
          console.log('done');
        } catch (err) {
          console.error(`FAILED: ${err.message}`);
        }
      }
    }
  }
  console.log('\nDone. Audio files written to audio/matthi/ and audio/dascha/');
}

main().catch(err => { console.error(err); process.exit(1); });
