# TwoBreath × DiGA — Planning Document

**Owner:** Matthias Buchhorn-Roth
**Created:** 2026-05-02
**Status:** Draft v0.1
**Scope:** TwoBreath (iOS + watchOS couples-breathing app) as worked example for DiGA / BSI TR-03161 certification process improvement.

> **Out of scope for this exercise:** CASSA platform. We use only OSS / standard tooling and a markdown-first, LLM-assisted, GitOps-native approach.

---

## Table of Contents

- [1. Why this document exists](#1-why-this-document-exists)
- [2. Goal framing](#2-goal-framing)
- [3. TwoBreath today — product snapshot](#3-twobreath-today--product-snapshot)
- [4. DiGA eligibility evaluation](#4-diga-eligibility-evaluation)
- [5. Repositioning options if pursuing real DiGA listing](#5-repositioning-options-if-pursuing-real-diga-listing)
- [6. Regulatory perimeter](#6-regulatory-perimeter)
- [7. Real-time vs deployment-time evidence](#7-real-time-vs-deployment-time-evidence)
- [8. Tooling thesis — modern SDLC for certification compression](#8-tooling-thesis--modern-sdlc-for-certification-compression)
- [9. Personas (process improvement target)](#9-personas-process-improvement-target)
- [10. Memory & determinism strategy](#10-memory--determinism-strategy)
- [11. Phases & milestones](#11-phases--milestones)
- [12. Open questions](#12-open-questions)
- [13. Risks](#13-risks)
- [14. References](#14-references)

---

## 1. Why this document exists

We are in conversation with **BSI** about how to improve the DiGA certification process. Today the process is sequential, paperwork-heavy, and takes months per cycle. Re-certification is annual.

This exercise has two outcomes:

1. **Concrete worked example** — TwoBreath as a small, real iOS app traced through every TR-03161 requirement, showing where modern SDLC + DevSecOps + GenAI compress effort and time.
2. **Recommendations to BSI / BfArM** — a LinkedIn-grade write-up grounded in this evidence, identifying personas to address and the specific machine-readable artefacts that would let the regulator move faster.

The exercise itself is the prototype: a markdown-first, deterministic-tool-backed, LLM-assisted compliance workflow that anyone can reproduce.

---

## 2. Goal framing

We deliberately separate **what we build** from **whether TwoBreath itself becomes a listed DiGA**.

| Track | Definition | Output |
| --- | --- | --- |
| **(b) Worked example — primary** | Treat TwoBreath as a stand-in DiGA candidate. Apply every BSI TR-03161 requirement against the real codebase and infrastructure. Document where evidence is automatable, where it is not, and what would have to change. | `COMPLIANCE_MATRIX.md` populated with real proofs and real gaps. LinkedIn article. |
| **(a) Real candidacy — stretch** | Honestly assess whether TwoBreath as it exists today, or with reasonable repositioning, could be listed in the DiGA-Verzeichnis. | Section [4](#4-diga-eligibility-evaluation) and [5](#5-repositioning-options-if-pursuing-real-diga-listing) below. No commitment to actually file. |

The value to BSI is the same regardless of which track plays out: a compact, real evidence trail showing what works and where the process bites.

---

## 3. TwoBreath today — product snapshot

| Attribute | Value |
| --- | --- |
| Product | Paired co-regulation breathing app for couples |
| Platforms | iOS (Swift / SwiftUI), watchOS (Apple Watch) |
| Backend | Static marketing site (`twobreath.com`) on GitHub Pages. **No personal-data backend** for the breathing app itself today. |
| Languages of UI / content | EN, DE, JA |
| Distribution | Apple App Store |
| Data collected | Local-only timer state, voice rotation preferences. **No PHI / PII transmitted off-device today.** |
| Marketing telemetry | Peec AI prompt tracking on the marketing site only |
| Source of truth | `github.com/ma3u/TwoBreath-app` (app), `github.com/ma3u/TwoBreath` (website) |

This local-first posture is **a strength** for DiGA: many TR-03161-3 (backend) controls do not apply if there is no backend. But DiGA listing usually requires *some* server-side processing — at minimum for the doctor-prescription redemption flow and positive-care-effect telemetry. See [§ 5](#5-repositioning-options-if-pursuing-real-diga-listing).

---

## 4. DiGA eligibility evaluation

A DiGA must satisfy **three statutory pillars** ([§ 139e SGB V (2)](https://www.gesetze-im-internet.de/sgb_5/__139e.html)):

1. **Sicherheit & Funktionstauglichkeit** — CE-marked medical device under MDR, Class I or IIa.
2. **Datenschutz & Datensicherheit** — BSI TR-03161 certificate (mandatory since 2025-01-01) + GDPR Art. 42 certificate (mandatory since 2024-08-01).
3. **Positive Versorgungseffekte** — proven positive care effect (clinical evidence, comparative study).

### Eligibility scorecard for TwoBreath as-is

| Pillar | Requirement | TwoBreath status | Verdict |
| --- | --- | --- | --- |
| 1 | CE marking as medical device | None. Wellness positioning. | ❌ Gap |
| 1 | MDR Class I / IIa qualification | Would require intended-use rewrite + technical documentation per Annex II | ❌ Gap |
| 1 | ISO 13485 QMS | Not in place | ❌ Gap |
| 1 | ISO 14971 risk management file | Not in place | ❌ Gap |
| 1 | IEC 62304 software lifecycle | Not formally — but Git history, CI, releases give us most of the artefacts | ⚠ Partial |
| 2 | BSI TR-03161-1 (mobile) | Many requirements naturally met by Apple platform defaults; need formal evidence | ⚠ Partial — closest to ready |
| 2 | BSI TR-03161-2 (web) | Marketing site only; no app-side web | ✅ Mostly N/A |
| 2 | BSI TR-03161-3 (backend) | No backend → most controls N/A; would change with DiGA backend | ✅ N/A today |
| 2 | GDPR Art. 42 certificate | Not obtained | ❌ Gap |
| 2 | DPIA (Art. 35 GDPR) | Not produced | ❌ Gap |
| 3 | Defined ICD-10 indication | None — wellness, not indication-specific | ❌ Gap |
| 3 | Clinical evidence of positive care effect | None | ❌ Gap |
| 3 | Comparative study (typically RCT) | None | ❌ Gap |

**Verdict on (a) real candidacy as-is: not eligible.**

The blockers are not the security / TR-03161 side — that is the most tractable pillar and the one this exercise focuses on. The blockers are **clinical positioning, MDR conformity, and clinical evidence**.

---

## 5. Repositioning options if pursuing real DiGA listing

Documented for completeness; **not committed to** in this exercise.

| Option | ICD-10 indication candidate | What it requires | Effort horizon |
| --- | --- | --- | --- |
| **A. Anxiety co-regulation** | F41.1 generalised anxiety, F41.0 panic | Clinical study with couples cohort; structured therapeutic protocol; clinician dashboard | 18–36 months |
| **B. Stress reaction / burnout** | F43.0 acute stress, Z73.0 burnout | Workplace / payer pilots; HRV-based outcome metric via Apple Watch | 12–24 months |
| **C. Sleep onset support** | G47.0 insomnia | Comparative study vs sleep-CBT app; bedtime ritual variant | 18–30 months |
| **D. Couple therapy adjunct** | F32.x depression with relational stress | Co-prescription with couple therapy; longest evidence path | 24–48 months |

Even option B (most tractable) requires CE marking and an RCT-quality study. **None of these is achievable inside this exercise.** They are listed so the gap analysis is honest.

---

## 6. Regulatory perimeter

The full reference catalogue is in [`COMPLIANCE_MATRIX.md`](COMPLIANCE_MATRIX.md). Headline:

- **Security:** [BSI TR-03161-1/2/3](https://www.bsi.bund.de/dok/TR-03161) — mobile / web / backend
- **DiGA:** [DiGAV](https://www.gesetze-im-internet.de/digav/), [§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)
- **MedDev:** [MDR (EU) 2017/745](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745), ISO 13485, ISO 14971, IEC 62304, IEC 82304-1
- **Privacy:** [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679) Art. 25 / 32 / 35 / 42
- **Cloud (if backend added):** [BSI C5](https://www.bsi.bund.de/dok/7685384)

For this exercise, we focus the proof effort on **TR-03161-1 (mobile)** since that is what TwoBreath actually exposes. TR-03161-2 / -3 are scoped as "N/A — would apply if X" with the trigger documented.

---

## 7. Real-time vs deployment-time evidence

A central question for the BSI conversation: **how much certification evidence can be produced in real time vs only at deployment time vs only manually?**

This taxonomy is applied per row in `COMPLIANCE_MATRIX.md`. Headline shape:

| Class | Definition | Examples | Implication for BSI |
| --- | --- | --- | --- |
| **R — Real-time** | Continuously valid in production. Re-evaluated on any change. | TLS posture of live endpoints, live SBOM diff against CVE feeds, runtime audit-log retention | Suitable for **continuous certification** — certificate validity could be tied to live signal |
| **D — Deploy-time** | Produced by CI/CD on every release; signed and archived. | SAST, SBOM, dependency CVE scan, Mobile binary checks, signed build provenance | Suitable for **release-gated certification** — certificate scope = exact build hash |
| **P — Periodic** | Valid for a window; needs scheduled re-run. | Pen-test, restore drill, key rotation, third-party audit | Suitable for **time-windowed validity** with automated expiry alerts |
| **M — Manual** | Requires human judgement and evidence upload. | DPIA, threat model review, clinical evidence, Prüfstelle audit | Stays human; CASSA-equivalent UX collects + signs the upload |

The thesis for the BSI dialogue: **a large fraction of TR-03161 evidence is R or D. Today the process treats nearly all of it as M.** The shift from M → D → R is where months of timeline disappear.

---

## 8. Tooling thesis — modern SDLC for certification compression

The compression argument has four legs:

1. **Deterministic-tool-first.** Every machine-checkable requirement maps to one or more reproducible tools (table in `COMPLIANCE_MATRIX.md`). No LLM is on the proof path.
2. **GitOps as evidence pipeline.** Each commit produces a signed bundle: SARIF + CycloneDX + JUnit + cosign signatures + provenance manifest. The bundle is the evidence.
3. **GenAI on the structuring path only.** Claude Opus 4.7 (or peer) maps free-text TR-03161 requirements to the right tool, drafts the compliance narrative, and detects missing evidence. **It never produces the final proof.**
4. **Markdown as the system of record.** No bespoke platform. `COMPLIANCE_MATRIX.md` + `MEMORY.md` + the signed evidence bundle are sufficient for an auditor and re-runnable by anyone.

For TwoBreath specifically, the candidate stack:

| Concern | Tool | R / D / P |
| --- | --- | --- |
| iOS binary security checks | [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) CLI on archive | D |
| Swift static analysis | [`swift-format`](https://github.com/swiftlang/swift-format), [`swiftlint`](https://github.com/realm/SwiftLint), [`semgrep`](https://semgrep.dev/) Swift rules | D |
| Dependency CVEs (SwiftPM) | [`osv-scanner`](https://github.com/google/osv-scanner) on `Package.resolved` | D |
| SBOM | [`syft`](https://github.com/anchore/syft) over Xcode build, CycloneDX | D |
| Secret hygiene | [`gitleaks`](https://github.com/gitleaks/gitleaks), pre-commit + CI | D |
| TLS posture (App Store CDN, marketing site) | [`testssl.sh`](https://github.com/drwetter/testssl.sh) scheduled | R |
| Cert pinning behaviour | [`mitmproxy`](https://mitmproxy.org/) automated probe in test pipeline | D |
| Release signing | Apple notarisation + [`cosign`](https://github.com/sigstore/cosign) for provenance bundle | D |
| Web headers (twobreath.com) | [Mozilla Observatory](https://observatory.mozilla.org/) CLI | R |
| Threat model | [`threagile`](https://threagile.io/) YAML in repo | D |
| Crypto inventory | hand-curated YAML reconciled against build scan | M + D |
| DPIA, MDR docs, clinical evidence | Markdown with signed commit | M |

Wired into GitHub Actions on `ma3u/TwoBreath-app` with a fan-out job that publishes the signed bundle to a `evidence/<commit-sha>/` artefact and updates a `compliance.json` consumed by the matrix.

This is the Phase-3 work, not in scope for Phases 1–2.

---

## 9. Personas (process improvement target)

The LinkedIn article and BSI dialogue should land the message against a specific set of personas — each with a distinct pain and a distinct asset they need.

| Persona | Pain today | Asset they need |
| --- | --- | --- |
| **Provider founder / CTO** | "How do I even start? Months of paperwork before the audit even begins." | A repo template + GitHub Actions workflow that produces 70 % of TR-03161 evidence on every PR, plus a markdown matrix scoring readiness. |
| **Provider security engineer** | "I re-collect the same evidence every cycle. Spreadsheets drift." | Single source-of-truth markdown matrix with deterministic re-run; commit-pinned evidence bundle. |
| **Prüfstelle auditor** | "I read 500 pages of vendor PDFs and have no way to verify the artefacts they reference." | Signed, machine-readable submission package: SARIF / CycloneDX / cosign / PROV-O. Auditor diffs against last cycle. |
| **BSI staff (TR-03161 owner)** | "We update the TR; providers don't know which controls flipped status." | Machine-readable requirement catalogue + provider portal that diffs requirement versions and re-evaluates evidence. |
| **BSI staff (process/portal)** | "Cross-provider patterns are invisible." | Aggregated dashboard: most-failed requirements, common crypto weaknesses, CVE freshness across the fleet. |
| **BfArM listing officer** | "Bridges between BSI cert + MDR + clinical evidence are manual." | Cross-regulator schema linking BSI cert hash → MDR file → clinical evidence package. |
| **Treating physician** | "Is this DiGA still safe today, given last week's CVE?" | Public-facing real-time posture indicator per listed DiGA. |
| **Patient** | "Where is my data, who has it, can I see what TwoBreath does?" | Plain-language, real-time data flow + retention summary derived from the same evidence bundle. |

Personas drive the LinkedIn article structure. Each gets a one-line "from / to" framing.

---

## 10. Memory & determinism strategy

See [`MEMORY.md`](MEMORY.md) for the full ledger format. Headline rules:

1. **Every run logs to `runs/<YYYY-MM-DD-HHMM>-<slug>.md`** — inputs, outputs, model snapshot, prompt hash, exit codes, signatures.
2. **Determinism is a property of the tool, not the LLM.** Tool outputs are reproducible. LLM outputs are *advisory* and always paired with the deterministic source they summarise.
3. **Content-window resilience:** the matrix and memory files are designed so any single file is independently sufficient context for resuming work. No hidden cross-file state.
4. **No CASSA, no Neo4j, no graph DB.** Markdown + git is the system of record. Provenance is git history + cosign signatures.

---

## 11. Phases & milestones

| Phase | Deliverables | State |
| --- | --- | --- |
| **1 — Foundation** | `PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, `GITHUB_ISSUE*.md` | ✅ done |
| **2 — Regulation ingestion** | TR-03161-1/2/3 PDFs ingested (127 anchored requirements), DiGAV (51 §§) + § 139e SGB V scraped, `regulations/source-manifest.yaml` with sha256 | ✅ done |
| **3 — Per-row resolution** | All 127 `O.*` requirements bewertet against real TwoBreath posture; `evidence/tr1-twobreath-status.yaml` + regenerated `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`. Stats: ✅ 40 (31 %) · 🟡 25 (20 %) · ❌ 6 (5 %) · ➖ 56 (44 %). 101/127 (~80 %) deterministisch erbringbar (R+D+P). | ✅ done |
| **4 — German deliverables** | `BSI_BERICHT.md` (formal Behördendeutsch report), `LINKEDIN_ARTIKEL.md` (German article for regulators / Krankenkassen / Ärzt:innen / Patient:innen) | ✅ done |
| **5 — Closure pass** | Eight concept docs (`concepts/01..08`), `SECURITY.md`, `CI_CD_SECURITY.md` (answers SAST/DAST question + drop-in `security.yml`), `patches/PATCHES.md` (10 Swift snippets). v0.2 stats: **✅ 70 (55 %) · 🟡 2 (2 %) · ❌ 0 · ➖ 55 (43 %)**. Remaining 🟡 are App-Attest, deferred until backend exists. | ✅ done |
| **6 — Tooling wired in TwoBreath-app CI** | Apply `CI_CD_SECURITY.md` § 4 to `TwoBreath-app/.github/workflows/security.yml`: add semgrep, syft SBOM, osv-scanner, MobSF, testssl.sh jobs. | next |
| **7 — Apply patches in TwoBreath-app** | Land the 10 PR-fertigen Patches einzeln in `ma3u/TwoBreath-app`. | next |
| **8 — BSI / BfArM share-out** | Polished package + walkthrough recording. | when 6+7 land |

---

## 12. Open questions

| # | Question | Answer source |
| --- | --- | --- |
| 1 | Which ICD-10 indication makes the most defensible repositioning if (a) is ever pursued? | Clinical advisory needed |
| 2 | Does TwoBreath need a backend at all to be a DiGA, or can the prescription-redemption flow be delegated to a third-party DiGA-Manager? | BfArM clarification |
| 3 | Will BSI mandate a machine-readable submission format alongside the next TR-03161 revision? | BSI dialogue |
| 4 | What is the minimum credible clinical evidence bar for a couples-co-regulation indication? | Lit review + payer interview |
| 5 | Is GitHub Actions + cosign a sufficient provenance chain for a Prüfstelle, or do they require a specific timestamping authority? | Prüfstelle interview |

---

## 13. Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| TR-03161 PDFs change mid-exercise | Medium | Pin version + sha256 in `MEMORY.md`; treat ingestion as deploy-time |
| LLM-extracted requirement IDs drift from official numbering | Medium | Include the exact section heading + page number with every extracted requirement; manual spot-check |
| Worked example perceived as too narrow (single-app, mobile-first, no backend) | Medium | Explicitly frame as Part 1 of a series; flag where TR-03161-2/-3 controls would activate |
| Confusion between (a) and (b) tracks | Low | Section [2](#2-goal-framing) carries this load; LinkedIn article repeats it |
| BSI dialogue stalls; LinkedIn article lands without their input | Low | Article is valuable standalone; offers an open invitation rather than claiming endorsement |

---

## 14. References

See [`COMPLIANCE_MATRIX.md` § References](COMPLIANCE_MATRIX.md) for the full anchored list. Headline links:

- [BSI TR-03161 hub](https://www.bsi.bund.de/dok/TR-03161)
- [DiGAV](https://www.gesetze-im-internet.de/digav/)
- [§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)
- [DiGA-Verzeichnis (BfArM)](https://diga.bfarm.de/de)
- [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
- [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745)
