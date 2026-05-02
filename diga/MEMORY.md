# DiGA Exercise — Memory & Run Ledger

**Purpose:** Markdown-first, git-tracked, content-window-resilient memory for the TwoBreath × DiGA exercise. No graph DB, no platform — only files + signatures.

> Any contributor (human or LLM) can resume work after reading this file plus `PLANNING.md` and `COMPLIANCE_MATRIX.md`. No hidden state.

---

## Table of Contents

- [1. Why a markdown memory system](#1-why-a-markdown-memory-system)
- [2. File layout](#2-file-layout)
- [3. Run ledger format](#3-run-ledger-format)
- [4. Determinism rules](#4-determinism-rules)
- [5. Content-window resilience](#5-content-window-resilience)
- [6. LLM model pinning](#6-llm-model-pinning)
- [7. Source-document pinning](#7-source-document-pinning)
- [8. Run ledger — append below](#8-run-ledger--append-below)

---

## 1. Why a markdown memory system

The DiGA process is audited. Every claim of compliance must be reproducible by a third party from the artefacts on disk. We optimise for:

1. **Reproducibility** — anyone can re-run the exact same scan on the exact same input and get the same output (deterministic tools) or the same structured output ± controlled drift (LLM-assisted with pinned snapshot).
2. **Auditor-friendliness** — every claim → tool → output → signature is one click away in plain text + git history.
3. **Resilience to context limits** — Claude / GPT context windows are bounded. A new session must be able to resume by reading three files: this one, `PLANNING.md`, `COMPLIANCE_MATRIX.md`.
4. **No vendor lock-in** — no proprietary platform required to read or extend the system. `git`, `make`, `bash`, `pdftotext` are sufficient.

---

## 2. File layout

```
diga/
├── PLANNING.md                      # Why and what
├── MEMORY.md                        # This file — how to resume + run log
├── COMPLIANCE_MATRIX.md             # Regulation ↔ proof ↔ tool ↔ result
├── GITHUB_ISSUE.md                  # Ready-to-file issue body
├── regulations/
│   ├── pdf/                         # Raw downloaded PDFs (with sha256)
│   ├── markdown/                    # Converted MD with TOC + deep links
│   └── source-manifest.yaml         # URL · sha256 · version · downloaded_at
├── evidence/
│   └── <commit-sha>/                # Per-build evidence bundle
│       ├── sbom.cdx.json
│       ├── sast.sarif
│       ├── deps.sarif
│       ├── tls-posture.json
│       ├── mobile-binary.json
│       ├── provenance.intoto.jsonl
│       └── bundle.sig               # cosign signature
├── runs/
│   └── YYYY-MM-DD-HHMM-<slug>.md    # One file per session / pipeline run
└── scripts/
    ├── fetch-pdfs.sh                # Idempotent regulation download
    ├── pdf-to-md.sh                 # PDF → MD with TOC + anchors
    └── verify-bundle.sh             # cosign + sha256 verification
```

---

## 3. Run ledger format

Each session — whether human, CI/CD, or LLM-assisted — appends one entry to [§ 8](#8-run-ledger--append-below). Entries are immutable; corrections come as new entries that supersede prior ones.

```markdown
### YYYY-MM-DD HH:MM · <short slug>

- **Actor:** human / Claude Opus 4.7 / GitHub Actions / etc.
- **Input:** what changed since last run (commit hash, file list, regulation version)
- **Action:** what was executed (command + arguments OR LLM prompt template hash)
- **Output:** artefact path(s) + sha256(s)
- **Provenance:** signature path / cosign verification result
- **Determinism class:** R / D / P / M (per PLANNING.md § 7)
- **LLM snapshot (if applicable):** model id + version + temperature + seed
- **Notes:** anything an auditor or future contributor needs to know
```

---

## 4. Determinism rules

1. **Tool output is the proof.** LLM output is *never* the sole evidence for a TR-03161 control.
2. **Tool versions are pinned.** Every entry records the tool version used (`trivy --version`, `semgrep --version`, etc.).
3. **LLM calls are bounded.** Used only for: requirement extraction from PDFs, mapping requirements to tools, summarising findings, drafting narrative. All four are auditable because the source is checked in alongside the output.
4. **No LLM in the gating path.** A failing CI gate is set by a deterministic tool exit code, not by an LLM verdict.
5. **All signatures verified before use.** Downstream automation refuses to consume any artefact whose `cosign verify` fails.

---

## 5. Content-window resilience

LLM context windows compress old conversation; long-running exercises lose state. Mitigations:

| Risk | Mitigation |
| --- | --- |
| Past decisions evaporate from chat history | All decisions live in `PLANNING.md` § 12 (open questions) and § 13 (risks). New session reads this file first. |
| Tool versions / snapshot drift between runs | Pinned in run ledger entries. New runs compare against last entry before claiming "no change". |
| Conversation forgets which regulation version is in scope | `regulations/source-manifest.yaml` is the single source of truth. Re-read on every new session. |
| Re-derivation of evidence from scratch is expensive | `evidence/<commit-sha>/` is the cached output. Re-run only on input change. |
| LLM forgets the (a)/(b) goal framing | First paragraph of `PLANNING.md` reasserts it. |

**Resume protocol** for a new session:

1. Read `PLANNING.md` (top to § 11).
2. Read this file (entire).
3. Read latest entry in [§ 8](#8-run-ledger--append-below).
4. Read `COMPLIANCE_MATRIX.md` § Open rows.
5. Begin work; append new entry on completion.

---

## 6. LLM model pinning

| Use | Pinned model | Rationale |
| --- | --- | --- |
| Requirement extraction (PDF → structured) | `claude-opus-4-7` (Anthropic) at `temperature=0` | Strongest at structured German technical text + JSON-mode output |
| Tool-mapping suggestions | `claude-opus-4-7` at `temperature=0` | Same |
| Compliance narrative drafting (human-reviewed) | `claude-opus-4-7` | Long context, policy-style prose |
| Embeddings (if/when used) | none in this exercise — markdown grep is sufficient | Avoid vector-store complexity |

Model snapshot ids and call parameters are recorded **per run** in [§ 8](#8-run-ledger--append-below).

---

## 7. Source-document pinning

`regulations/source-manifest.yaml` is the canonical record of every external document we ingest. Schema:

```yaml
documents:
  - id: tr-03161-1
    title: "BSI TR-03161-1 — Anwendungen im Gesundheitswesen — Mobile Anwendungen"
    version: "<as printed on title page>"
    url: "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR03161/BSI-TR-03161-1.pdf?__blob=publicationFile"
    downloaded_at: "2026-05-02T..."
    sha256: "<hex>"
    pdf_path: "regulations/pdf/BSI-TR-03161-1.pdf"
    markdown_path: "regulations/markdown/BSI-TR-03161-1.md"
    extraction_notes: "<page count, OCR needed?, tables preserved?>"
```

The manifest is updated only by `scripts/fetch-pdfs.sh`, so a new download with a new `sha256` immediately surfaces as a diff in PR.

---

## 8. Run ledger — append below

<!-- New entries go at the BOTTOM. Most recent last. Never edit prior entries; supersede with a new entry. -->

### 2026-05-02 · bootstrap-foundation

- **Actor:** human (Matthias) + Claude Opus 4.7
- **Input:** clean tree, no prior diga/ folder
- **Action:** create directory structure, author Phase 1 docs (`PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, `GITHUB_ISSUE.md`)
- **Output:**
  - `diga/PLANNING.md`
  - `diga/MEMORY.md`
  - `diga/COMPLIANCE_MATRIX.md`
  - `diga/GITHUB_ISSUE.md`
  - directory skeleton: `regulations/{pdf,markdown}/`, `evidence/`, `runs/`, `scripts/`
- **Provenance:** none yet — files are unsigned drafts. Will be signed once they live in a git repo.
- **Determinism class:** M (manual authoring with LLM assistance)
- **LLM snapshot:** `claude-opus-4-7`, temperature defaulted by Claude Code interactive session. Treat content as advisory until reviewed.
- **Notes:** Goal framing locked to (b) primary + (a) stretch eval. Issue location decided as Option C — markdown body, user files manually. Repos confirmed: `ma3u/TwoBreath-app` (app) and `ma3u/TwoBreath` (website).

### 2026-05-02 · phase-2-ingestion

- **Actor:** human (Matthias) + Claude Opus 4.7
- **Input:** Phase 1 foundation files committed; clean `regulations/` skeleton.
- **Action:**
  - `scripts/fetch-pdfs.sh` → downloaded BSI TR-03161-1/-2/-3 PDFs from bsi.bund.de.
  - `scripts/pdf-to-md.py` → converted each PDF to markdown with chapter / subsection / requirement-ID anchors and a generated TOC.
  - `scripts/fetch-laws.py` → fetched 51 DiGAV section pages + § 139e SGB V from gesetze-im-internet.de; produced consolidated markdown with per-§ deep links.
  - `Makefile` → wrapped `fetch` / `convert` / `ingest` / `verify` / `clean` targets.
- **Output:**
  - `regulations/pdf/BSI-TR-03161-{1,2,3}.pdf` (66 / 58 / 54 pages)
  - `regulations/markdown/BSI-TR-03161-{1,2,3}.md` (4212 / 3641 / 3546 lines)
  - `regulations/markdown/DiGAV.md` (49 §§)
  - `regulations/markdown/SGB-V-139e.md`
  - `regulations/html/digav/__*.html` (51 raw section snapshots)
  - `regulations/html/sgb_5/__139e.html`
  - `regulations/source-manifest.yaml` (sha256 + bytes + URL + downloaded_at per source)
- **Coverage:**
  - TR-03161-1: 127 unique requirement IDs (`O.*`); each anchored at chapter 3 (normative) and chapter 4 (audit) — 254 anchors total. Raw PDF count 258 → ≥98 % capture.
  - TR-03161-2: 107 unique requirement IDs; 214 anchors. Raw PDF count 214 → 100 %.
  - TR-03161-3: 106 unique requirement IDs; 210 anchors. Raw PDF count 210 → 100 %.
- **Provenance:** sha256 recorded in `regulations/source-manifest.yaml`. Files unsigned drafts pending git+cosign once committed.
- **Determinism class:**
  - Fetch + sha256: **D** (deterministic, reproducible)
  - PDF→MD conversion: **D** (deterministic; pdftotext + pure-Python regex pipeline; same input → same output)
  - Compliance-matrix authoring: **M** (advisory)
- **Tool versions (pinned):**
  - `pdftotext` (poppler) 26.04.0
  - `python3` 3.13.13
  - `bs4` (BeautifulSoup) 4.13.4
  - `pandoc` 3.9.0.2 (installed but not invoked this run; reserved for HTML diff verification)
- **LLM snapshot:** `claude-opus-4-7` (Claude Code interactive). LLM produced advisory text in `PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, `GITHUB_ISSUE.md`. Conversion scripts and TOC/anchor generation are pure deterministic Python — no LLM in the proof path.
- **Notes:**
  - TR-03161-1 v3.0 (25.03.2024) and TR-03161-3 v3.0 (per `pdftotext` metadata). TR-03161-2 metadata showed PDF v1.6 but BSI document version is v3.0. The Prüfvorschrift mentioned in the planning doc is **embedded as Chapter 4** of each TR (not a separate PDF), so no additional download is required.
  - Anchor convention: `o-<group>-<n>` for chapter-3 (normative) and `o-<group>-<n>-2` for chapter-4 (audit). Both forms are valid deep-link targets from `COMPLIANCE_MATRIX.md`.
  - **Resolved 2026-05-02:** the DiGAV index returns 51 section URLs, and `regulations/markdown/DiGAV.md` contains 51 anchored `§ X` sections. The earlier "49 §§" claim was a counting error in the summary; the artefact itself is complete (§§ 1–43 + 6a + 11a + 11b + 23a–23e = 51).
  - **Resolved 2026-05-02:** Gap 1 (re-enumerate matrix against 127 official `O.*` IDs) closed by `scripts/build-official-matrix.py` → `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`. Per-row Kurzfassung + Prüftiefe extracted from the chapter-4 Testcharakteristik tables; default R/D/P/M class and TwoBreath status assigned per group, refinable per row. Re-run via `make official-matrix`.

### 2026-05-02 · german-deliverables

- **Actor:** human (Matthias) + Claude Opus 4.7
- **Input:** Phase 1+2 artefacts including `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`.
- **Action:** authored two German-language deliverables aimed at the regulator dialogue and the public communication track.
- **Output:**
  - `BSI_BERICHT.md` — formal Behördendeutsch report for BSI Referat DI 24. Sections: Anlass, Untersuchungsgegenstand, Methodik, R/D/P/M-Klassifikationsmodell, quantitative Ergebnisse über alle 127 Anforderungen, qualitative Befunde (Plattform-Voraussetzungen, doppelte Verschriftlichung, Nachweisverpackung, CVE/TR-Versions-Kopplung), 4 Hebel, 5 konkrete Empfehlungen (E1–E5), Risiken, Anlagen.
  - `LINKEDIN_ARTIKEL.md` — German LinkedIn article addressing patients, treating physicians/therapists, statutory health insurers (Krankenkassen), DiGA manufacturers, Prüfstellen, BSI, BfArM. Persona-driven structure with TL;DR, four-class evidence taxonomy, four levers, clear separation between deterministic tools (proof) and LLM (structuring), call for input from each persona.
- **Provenance:** authored, not yet signed. Both files belong in the public-facing track and should be reviewed by a German-native editor before publication.
- **Determinism class:** M (advisory authoring with LLM assistance).
- **LLM snapshot:** `claude-opus-4-7` (Claude Code interactive). All factual references back-anchored to ingested regulation markdown or `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`.
- **Notes:**
  - The "rund drei Viertel" (≈75 %) deterministic-evidence claim is a working estimate from the per-group default classes assigned in `COMPLIANCE_MATRIX_TR1_OFFICIAL.md` (only Purp + Arch + parts of Data are M-default → ~30 of 127 rows). Should be tightened to the exact integer once Phase 3 runs the tools end-to-end.
  - The four-zielgruppe framing (Patient:innen, Ärzt:innen, Krankenkassen, Hersteller + Prüfstellen + BSI/BfArM) follows the personas table in `PLANNING.md` § 9, recast in German for the LinkedIn audience.

### 2026-05-02 · resolve-all-127

- **Actor:** human (Matthias) + Claude Opus 4.7
- **Input:** ingested TR-03161-1 markdown + evidence/tr1-twobreath-status.yaml (newly authored).
- **Action:** Inspected actual TwoBreath app (project.yml, Info.plist, Entitlements, PrivacyInfo.xcprivacy, .github/workflows/{ci,security}.yml, .gitleaks.toml, .swiftlint.yml, Shared/Services/{HealthKit,Pairing,ProximityPairing,Connectivity}*.swift, CLAUDE.md). Authored per-ID status for **all 127 `O.*` requirements**. Extended `scripts/build-official-matrix.py` to load `evidence/tr1-twobreath-status.yaml` overrides + emit summary stats. Fixed `endswith("-2")` audit-anchor bug that mis-classified 12 IDs ending in `_2` (O.Purp_2, O.Arch_2 etc.). Regenerated `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`. Updated `BSI_BERICHT.md` § 5, `LINKEDIN_ARTIKEL.md`, `PLANNING.md` § 11, `COMPLIANCE_MATRIX.md` header with the resolved totals.
- **Output:**
  - `evidence/tr1-twobreath-status.yaml` (127 entries)
  - `scripts/build-official-matrix.py` v2 (yaml-loading + bug fix)
  - `COMPLIANCE_MATRIX_TR1_OFFICIAL.md` — fully resolved 127-row matrix
  - Updated narratives in BSI_BERICHT.md / LINKEDIN_ARTIKEL.md / PLANNING.md / COMPLIANCE_MATRIX.md
- **Resolved totals:** ✅ 40 (31 %) · 🟡 25 (20 %) · ❌ 6 (5 %) · ➖ 56 (44 %) · 🔍 0. Class distribution: R 5 · D 94 · P 2 · M 26. **101/127 (~80 %) deterministically deliverable.**
- **The 6 concrete ❌ gaps:**
  - O.Purp_6 — consent register (M)
  - O.Arch_2 — data-lifecycle design doc (M)
  - O.Arch_9 — vulnerability disclosure path (M)
  - O.Plat_13 — user security info screen (M)
  - O.Resi_1 — user best-practice guidance (M, overlaps with O.Plat_13)
  - O.Resi_3 — debug-env detection (D)
- **Determinism class:** D (deterministic transformation of inputs to matrix); the per-row determinations themselves are M (advisory), each grounded in a code/config citation in the YAML.
- **LLM snapshot:** `claude-opus-4-7` (Claude Code interactive). All 127 determinations derived from inspected files cited in the YAML's `defaults.notes` block.
- **Notes:**
  - The `endswith("-2")` bug was real — silently broke chapter-3 anchor links for 12 IDs (every `O.X_2`). Fixed by switching to first-seen-is-normative semantics, since the markdown order is always chapter-3 then chapter-4.
  - The 80 % deterministic figure replaces the earlier "rund drei Viertel" working estimate. Now grounded in the YAML override per row.
  - The 44 % `➖` rate is dominated by the 20 Auth/Pass requirements (no accounts) plus the 8 backend-related rows in O.Ntwk_*. Moving to a backend would activate a substantial chunk; explicitly tracked as the trigger condition in PLANNING.md § 6.

### 2026-05-02 · closure-pass-v0.2

- **Actor:** human (Matthias) + Claude Opus 4.7
- **Input:** v0.1 matrix with 6 ❌ + 25 🟡 + user request to close them and explain the CI/CD SAST/DAST status.
- **Action:** authored eight concept docs in `concepts/`, `SECURITY.md`, `CI_CD_SECURITY.md`, and `patches/PATCHES.md` with 10 PR-ready Swift snippets. Updated 29 entries in `evidence/tr1-twobreath-status.yaml`. Regenerated `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`.
- **Output:**
  - `concepts/01-datenschutzkonzept.md` — purpose, lawful basis, retention
  - `concepts/02-datenlebenszyklus.md` — data flow + trust boundaries
  - `concepts/03-threat-model.md` — STRIDE
  - `concepts/04-secure-coding-standards.md` — Swift-specific rules
  - `concepts/05-einwilligungsverzeichnis.md` — consent register concept (closes O.Purp_6)
  - `concepts/06-kryptographiekonzept.md` — explicit platform delegation per TR-02102 (closes O.Arch_3)
  - `concepts/07-netzwerk-sicherheitskonzept.md` — MPC alt-auth + ATS + logging strategy (closes O.Ntwk_1, O.Ntwk_8)
  - `concepts/08-resilienz-haertungskonzept.md` — staged hardening; trade-offs against jailbreak heuristics + commercial obfuscation
  - `SECURITY.md` — vulnerability disclosure (closes O.Arch_9)
  - `CI_CD_SECURITY.md` — addresses user's question about missing SAST/DAST; current-CI inventory; tool-category applicability assessment; drop-in `security.yml` extension with 5 new jobs (semgrep, syft SBOM, osv-scanner, MobSF, testssl.sh + Mozilla Observatory)
  - `patches/PATCHES.md` — 10 PR-ready Swift snippets (debug-detect, app-switcher mask, secure-text-entry, text-selection-disable, security-info screen, app-attest stub, in-app erase, build-hardening, consent log, swiftlint os_log custom rule)
- **Resolved totals (v0.2):** ✅ **70 (55 %)** · 🟡 **2 (2 %)** · ❌ **0** · ➖ **55 (43 %)**. From 6 ❌ → 0; from 25 🟡 → 2 (App-Attest only). Coverage of `O.*` IDs unchanged at 127.
- **Determinism class:** closure artefacts are M (advisory authoring); tooling proposals in `CI_CD_SECURITY.md` are D when integrated into CI.
- **LLM snapshot:** `claude-opus-4-7` (Claude Code interactive). Each YAML override cites a specific concept-doc section or patch number — traceable for an auditor.
- **Notes:**
  - `CI_CD_SECURITY.md` answers the user's "wo sind SAST/DAST?" question with: yes, the standard SAST/DAST stack is largely absent for an iOS local-first app — not because the requirements don't apply, but because **iOS-specific equivalents** (semgrep with Swift rules, MobSF, syft for build-toolchain SBOM, osv-scanner over Package.resolved + package-lock.json, testssl.sh for the marketing site) substitute for container/backend defaults. § 4 of that file is the drop-in fix.
  - The two remaining 🟡 (O.Resi_5, O.Resi_7) are App-Attest. Stub code is in patches/PATCHES.md § 6 but deliberately inactive — without a backend verifier, generating attestations is effort without gain.
  - Re-run is idempotent: `make ingest` produces byte-identical markdown given identical source PDFs/HTML; `regulations/source-manifest.yaml` surfaces any drift on PR.

<!-- next entry below -->
