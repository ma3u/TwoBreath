#!/usr/bin/env node
/**
 * TwoBreath – ElevenLabs narration generator
 * Generates DE and JA narration audio for all 11 sections using Matthi + Dascha voice clones.
 * EN files are also regenerated so all languages use the real voice clones.
 *
 * Usage:
 *   node generate-narration.js [--lang en|de|ja|all] [--force]
 *
 * Output: audio/narration/{lang}/s00-hero.mp3 … s10-cta.mp3
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
const LANGS = args.includes('--lang') ? [args[args.indexOf('--lang') + 1]] : ['en', 'de', 'ja'];
const FORCE = args.includes('--force');

// ── Narration scripts ───────────────────────────────────
// voice: 'matthi' | 'dascha'
const NARRATION = {
  en: [
    {
      key: 's00-hero', voice: 'matthi',
      text: `One breath. Two souls. Every morning.
After seven years together, we realized love wasn't enough on its own — we needed a ritual. This is TwoBreath: a daily breathing practice for couples, grounded in science, built on presence.`,
    },
    {
      key: 's01-story', voice: 'dascha',
      text: `The first years felt effortless — the oxytocin rush, the butterflies, the can't-stop-thinking-about-you phase.
Then, somewhere around year three, the chemistry that had carried us quietly shifted. We were still deeply in love. But something had changed. And we had to choose what to do about it.`,
    },
    {
      key: 's02-shift', voice: 'matthi',
      text: `Helen Fisher's research at Rutgers shows the dopamine-driven high of early love peaks in the first 18 months — then gradually fades by year three to seven.
John Gottman's studies confirm it: the first seven years are the highest-risk period for relationships. Not because love dies — but because the automatic chemistry that sustained it does.`,
    },
    {
      key: 's03-wisdom', voice: 'dascha',
      text: `Harvard professor Arthur Brooks has spent years translating happiness research into something actionable.
His conclusion: falling in love is involuntary. Staying in love is a choice and a practice. The goal is not to recapture the high of early love — it's to build something better. Deeper. More real. More chosen.`,
    },
    {
      key: 's04-rightbrain', voice: 'matthi',
      text: `Screens activate the analytical left brain. But when you close your eyes and follow a voice guiding your breath, the right hemisphere takes over.
You become aware of your partner's breathing beside you. You feel the warmth of their hand. You sense their presence without seeing them. That's why TwoBreath is audio-first — the deepest connection happens when you stop looking and start feeling.`,
    },
    {
      key: 's05-research', voice: 'dascha',
      text: `The science is compelling. Synchronized breathing between partners creates measurable physiological and neurological changes.
Partners show coregulation of heart rate and respiration. Pain tolerance increases through touch and synchronized breath. Vagal tone synchronizes. Brainwaves align. This isn't wellness speculation — it's peer-reviewed research from leading universities.`,
    },
    {
      key: 's06-ritual', voice: 'matthi',
      text: `We lay side by side in our warm, cozy bed. The room is still quiet. One of us reaches over and opens the window just enough to let in the cool morning air.
We hold hands. Close our eyes. And begin. Before the phone. Before the news. Before the world.
A romantic poem, a philosophical thought, spoken aloud. Then deep eye contact — the kind you shared when you first fell in love. Three to fifteen minutes of breath. One to three minutes of reading. One to three minutes of pure presence.`,
    },
    {
      key: 's07-measure', voice: 'dascha',
      text: `We wear our Apple Watches during every morning session.
The question that drives us: do our hearts actually synchronize? Can we measure the effect on our physiology — heartbeat, HRV, cortisol? Research says yes. And we want to see it in our own data.`,
    },
    {
      key: 's08-vision', voice: 'matthi',
      text: `Some mornings, travel or life separates us. But the ritual doesn't have to stop.
Our vision: a way for couples to connect remotely through synchronized breathing — feeling each other's presence through shared rhythm, even across time zones. One breath. One bond. Wherever you are.`,
    },
    {
      key: 's09-changes', voice: 'dascha',
      text: `What changes when you breathe together daily?
Cortisol drops. Heart rate synchronizes. Gottman's research shows couples who share six hours of positive connection per week report dramatically higher relationship satisfaction. Two minutes of shared breath every morning — that's what TwoBreath gives you.`,
    },
    {
      key: 's10-cta', voice: 'matthi',
      text: `Two breaths. One bond.
Open the window tomorrow morning. Sit side by side. Hold hands. Breathe.
If you want to measure the effect, or help us prove it scientifically, join our beta tester program.
See what changes.`,
    },
  ],

  de: [
    {
      key: 's00-hero', voice: 'matthi',
      text: `Ein Atem. Zwei Seelen. Jeden Morgen.
Nach sieben Jahren zusammen haben wir verstanden: Liebe allein reicht nicht — wir brauchten ein Ritual. Das ist TwoBreath: eine tägliche Atemübung für Paare, wissenschaftlich fundiert und auf Präsenz aufgebaut.`,
    },
    {
      key: 's01-story', voice: 'dascha',
      text: `Die ersten Jahre fühlten sich mühelos an — der Oxytocin-Rausch, die Schmetterlinge, die Du-gehst-mir-nicht-aus-dem-Kopf-Phase.
Dann, irgendwann um das dritte Jahr herum, veränderte sich die Chemie, die uns getragen hatte. Wir waren noch tief verliebt. Aber etwas hatte sich gewandelt. Und wir mussten entscheiden, was wir damit machen.`,
    },
    {
      key: 's02-shift', voice: 'matthi',
      text: `Helen Fishers Forschung an der Rutgers University zeigt: Der Dopamin-Rausch der frühen Liebe erreicht seinen Höhepunkt in den ersten 18 Monaten — und nimmt dann bis zum dritten bis siebten Jahr langsam ab.
John Gottmans Studien bestätigen es: Die ersten sieben Jahre sind die Hochrisikozeit für Beziehungen. Nicht weil die Liebe stirbt — sondern weil die automatische Chemie, die sie getragen hat, nachlässt.`,
    },
    {
      key: 's03-wisdom', voice: 'dascha',
      text: `Harvard-Professor Arthur Brooks hat Jahre damit verbracht, Glücksforschung in etwas Umsetzbares zu übersetzen.
Sein Fazit: Sich zu verlieben ist unwillkürlich. Verliebt zu bleiben ist eine Entscheidung und eine Praxis. Das Ziel ist nicht, den Rausch der frühen Liebe zurückzugewinnen — es geht darum, etwas Besseres aufzubauen. Tiefer. Realer. Mehr gewählt.`,
    },
    {
      key: 's04-rightbrain', voice: 'matthi',
      text: `Bildschirme aktivieren die analytische linke Gehirnhälfte. Aber wenn du die Augen schließt und einer Stimme folgst, die deinen Atem führt, übernimmt die rechte Hemisphäre.
Du wirst dir bewusst, wie dein Partner neben dir atmet. Du spürst die Wärme seiner Hand. Du nimmst seine Gegenwart wahr, ohne ihn zu sehen. Deshalb ist TwoBreath audio-first — die tiefste Verbindung entsteht, wenn du aufhörst zu schauen und anfängst zu fühlen.`,
    },
    {
      key: 's05-research', voice: 'dascha',
      text: `Die Wissenschaft ist überzeugend. Synchrones Atmen zwischen Partnern erzeugt messbare physiologische und neurologische Veränderungen.
Partner zeigen eine Ko-Regulation von Herzfrequenz und Atmung. Die Schmerztoleranz steigt durch Berührung und synchrones Atmen. Der Vagustonus synchronisiert sich. Gehirnwellen gleichen sich an. Das ist keine Wellness-Spekulation — es ist begutachtete Forschung führender Universitäten.`,
    },
    {
      key: 's06-ritual', voice: 'matthi',
      text: `Wir liegen nebeneinander in unserem warmen, gemütlichen Bett. Es ist noch ruhig. Einer von uns öffnet das Fenster einen Spalt, damit die kühle Morgenluft hereinströmt.
Wir halten uns an den Händen. Schließen die Augen. Und beginnen. Vor dem Handy. Vor den Nachrichten. Vor der Welt.
Ein romantisches Gedicht, ein philosophischer Gedanke, laut vorgelesen. Dann tiefer Augenkontakt, so wie damals, als ihr euch verliebt habt. Drei bis fünfzehn Minuten Atmen. Ein bis drei Minuten Lesen. Ein bis drei Minuten reines Präsentsein.`,
    },
    {
      key: 's07-measure', voice: 'dascha',
      text: `Wir tragen unsere Apple Watches bei jeder Morgensession.
Die Frage, die uns antreibt: Synchronisieren sich unsere Herzen tatsächlich? Können wir den Effekt auf unsere Physiologie messen — Herzschlag, HRV, Cortisol? Die Forschung sagt Ja. Und wir wollen es in unseren eigenen Daten sehen.`,
    },
    {
      key: 's08-vision', voice: 'matthi',
      text: `Manche Morgen trennt uns Reise oder das Leben. Aber das Ritual muss nicht aufhören.
Unsere Vision: ein Weg für Paare, sich aus der Ferne durch synchrones Atmen zu verbinden — die Gegenwart des anderen durch gemeinsamen Rhythmus spüren, auch über Zeitzonen hinweg. Ein Atem. Eine Verbindung. Wo auch immer ihr seid.`,
    },
    {
      key: 's09-changes', voice: 'dascha',
      text: `Was ändert sich, wenn ihr täglich gemeinsam atmet?
Cortisol sinkt. Die Herzfrequenz synchronisiert sich. Gottmans Forschung zeigt: Paare, die sechs Stunden positive Verbindung pro Woche teilen, berichten von deutlich höherer Beziehungszufriedenheit. Zwei Minuten gemeinsamer Atem jeden Morgen — das ist es, was TwoBreath euch gibt.`,
    },
    {
      key: 's10-cta', voice: 'matthi',
      text: `Zwei Atemzüge. Eine Verbindung.
Öffne morgen früh das Fenster. Setzt euch nebeneinander. Hände halten. Atmet.
Wenn ihr den Effekt messen oder uns helfen wollt, ihn wissenschaftlich zu belegen — meldet euch als Beta-Tester an.
Schaut, was sich verändert.`,
    },
  ],

  ja: [
    {
      key: 's00-hero', voice: 'matthi',
      text: `一つの息。二つの魂。毎朝。
7年間一緒にいて気づきました。愛だけでは足りない、儀式が必要だと。これがTwoBreathです。科学に基づいた、プレゼンスを育むカップルのための毎日の呼吸の実践です。`,
    },
    {
      key: 's01-story', voice: 'dascha',
      text: `最初の数年は自然でした。オキシトシンの高揚感、胸のときめき、あなたのことばかり考えてしまう段階。
それから、3年目ごろに、私たちを支えていた化学反応がそっと変化しました。まだ深く愛し合っていました。でも何かが変わった。そして、どうするかを選ばなければなりませんでした。`,
    },
    {
      key: 's02-shift', voice: 'matthi',
      text: `ラトガース大学でのヘレン・フィッシャーの研究が示すこと。初期の愛のドーパミン主導の高揚感は最初の18ヶ月にピークを迎え、その後3〜7年で徐々に薄れていきます。
ジョン・ゴットマンの縦断研究が確認しています。最初の7年間が、関係にとって最もリスクの高い時期です。愛が死ぬからではなく、それを支えていた自動的な化学反応が消えるからです。`,
    },
    {
      key: 's03-wisdom', voice: 'dascha',
      text: `ハーバードのアーサー・ブルックス教授は、幸福研究を実践に変えることに何年も費やしてきました。
彼の結論。恋に落ちることは不随意です。恋し続けることは選択と実践です。目標は初期の愛の高揚を取り戻すことではありません。より良いものを築くことです。より深く、よりリアルで、より選ばれた愛を。`,
    },
    {
      key: 's04-rightbrain', voice: 'matthi',
      text: `スクリーンは分析的な左脳を活性化します。でも目を閉じて、呼吸を導く声に従うと、右脳が主導権を握ります。
隣でパートナーが呼吸しているのに気づきます。その手の温もりを感じます。見なくてもその存在を感じます。だからTwoBreathはオーディオファーストなのです。見るのをやめて感じ始めたとき、最も深いつながりが生まれます。`,
    },
    {
      key: 's05-research', voice: 'dascha',
      text: `科学は説得力があります。パートナー間の同期した呼吸は、測定可能な生理的・神経学的変化を生み出します。
パートナーは心拍数と呼吸の共調整を示します。触れ合いと同期した呼吸で痛みへの耐性が高まります。迷走神経緊張が同期します。脳波が揃います。これはウェルネスの思索ではありません。主要大学からの査読済みの研究です。`,
    },
    {
      key: 's06-ritual', voice: 'matthi',
      text: `温かくて居心地のいいベッドに並んで横たわります。部屋はまだ静かです。どちらかが手を伸ばし、朝の涼しい空気が入るよう窓を少し開けます。
手をつなぎます。目を閉じます。そして始めます。スマホより先に。ニュースより先に。世界より先に。
ロマンティックな詩、哲学的な言葉を声に出して読みます。それから深いアイコンタクト。最初に恋に落ちた頃のような。3〜15分の呼吸。1〜3分の朗読。1〜3分の純粋な存在。`,
    },
    {
      key: 's07-measure', voice: 'dascha',
      text: `毎朝のセッションでApple Watchをつけています。
私たちを動かす問い。心臓は本当に同期するのか？TwoBreathの生理的影響、心拍、HRV、コルチゾールを測定できるのか？研究はYesと言っています。私たち自身のデータで確かめたいのです。`,
    },
    {
      key: 's08-vision', voice: 'matthi',
      text: `旅行や生活で離れる朝もあります。でも儀式を止める必要はありません。
私たちのビジョン。カップルが同期した呼吸を通じてリモートでつながる方法。タイムゾーンを超えても、共有リズムを通じてお互いの存在を感じること。一つの息。一つの絆。どこにいても。`,
    },
    {
      key: 's09-changes', voice: 'dascha',
      text: `毎日一緒に呼吸すると何が変わるのか？
コルチゾールが下がります。心拍が同期します。ゴットマンの研究が示すこと。週に6時間のポジティブなつながりを共有するカップルは、関係満足度が劇的に高いと報告しています。毎朝2分間の共有呼吸、それがTwoBreathが与えるものです。`,
    },
    {
      key: 's10-cta', voice: 'matthi',
      text: `二つの呼吸。一つの絆。
明日の朝、窓を開けて。並んで座って。手を握って。呼吸して。
効果を測定したい方、または科学的に証明するのを手伝いたい方は、ベータテスタープログラムに参加してください。
何が変わるか、見てみましょう。`,
    },
  ],
};

// ── ElevenLabs TTS ──────────────────────────────────────
function synthesize(voiceId, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.80, style: 0.15 },
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
  for (const lang of LANGS) {
    const tracks = NARRATION[lang];
    if (!tracks) { console.warn(`  unknown lang: ${lang}`); continue; }

    const dir = path.join(__dirname, 'audio', 'narration', lang);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`\n── ${lang.toUpperCase()} narration ──`);
    for (const track of tracks) {
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
        console.log('done');
      } catch (err) {
        console.error(`FAILED: ${err.message}`);
      }
    }
  }
  console.log('\nDone. Narration files written to audio/narration/{lang}/');
}

main().catch(err => { console.error(err); process.exit(1); });
