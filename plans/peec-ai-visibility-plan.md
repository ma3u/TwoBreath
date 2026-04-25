# TwoBreath AI Visibility Analysis & Plan

_Generated 2026-04-25 from Peec AI data (last 30 days)._
_Last updated: 2026-04-25 — execution log added_

## Progress log

### ✅ Done (2026-04-25)

**Peec setup**
- 100 prompts created across EN (34) / DE (33) / JP (33) in 6 topics
- 7 competitor brands added: Calm, Headspace, Insight Timer, Paired, Lasting, Relish, Gottman
- Daily prompt runs active across ChatGPT, Gemini, Google AI Overview

**Website AI-visibility optimization** — deployed live to `www.twobreath.com` (commit `8a176ed`)
- Title + meta description rewritten to lead with "Synchronized Breathing App for Couples"
- Canonical URL added, OG/Twitter URLs fixed (was pointing at github.io subdomain)
- `keywords` meta with 11 prompt-aligned terms
- Full JSON-LD structured data: Organization + WebSite + MobileApplication + FAQPage with 8 high-intent Q&As
- Hero pill changed from poetic to AI-discoverable
- FAQ explicitly positions vs Calm / Headspace / Insight Timer (the competitive gap AI was missing)

**Marketing content drafted** — `/marketing/`
- `youtube-scripts.md` — 3 full video scripts (morning ritual, co-regulation explainer, technique comparison) with descriptions, chapters, tags
- `reddit-posts.md` — 5 posts for r/relationships, r/Meditation, r/marriage, r/polyvagal, r/AppleWatch + engagement playbook
- `instagram-reels.md` — 5 Reel scripts with AI-parseable captions, hashtag strategy, posting cadence

**Measurement loop set**
- 10-day check-in scheduled for 2026-05-05 09:00 (Google Calendar event with embedded prompt) → fresh Peec report comparing against 2026-04-25 baseline

### ⏳ In progress / pending
- Activate Perplexity + Copilot in Peec dashboard (project settings) — user action
- Record YouTube videos (3) — user + partner
- Build Reddit karma in target subs — week-long background activity
- Shoot Instagram Reels (5) — user + partner

---

## Current state

**Visibility: 0% — TwoBreath is essentially invisible to AI engines.**

| Metric | Value | Benchmark |
|---|---|---|
| Visibility | 0% (3 mentions in 788 chats) | >50% strong, <20% weak |
| Sentiment | 59 | Normal 65–85, **<60 = problem zone** |
| Position when mentioned | 1.0 | Excellent (top of list when seen) |
| Brands tracked | 1 (just you) | Need 5–10 competitors |
| Active engines | 3 of 17 | ChatGPT, Gemini, AI Overview |

## 1. Best prompts to optimize first

Only **2 prompts** have produced any visibility — these are your launchpads:

| Rank | Prompt | Visibility | Sentiment | Action |
|---|---|---|---|---|
| 🥇 | "breathing apps for couples" (EN, high volume) | **22%** | 52 ⚠️ | **Sentiment fix priority** |
| 🥈 | "Show me guided breathing apps designed specifically for partners to connect better." | **13%** | 73 ✅ | Reinforce positioning |

**The "breathing apps for couples" prompt is your gold mine** — high search volume, AI already knows you exist, but sentiment is poor (52). Fix the wording around how AI describes you, not whether it mentions you.

**98 prompts still at 0%** — opportunity, but they need 7–14 days of fresh data first.

## 2. Where AI gets its answers (citation domains)

These are the sources AI engines cite when answering couples-breathing questions. **Get TwoBreath onto these surfaces:**

| Domain | Type | Retrieval % | Priority |
|---|---|---|---|
| youtube.com | UGC | 22% | 🎯 HIGH — create demo videos |
| reddit.com | UGC | 12% | 🎯 HIGH — r/relationships, r/Meditation |
| apple.com | Corporate | 8% | ✅ Already cited with you |
| insighttimer.com | Wellness | 7% | Partnership/listing |
| marriage.com | Editorial | 7% | Guest post/PR target |
| calm.com / headspace.com | Competitor space | 4–5% | Editorial mentions |
| psychcentral.com / psychologytoday.com | Reference | 3–5% | Expert article placement |
| nih.gov | Research | 3% | Cite studies on your site |

## 3. Gemini & the AI engine landscape

**Yes, Gemini is supported in Peec** — and currently active for your project (`gemini-scraper` + `google-ai-overview-scraper`).

**Currently running**: ChatGPT, Gemini, Google AI Overview
**Inactive (can be enabled)**: Perplexity, Copilot, Claude Haiku/Sonnet, AI Mode, GPT-4o, Grok, DeepSeek, Llama, Sonar, Qwen

## 4. AI search market reality (April 2026)

| Engine | Reach | Why it matters for TwoBreath |
|---|---|---|
| **ChatGPT** | 900M weekly active users, 68% AI chatbot share | #1 priority — direct user queries |
| **Gemini (Google AI Overviews)** | 2B monthly users in Search, 18% of all searches show AI Overview | Massive passive reach — captures Google searchers |
| **Gemini app** | 750M MAU, 18% chatbot share, fastest-growing (+30% MoM) | Mobile-native, Android default |
| **Perplexity** | 45M MAU, 170M monthly visits, 6–8% share | Research-heavy users, citation-driven |
| **Copilot** | ~9% chatbot share | Microsoft ecosystem, enterprise |

ChatGPT + Gemini together = ~85% of AI conversational search. Your 3 active engines cover this — good baseline.

## 5. Plan — priority phases

### Phase 1 — Foundations (P0)
1. ✅ **Add competitors to Peec** — Calm, Headspace, Insight Timer, Lasting, Paired, Relish, Gottman.
2. ⏳ **Activate Perplexity + Copilot** in Peec dashboard (project settings → models).
3. ✅ **Webapp wording + structured data** deployed to `www.twobreath.com`:
   - Title + meta description leading with "Synchronized Breathing App for Couples"
   - JSON-LD: Organization + WebSite + MobileApplication + FAQPage with 8 high-intent Q&As
   - Hero pill rewritten for AI discoverability
   - FAQ explicitly differentiates vs Calm / Headspace / Insight Timer
4. ⏳ **Verify schema parses** — use the Claude Chrome plugin on `www.twobreath.com` to inspect the deployed JSON-LD. Backup: [Google Rich Results Test](https://search.google.com/test/rich-results), [Schema.org Validator](https://validator.schema.org/).

### Phase 2 — Citation surface capture (P1)
YouTube = 22% AI citation, Reddit = 12%. Highest-leverage channels for this niche.
5. ✅ **YouTube scripts drafted** — `marketing/youtube-scripts.md` (3 videos: morning ritual, co-regulation explainer, technique comparison)
6. ⏳ **Record + publish YouTube Video #1** (morning ritual demo) — single most leveraged action
7. ✅ **Reddit posts drafted** — `marketing/reddit-posts.md` (5 posts + engagement playbook)
8. ⏳ **Build Reddit karma** in target subs (10 min/day, ~1 week background drip before posting)
9. ⏳ **App Store ASO** — keywords "couples breathing", "synchronized breathing", "co-regulation"

### Phase 3 — Authority & editorial
10. ⏳ **Pitch guest article** to marriage.com / psychcentral.com / psychologytoday.com — topic: "The science of synchronized breathing for couples"
11. ⏳ **Get listed on insighttimer.com** (partnership/content listing)
12. ✅ **FAQ reference page on own domain** (already deployed via FAQPage schema)
13. ✅ **Instagram Reel scripts drafted** — `marketing/instagram-reels.md` (5 reels) — record once YouTube #1 is live
14. ⏳ **Repurpose YouTube content** for Instagram Reels + TikTok

### Phase 4 — Measure & compound
15. 📅 **10-day Peec check-in** scheduled for 2026-05-05 (Google Calendar) — fresh report vs baseline
16. ⏳ **Identify gap domains** via `gap` filter on Peec domain report — sites citing competitors but not TwoBreath
17. ⏳ **Localize EN winners to DE/JP** once English content has data
18. ⏳ **Add 50 more prompts** based on what's gaining traction
19. ⏳ **Sentiment target: 70+** (baseline 59)

**Legend**: ✅ done · ⏳ pending · 📅 scheduled

## Sources

- [ChatGPT Statistics 2026 (DemandSage)](https://www.demandsage.com/chatgpt-statistics/)
- [ChatGPT 900M Weekly Users (TechCrunch)](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/)
- [Similarweb AI Chatbot Market Share Jan 2026 (Vertu)](https://vertu.com/lifestyle/ai-chatbot-market-share-2026-chatgpt-drops-to-68-as-google-gemini-surges-to-18-2/)
- [Perplexity AI Statistics 2026 (Business of Apps)](https://www.businessofapps.com/data/perplexity-ai-statistics/)
- [Gemini AI Statistics 2026 (AI Business Weekly)](https://aibusinessweekly.net/p/gemini-ai-statistics)
- [Google AI Overviews Surge 2026 (ALM Corp)](https://almcorp.com/blog/google-ai-overviews-surge-9-industries/)
