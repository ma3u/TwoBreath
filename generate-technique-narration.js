#!/usr/bin/env node
/**
 * TwoBreath – Technique narration generator
 *
 * Generates two audio sets:
 *
 *   1. App name clips ({voice}-name-{id}{-lang}.mp3)
 *      The 7 new techniques in EN/DE/JA × Matthi/Dascha = 42 short clips.
 *      Output: ../TwoBreath-app/TwoBreath/Resources/AudioClips/
 *
 *   2. Web instruction clips (techniques/{id}-{lang}.mp3)
 *      The 7 new techniques in EN/DE/JA, alternating Matthi/Dascha per technique.
 *      Output: ./audio/techniques/
 *
 * Usage:
 *   node generate-technique-narration.js [--lang en|de|ja|all] [--scope app|web|all] [--force]
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

const args  = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : def;
};
const LANGS = (flag('lang', 'all') === 'all') ? ['en','de','ja'] : [flag('lang', 'en')];
const SCOPE = flag('scope', 'all');     // 'app' | 'web' | 'all'
const FORCE = args.includes('--force');

const APP_AUDIO_DIR = path.resolve(__dirname, '../TwoBreath-app/TwoBreath/Resources/AudioClips');
const WEB_AUDIO_DIR = path.join(__dirname, 'audio', 'techniques');

// ── Technique catalog: id, voice rotation, names per lang, instructions per lang ──
// Voice rotation alternates Matthi (m) and Dascha (d) per technique so the web player
// reads techniques one by one in alternating voices.
const TECHNIQUES = [
  {
    id: 'panic-relief',
    voice: 'matthi',
    names: {
      en: 'Panic Relief',
      de: 'Panik-Sofortlinderung',
      ja: 'パニック緩和呼吸',
    },
    instructions: {
      en: `Panic Relief. A four-second inhale, two-second pause, eight-second exhale, and a final two-second pause at empty lungs. The extended exhale and dual pauses maximally activate your vagus nerve, calming the parasympathetic nervous system in real time.`,
      de: `Panik-Sofortlinderung. Vier Sekunden einatmen, zwei Sekunden Pause, acht Sekunden ausatmen, und eine letzte zwei-Sekunden-Pause bei leerer Lunge. Die verlängerte Ausatmung und die beiden Pausen aktivieren den Vagusnerv maximal und beruhigen das parasympathische Nervensystem in Echtzeit.`,
      ja: `パニック緩和呼吸。4秒で吸って、2秒止めて、8秒で吐いて、最後に肺が空の状態で2秒休む。長い呼気と二つの休止が迷走神経を最大限に活性化し、副交感神経系をリアルタイムで鎮めます。`,
    },
  },
  {
    id: 'nadi-shodhana-panic',
    voice: 'dascha',
    names: {
      en: 'Alternate Nostril Calming',
      de: 'Wechselatmung beruhigend',
      ja: '落ち着き片鼻呼吸',
    },
    instructions: {
      en: `Alternate Nostril Calming. Close your right nostril with your thumb. Inhale through the left for six seconds. Pause two seconds. Close the left nostril with your ring finger and exhale through the right for eight seconds. Pause again. Then reverse. The continuous side switching balances both brain hemispheres and lowers cortisol.`,
      de: `Wechselatmung beruhigend. Schließe das rechte Nasenloch mit dem Daumen. Atme links sechs Sekunden ein. Pausiere zwei Sekunden. Schließe das linke Nasenloch mit dem Ringfinger und atme rechts acht Sekunden aus. Pausiere wieder. Dann wechseln. Der ständige Seitenwechsel balanciert beide Gehirnhälften und senkt das Cortisol.`,
      ja: `落ち着き片鼻呼吸。親指で右の鼻孔を閉じます。左から6秒で吸います。2秒止めます。薬指で左の鼻孔を閉じ、右から8秒で吐きます。もう一度休みます。次に左右を入れ替えます。連続した左右の切り替えが両脳半球のバランスを取り、コルチゾールを下げます。`,
    },
  },
  {
    id: 'walking-breath-simple',
    voice: 'matthi',
    names: {
      en: 'Walking Breath',
      de: 'Geh-Atmung',
      ja: '歩く呼吸',
    },
    instructions: {
      en: `Walking Breath. Walk at a comfortable pace, about one breath every four steps. Inhale for four seconds, exhale for four. No counting needed. Just attend to your breath and the rhythm of your feet. The combination of movement and breathing interrupts ruminative thought.`,
      de: `Geh-Atmung. Gehe in gemütlichem Tempo, etwa ein Atemzug pro vier Schritte. Vier Sekunden einatmen, vier Sekunden ausatmen. Kein Zählen nötig. Achte einfach auf deinen Atem und den Rhythmus deiner Schritte. Die Kombination von Bewegung und Atmung unterbricht das Gedankenkreisen.`,
      ja: `歩く呼吸。心地よいペースで歩きます。4歩ごとに1回の呼吸が目安です。4秒で吸って、4秒で吐きます。数える必要はありません。呼吸と足のリズムに意識を向けるだけ。動きと呼吸の組み合わせが反芻思考を断ち切ります。`,
    },
  },
  {
    id: 'walking-breath-counted',
    voice: 'dascha',
    names: {
      en: 'Walking Breath three-six',
      de: 'Geh-Atmung drei-sechs',
      ja: '歩く呼吸 三六',
    },
    instructions: {
      en: `Walking Breath three-six. Inhale for three steps, exhale for six. The one-to-two ratio activates the parasympathetic system even during movement. Counting steps half-aloud occupies enough cognitive bandwidth to block panic ideation. Especially helpful when panic begins on a walk.`,
      de: `Geh-Atmung drei-sechs. Atme über drei Schritte ein, über sechs Schritte aus. Das eins-zu-zwei Verhältnis aktiviert das parasympathische System auch in Bewegung. Wenn du die Schritte halblaut zählst, blockiert das Gedanken an Panik. Besonders hilfreich, wenn beim Gehen Panik aufkommt.`,
      ja: `歩く呼吸 三六。3歩で吸って、6歩で吐きます。1対2の比率が、動いている時でも副交感神経系を活性化します。歩数を小声で数えるとパニックの考えが入る余地がなくなります。歩いている時にパニックが始まった場合に特に役立ちます。`,
    },
  },
  {
    id: 'bhramari-humming',
    voice: 'matthi',
    names: {
      en: 'Humming Bee Breath',
      de: 'Bienensumm-Atmung',
      ja: 'ハチの羽音呼吸',
    },
    instructions: {
      en: `Humming Bee Breath. Lips lightly closed, teeth not clenched. Inhale through the nose for four seconds, then exhale eight seconds with an audible hum, mmm. The vibration directly stimulates the vagus nerve through the inner ear and pharynx. Particularly effective for tension headaches.`,
      de: `Bienensumm-Atmung. Lippen leicht geschlossen, Zähne nicht zusammengepresst. Atme vier Sekunden durch die Nase ein, dann acht Sekunden aus mit einem hörbaren Summen, mmm. Die Vibration stimuliert den Vagusnerv direkt über Innenohr und Rachen. Besonders wirksam bei Spannungskopfschmerzen.`,
      ja: `ハチの羽音呼吸。唇は軽く閉じ、歯は噛みしめません。4秒で鼻から吸って、8秒で「ンンン」と聞こえる音を出しながら吐きます。振動が内耳と咽頭を通して迷走神経を直接刺激します。緊張性頭痛に特に効果的です。`,
    },
  },
  {
    id: 'sitali-cooling',
    voice: 'dascha',
    names: {
      en: 'Cooling Breath Sitali',
      de: 'Kühlatmung Sitali',
      ja: '冷却呼吸シータリー',
    },
    instructions: {
      en: `Cooling Breath Sitali. Curl your tongue, or purse your lips if you can't. Inhale four seconds through the curled tongue. Close the mouth and exhale six seconds through the nose. The cooling sensation soothes the upper digestive tract via the vagus nerve. Particularly effective postprandially for heartburn.`,
      de: `Kühlatmung Sitali. Rolle die Zunge, oder spitze die Lippen, wenn du sie nicht rollen kannst. Atme vier Sekunden durch die gerollte Zunge ein. Schließe den Mund und atme sechs Sekunden durch die Nase aus. Das Kühlgefühl beruhigt den oberen Verdauungstrakt über den Vagusnerv. Besonders wirksam nach dem Essen bei Sodbrennen.`,
      ja: `冷却呼吸シータリー。舌を丸めるか、できなければ唇をすぼめます。丸めた舌から4秒で吸います。口を閉じ、鼻から6秒で吐きます。冷却感が迷走神経を介して上部消化管を鎮めます。食後の胸焼けに特に効果的です。`,
    },
  },
  {
    id: 'buteyko-reduced',
    voice: 'matthi',
    names: {
      en: 'Buteyko Reduced Breath',
      de: 'Buteyko-Reduktionsatmung',
      ja: 'ブテイコ縮小呼吸',
    },
    instructions: {
      en: `Buteyko Reduced Breath. Breathe very quietly and lightly through the nose. Three seconds in, three seconds out, then a four-second control pause without air hunger. This corrects chronic hyperventilation that underlies many panic and irritable bowel symptoms by raising your CO₂ tolerance.`,
      de: `Buteyko-Reduktionsatmung. Atme sehr leise und leicht durch die Nase. Drei Sekunden ein, drei Sekunden aus, dann eine vier-Sekunden-Kontrollpause ohne Lufthunger. Das korrigiert die chronische Hyperventilation, die vielen Panik- und Reizdarmbeschwerden zugrunde liegt, indem die CO₂-Toleranz steigt.`,
      ja: `ブテイコ縮小呼吸。鼻から非常に静かに、軽く呼吸します。3秒で吸って、3秒で吐いて、空気飢餓感のない4秒のコントロール一時停止。これが多くのパニックや過敏性腸の症状の根底にある慢性過呼吸を修正し、二酸化炭素耐性を高めます。`,
    },
  },
];

// ── ElevenLabs TTS ──────────────────────────────────────
function synthesize(voiceId, text, voiceSettings) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: voiceSettings,
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

const voiceIdFor = v => v === 'matthi' ? MATTHI_ID : DASCHA_ID;

// Settings tuned for short labels (more stable) vs long narration (more expressive)
const NAME_SETTINGS = { stability: 0.65, similarity_boost: 0.80, style: 0.10 };
const INSTRUCTION_SETTINGS = { stability: 0.45, similarity_boost: 0.80, style: 0.20 };

async function generateAppNameClips() {
  console.log('\n━━ App name clips ━━');
  fs.mkdirSync(APP_AUDIO_DIR, { recursive: true });

  for (const tech of TECHNIQUES) {
    for (const lang of LANGS) {
      const text = tech.names[lang];
      for (const voice of ['matthi', 'dascha']) {
        const langSuffix = lang === 'en' ? '' : `-${lang}`;
        const filename = `${voice}-name-${tech.id}${langSuffix}.mp3`;
        const outFile = path.join(APP_AUDIO_DIR, filename);
        if (!FORCE && fs.existsSync(outFile)) {
          console.log(`  skip (exists): ${filename}`);
          continue;
        }
        process.stdout.write(`  [${voice} ${lang}] ${filename} … `);
        try {
          const audio = await synthesize(voiceIdFor(voice), text, NAME_SETTINGS);
          fs.writeFileSync(outFile, audio);
          console.log(`done (${audio.length} bytes)`);
        } catch (err) {
          console.error(`FAILED: ${err.message}`);
        }
      }
    }
  }
}

async function generateWebInstructionClips() {
  console.log('\n━━ Web instruction clips ━━');
  fs.mkdirSync(WEB_AUDIO_DIR, { recursive: true });

  for (const tech of TECHNIQUES) {
    for (const lang of LANGS) {
      const text = tech.instructions[lang];
      const filename = `${tech.id}-${lang}.mp3`;
      const outFile = path.join(WEB_AUDIO_DIR, filename);
      if (!FORCE && fs.existsSync(outFile)) {
        console.log(`  skip (exists): ${filename}`);
        continue;
      }
      process.stdout.write(`  [${tech.voice} ${lang}] ${filename} (${text.length} chars) … `);
      try {
        const audio = await synthesize(voiceIdFor(tech.voice), text, INSTRUCTION_SETTINGS);
        fs.writeFileSync(outFile, audio);
        console.log(`done (${audio.length} bytes)`);
      } catch (err) {
        console.error(`FAILED: ${err.message}`);
      }
    }
  }
}

// Manifest for the web player to know which clips exist + voice mapping
function writeWebManifest() {
  const manifest = {
    generated: new Date().toISOString(),
    techniques: TECHNIQUES.map(t => ({
      id: t.id,
      voice: t.voice,
      names: t.names,
      audioByLang: Object.fromEntries(
        LANGS.map(lang => [lang, `audio/techniques/${t.id}-${lang}.mp3`])
      ),
    })),
  };
  const manifestPath = path.join(WEB_AUDIO_DIR, 'manifest.json');
  fs.mkdirSync(WEB_AUDIO_DIR, { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote manifest: ${manifestPath}`);
}

// ── Main ───────────────────────────────────────────────
async function main() {
  console.log(`Languages: ${LANGS.join(', ')}, scope: ${SCOPE}`);
  console.log(`Voice IDs: matthi=${MATTHI_ID}, dascha=${DASCHA_ID}`);

  if (SCOPE === 'app' || SCOPE === 'all') await generateAppNameClips();
  if (SCOPE === 'web' || SCOPE === 'all') {
    await generateWebInstructionClips();
    writeWebManifest();
  }
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
