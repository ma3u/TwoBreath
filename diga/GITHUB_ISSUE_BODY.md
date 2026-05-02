## Context

We are in active conversation with **BSI** about how to compress the [DiGA](https://diga.bfarm.de/de) re-certification cycle, today a multi-month, paperwork-heavy process repeated annually per [§ 139e (10) SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html). This epic uses **TwoBreath** as a real, small-surface worked example to demonstrate where modern SDLC + DevSecOps + GenAI compress the timeline, and to share the experience with **BSI** and **BfArM**.

Planning artefacts live under `diga/` in `ma3u/TwoBreath` / `ma3u/TwoBreath-app`:

- `diga/PLANNING.md` — goal framing, eligibility eval, phases
- `diga/COMPLIANCE_MATRIX.md` — regulation ↔ proof ↔ tool ↔ result
- `diga/MEMORY.md` — markdown-first memory + run ledger

## Goal

**Primary (b):** TwoBreath as worked example. Every [BSI TR-03161-1](https://www.bsi.bund.de/dok/TR-03161) requirement traced to a deterministic proof artefact, with honest gaps. Output: populated `COMPLIANCE_MATRIX.md` + LinkedIn-grade write-up.

**Stretch (a):** Honest assessment of whether TwoBreath could be repositioned for actual DiGA listing. See `PLANNING.md` § 4–5.

**Out of scope:** CASSA platform; bespoke certification platforms; clinical study execution.

## Non-goals

- We are **not** producing the CE marking, MDR technical file, or RCT-quality clinical evidence in this exercise.
- We are **not** running pen-tests against any production system.
- We are **not** filing a real DiGA listing application as part of this work.

## Phases

- [x] **Phase 1 — Foundation.** `PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, this issue.
- [ ] **Phase 2 — Regulation ingestion.** Download TR-03161-1/2/3 + Prüfvorschrift PDFs; convert to markdown with TOC + deep links. Scrape DiGAV + § 139e SGB V from gesetze-im-internet.de. Source manifest checked into `diga/regulations/source-manifest.yaml`.
- [ ] **Phase 3 — Tooling wired.** GitHub Actions workflow on `TwoBreath-app` producing per-build evidence bundle: SBOM (syft / CycloneDX), SAST (semgrep + swiftlint), dependency CVE (osv-scanner), secrets (gitleaks), mobile binary (MobSF), TLS posture (testssl.sh), provenance (cosign).
- [ ] **Phase 4 — Matrix populated with real evidence.** Every TR-03161-1 row resolved to ✅ / 🟡 / ❌ / ➖ with the actual artefact path or gap.
- [ ] **Phase 5 — LinkedIn article.** Markdown article addressing the personas in `PLANNING.md` § 9, grounded in the real matrix output.
- [ ] **Phase 6 — Share-out with BSI / BfArM.** Polished package + walkthrough recording.

## Real-time vs deploy-time evidence — the central thesis

Every row in `COMPLIANCE_MATRIX.md` is classified **R / D / P / M**:

- **R** Real-time — re-evaluated continuously
- **D** Deploy-time — produced by CI on every release, signed and archived
- **P** Periodic — valid for a window
- **M** Manual — requires human evidence

**Today's certification process treats nearly all evidence as M.** The shift M → D → R is where the months of timeline disappear. This issue tracks the work to demonstrate that shift on a real codebase.

## Personas being addressed

(See `PLANNING.md` § 9 for the full table.)

- DiGA founder / CTO
- Provider security engineer
- Prüfstelle auditor
- BSI staff (TR-03161 owner + portal/process)
- BfArM listing officer
- Treating physician
- Patient

## Open questions / asks

- [ ] Confirm TwoBreath threat-model scope (no backend today; trigger conditions for backend-driven re-evaluation documented in `PLANNING.md` § 12).
- [ ] BSI: machine-readable submission format direction for next TR-03161 revision?
- [ ] Prüfstelle: is GitHub Actions + cosign + PROV-O acceptable provenance?
- [ ] BfArM: is co-listing a "DiGA-Manager" backend acceptable to satisfy backend-side requirements while the app stays local-only?

## Acceptance criteria

- `COMPLIANCE_MATRIX.md` § A (TR-03161-1) shows zero `🔍` rows; every row has either an artefact link or a documented honest gap.
- Every artefact in `evidence/<commit-sha>/` verifies under `cosign verify`.
- LinkedIn article drafted, reviewed, and either published or readied for share-out.
- Memory ledger (`diga/MEMORY.md` § 8) captures every run with model snapshot + tool version pins.

## References

- [BSI TR-03161 hub](https://www.bsi.bund.de/dok/TR-03161)
- [DiGAV](https://www.gesetze-im-internet.de/digav/)
- [§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)
- [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679) · [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745)
