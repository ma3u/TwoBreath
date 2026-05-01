# TwoBreath

**One Breath. Two Souls. Every Day.**

Marketing website for TwoBreath — a couples breathing ritual app for iOS and Apple Watch.

- [Website](https://ma3u.github.io/TwoBreath/)
- [Privacy Policy](https://ma3u.github.io/TwoBreath/privacy.html)
- [Pitch deck](https://www.twobreath.com/pitch.html)

---

## Big Berlin Hack 2026 — Day 1

**2026-04-25 · Peec AI / AnswerAtlas track**

> *One breath. Two souls.*

During Easter holidays, Matthi and Dascha developed a couple breathing app turning a personal three-year breathing ritual into a discoverable product across AI search, web, and social.

### Challenge

Our visibility was 0%. We had no idea how to make our product discoverable to AI engines, and thus to the millions of people asking for breathing techniques, relationship advice, and Apple Health apps for couple bonding and stress relief and VO2max and HRV improvement. 

### What we did

Our hack team make an incredible amount of progress in one day, building a marketing flywheel across three rails — website, video, social — all orchestrated by Claude Code and powered by Peec AI's visibility tracking and Google DeepMind's multilingual TTS, Video and image generation via MCP integrations where Claude Code fails. 

In one day we shipped five rails:

1. **Market analysis** — 150 prompts across English, German and Japanese · 7 competitors tracked (Calm, Headspace, Insight Timer, Paired, Lasting, Relish, Gottman) · daily runs across ChatGPT, Gemini, Google AI Overview.
2. **Website SEO / AI-visibility** — `www.twobreath.com` rewritten for AI discoverability: full JSON-LD structured data (Organization, WebSite, MobileApplication, FAQPage), 8 high-intent FAQs, canonical URL, OG/Twitter cards. Live on GitHub Pages.
3. **YouTube videos** — 3 long-form scripts (morning ritual, co-regulation explainer, technique comparison) plus a 1:45 product walkthrough voiced in **English, German and Japanese**.
4. **Instagram Reels** — 5 Reel scripts with AI-parseable captions, hashtag strategy, and a posting cadence.
5. **Reddit posts** — 5 community-first posts for r/relationships, r/Meditation, r/marriage, r/polyvagal, r/AppleWatch, with an engagement playbook.

Market and Competitor Analysis with Peec.ai
![Market Analysis](image.png)

Prompt Analysis with Peec.ai
![Prompt Analsis](image-1.png)

Plus the supporting work: a 7-slide deck pitch (`/pitch.html`) and a measurement loop (Peec re-check scheduled for 2026-05-05 to compare against today's baseline).

### Partner solutions

| Partner | Role | Where it shows up |
|---|---|---|
| **Peec AI** | AI-answer visibility tracking · 100-prompt grid · 7-competitor citation graph · daily runs across ChatGPT / Gemini / Google AI Overview | The compass. Without it we had no map of where to attack per locale. → `plans/peec-ai-visibility-plan.md` |
| **Google DeepMind · Gemini TTS** | Multilingual narration in EN / DE / JA (Aoede voice, gemini-2.5-flash-tts) | generate  `/voiceover/twobreath_{en,de,ja}.mp4` `/marketing/` linkedin, reddit, youtube, instagramm audio, video assets|
| **GitHub Pages** | Static hosting of `www.twobreath.com` with CI deploy on push | The live site |
| **Claude Code** (Anthropic) | Orchestrator. Code, copy, voiceover, deploy in one loop — across web, video, and social rails | This entire day's output, including this README |
| **ElevenLabs** | Voice cloning of Matthi & Dascha (Multilingual v2) | `audio/narration/{en,de,ja}/` — the 11-section pitch narration |

### Today's progress, in numbers

```
✓ 150+ Peec AI prompts          live · EN/DE/JP
✓ 7 competitor brands tracked  Calm, Headspace, Insight Timer, Paired, Lasting, Relish, Gottman
✓ 3 AI engines monitored       ChatGPT, Gemini, Google AI Overview
✓ 8 high-intent FAQs           on twobreath.com — explicit positioning vs Calm/Headspace/Insight Timer
✓ JSON-LD structured data      Organization · WebSite · MobileApplication · FAQPage
✓ 3 YouTube scripts            morning ritual · co-regulation · technique comparison
✓ 1:45 product walkthrough     voiced in EN, DE, JA via Gemini Aoede
✓ 5 Instagram Reel scripts     captions · hashtags · posting cadence
✓ 5 Reddit posts               r/relationships · r/Meditation · r/marriage · r/polyvagal · r/AppleWatch
✓ Measurement loop set         Peec re-check on 2026-05-05 vs today's baseline
```

Baseline before today: **visibility 0%**, 3 mentions in 788 chats, 1 brand tracked (just us), 0 FAQ schema, no canonical URL.

### Tech stack diagram

See `pitch.html` chapter 06 — *"One Claude Code · Three rails to launch"* — and the rendered SVG at `images/pitch/p05-tools.svg`.

```
                        Claude Code
                       (orchestrator)
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
       GitHub          Peec AI MCP       DeepMind MCP
    repo · CI · Pages  AI search compass  Veo · Imagen · TTS
          │                 │                 │
    twobreath.com     Marketing Plan     Social Media
    live · schema     150 prompts        video · image · voice
    site · FAQ        7 competitors      YT · IG · TT · RD
```

### How to reproduce

| Output | Script / file |
|---|---|
| Peec AI prompt grid | run via `peec-ai` MCP server (see `~/.claude` MCP config) |
| Multilingual TTS videos | `../voiceover/source.mp4` + Gemini TTS via `gemini-media` MCP, then `ffmpeg` mux |
| Site narration (Matthi/Dascha cloned voices) | `generate-narration.js` (requires `ELEVENLABS_API_KEY`) |
| YouTube / Reels / Reddit copy | `marketing/youtube-scripts.md`, `marketing/instagram-reels.md`, `marketing/reddit-posts.md` |
| Visibility plan + execution log | `plans/peec-ai-visibility-plan.md` |
| Pitch deck | `pitch.html` (live at `/pitch.html`) |

### Team

- **Ian** - Lead the Team 
- **Matthi** — build, code, deploy
- **Nicolai** - Industrial coder
- **Rohit** - YouTube video production
- **Sanyukta** - Voice and audio expert

After three years of breathing together, we built the app no one else made — for couples.

### App in action

| iPhone — Home | iPhone — Health Dashboard | Apple Watch — Today's session |
|:---:|:---:|:---:|
| ![TwoBreath iPhone home screen showing the Strengthening level 6 routine and Start Together button](images/screenshot-iphone-home.jpeg) | ![Health Dashboard showing HRV and Resting Heart Rate trends correlated with breathing sessions](images/screenshot-iphone-dashboard.jpeg) | ![Apple Watch showing the Morning Together 1 session with a 3-minute play button](images/screenshot-watch-home.png) |

### Links

- [TwoBreathBig Berlin Hack Pitch Video](https://www.youtube.com/watch?v=oaaEZBEuCL0) 1:20min
- Pitch: https://www.twobreath.com/pitch.html
- Site: https://www.twobreath.com
- [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7453877649409568768/)
- Visibility plan + log: `plans/peec-ai-visibility-plan.md`

---

*Day 1 of Big Berlin Hack 2026. Five rails shipped. Measurement loop running. The map is no longer empty.*
