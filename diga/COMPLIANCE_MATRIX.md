# TwoBreath × DiGA — Compliance Matrix

**Companion to:** [`PLANNING.md`](PLANNING.md), [`MEMORY.md`](MEMORY.md)
**Status:** Draft v0.1 (skeleton populated, full TR-03161-1 row enumeration after Phase 2 ingestion)
**Last updated:** 2026-05-02

> **How to read:** every row maps one regulatory requirement to (a) the deterministic proof that satisfies it, (b) the tool / method producing the proof, (c) when the proof is valid — Real-time / Deploy-time / Periodic / Manual, and (d) the actual TwoBreath status today.

---

## Table of Contents

- [Legend](#legend)
- [How rows are populated](#how-rows-are-populated)
- [A. BSI TR-03161-1 — Mobile applications](#a-bsi-tr-03161-1--mobile-applications)
  - [A.1 Cryptographic implementation (CRY)](#a1-cryptographic-implementation-cry)
  - [A.2 Authentication (AUT)](#a2-authentication-aut)
  - [A.3 Local data storage (STO)](#a3-local-data-storage-sto)
  - [A.4 Network communication (NET)](#a4-network-communication-net)
  - [A.5 Platform interaction (PLT)](#a5-platform-interaction-plt)
  - [A.6 Resilience & update (RES)](#a6-resilience--update-res)
  - [A.7 Secure data processing (PRC)](#a7-secure-data-processing-prc)
  - [A.8 Coding best practices (CBP)](#a8-coding-best-practices-cbp)
  - [A.9 Paid resources (PAY)](#a9-paid-resources-pay)
- [B. BSI TR-03161-2 — Web applications](#b-bsi-tr-03161-2--web-applications)
- [C. BSI TR-03161-3 — Backend systems](#c-bsi-tr-03161-3--backend-systems)
- [D. DiGAV (BfArM)](#d-digav-bfarm)
- [E. § 139e SGB V](#e--139e-sgb-v)
- [F. GDPR](#f-gdpr)
- [G. MDR + medical-device standards](#g-mdr--medical-device-standards)
- [Coverage summary](#coverage-summary)
- [References](#references)

---

## Legend

**Determinism class:**

| Class | Meaning |
| --- | --- |
| **R** | Real-time — continuously valid; re-evaluated on every change to the live system |
| **D** | Deploy-time — produced by CI/CD on every release; signed and archived |
| **P** | Periodic — valid for a defined window; needs scheduled re-execution |
| **M** | Manual — human judgement / artefact; cannot be machine-produced |

**Status:**

| Symbol | Meaning |
| --- | --- |
| ✅ | Evidence in place and current |
| 🟡 | Partial — some evidence, gap noted |
| ❌ | Missing |
| ➖ | Not applicable to TwoBreath today (with trigger to re-evaluate) |
| 🔍 | To be determined — pending Phase-2 ingestion or further investigation |

---

## How rows are populated

1. **Requirement column** uses the **official TR-03161-1 v3.0** IDs (`O.<group>_<n>`, e.g. `O.Purp_1`, `O.Arch_3`). Each ID is a deep link to the ingested regulation markdown — see [`regulations/markdown/BSI-TR-03161-1.md`](regulations/markdown/BSI-TR-03161-1.md). Anchors of the form `#o-<group>-<n>` land on the chapter-3 normative wording; `#o-<group>-<n>-2` lands on the chapter-4 audit table. The pre-Phase-2 short forms (CRY/AUT/STO etc.) below are retained as ergonomic groupings — see [§ A.0 mapping](#a0-grouping--official-prüfaspekte) for how they relate to the official 11 Prüfaspekte.
2. **Proof column** is the *deterministic check* — a tool exit code, a SARIF rule, a value extracted from a configuration file. Never an LLM judgement.
3. **Tool column** is pinned in `MEMORY.md` § 6 once we run it; here it states the candidate.
4. **Class column** is R / D / P / M per the legend above.
5. **TwoBreath status** is what we have today, not what would be true after a hypothetical reposition.
6. **Gap / next action** is concrete and assignable.

---

## A. BSI TR-03161-1 — Mobile applications

> Applies to the iOS + watchOS app. All references to `Package.resolved`, `Info.plist`, entitlements etc. are to `TwoBreath-app/`.
> Source: [`regulations/markdown/BSI-TR-03161-1.md`](regulations/markdown/BSI-TR-03161-1.md) — v3.0 (25.03.2024).

### A.0 Grouping → official Prüfaspekte

The TR-03161-1 v3.0 organises requirements into **11 Prüfaspekte**. The CRY/AUT/STO/... shorthand below is a working alias used in this matrix; the column "Official" links to the corresponding chapter in the ingested regulation markdown.

| This matrix | Official Prüfaspekt | Link |
| --- | --- | --- |
| A.1 CRY | (5) Kryptographische Umsetzung | [§ 4.3.5](regulations/markdown/BSI-TR-03161-1.md#435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung) |
| A.2 AUT | (6) Authentisierung und Authentifizierung | [§ 4.3.6](regulations/markdown/BSI-TR-03161-1.md#436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung) |
| A.3 STO | (7) Datensicherheit | [§ 4.3.7](regulations/markdown/BSI-TR-03161-1.md#437-testcharakteristik-zu-prüfaspekt-7-datensicherheit) |
| A.4 NET | (9) Netzwerkkommunikation | [§ 4.3.9](regulations/markdown/BSI-TR-03161-1.md#439-testcharakteristik-zu-prüfaspekt-9-netzwerkkommunikation) |
| A.5 PLT | (10) Plattformspezifische Interaktionen | [§ 4.3.10](regulations/markdown/BSI-TR-03161-1.md#4310-testcharakteristik-zu-prüfaspekt-10-plattformspezifische-interaktionen) |
| A.6 RES | (11) Resilienz | [§ 4.3.11](regulations/markdown/BSI-TR-03161-1.md#4311-testcharakteristik-zu-prüfaspekt-11-resilienz) |
| A.7 PRC | (1) Anwendungszweck | [§ 4.3.1](regulations/markdown/BSI-TR-03161-1.md#431-testcharakteristik-zu-prüfaspekt-1-anwendungszweck) |
| A.8 CBP | (2) Architektur + (3) Quellcode + (4) Drittanbieter-Software | [§ 4.3.2](regulations/markdown/BSI-TR-03161-1.md#432-testcharakteristik-zu-prüfaspekt-2-architektur) · [§ 4.3.3](regulations/markdown/BSI-TR-03161-1.md#433-testcharakteristik-zu-prüfaspekt-3-quellcode) · [§ 4.3.4](regulations/markdown/BSI-TR-03161-1.md#434-testcharakteristik-zu-prüfaspekt-4-drittanbieter-software) |
| A.9 PAY | (8) Kostenpflichtige Ressourcen | [§ 4.3.8](regulations/markdown/BSI-TR-03161-1.md#438-testcharakteristik-zu-prüfaspekt-8-kostenpflichtige-ressourcen) |

> The matrix below uses CRY/AUT/STO shorthand for narrative grouping. The **full per-`O.*` enumeration** of all **127 official requirement IDs** with **resolved per-row status** lives in [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md), auto-generated from the ingested TR-03161-1 markdown + per-ID overrides in [`evidence/tr1-twobreath-status.yaml`](evidence/tr1-twobreath-status.yaml) by `scripts/build-official-matrix.py` (`make official-matrix`). Refresh after TR update or override edit.
>
> **Resolved totals (2026-05-02 v0.2):** ✅ **70 (55 %)** · 🟡 **2 (2 %)** · ❌ **0** · ➖ **55 (43 %)** · 🔍 0. **101/127 (~80 %) deterministisch erbringbar** (R 5 / D 94 / P 2). Manual: 26.
> Closure-Werkzeuge: 8 concept docs, `SECURITY.md`, `CI_CD_SECURITY.md`, `patches/PATCHES.md`. Verbleibende 🟡: O.Resi_5 / O.Resi_7 (App Attest) — bewusst aufgeschoben bis ein Hintergrundsystem existiert.

### A.1 Cryptographic implementation (CRY)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| CRY.1 | Approved cryptographic algorithms only (per BSI TR-02102) | D | Static crypto inventory YAML reconciled against build scan via [`semgrep`](https://semgrep.dev/) custom rules | 🔍 — TwoBreath relies on Apple `CryptoKit` defaults; inventory not yet authored | Author `crypto-inventory.yaml`; verify `CryptoKit` ciphers against TR-02102 |
| CRY.2 | Approved key lengths (e.g. AES-256, RSA-3072, ECC P-256+) | D | Same as CRY.1 | 🔍 | Same |
| CRY.3 | Secure random number generation | D | Confirm `SecRandomCopyBytes` / `SystemRandomNumberGenerator` usage; semgrep ban on `arc4random` | 🟡 — likely fine, no audit | Add semgrep rule + run |
| CRY.4 | Cryptographic key storage in iOS Keychain / Secure Enclave | D | Code review + entitlements check (`com.apple.developer.kernel.increased-memory-limit` etc.) | ➖ — TwoBreath stores no long-term cryptographic material today | Re-evaluate if backend / login added |
| CRY.5 | Ban deprecated algorithms (MD5, SHA-1, DES, RC4) | D | semgrep ruleset | ✅ likely (Apple SDK steers away) | Confirm via scan |

### A.2 Authentication (AUT)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| AUT.1 | Authentication required for sensitive functions | D | Behavioural test in [Playwright/XCUITest] | ➖ — no user account today | Re-evaluate if accounts/login added |
| AUT.2 | Multi-factor support for elevated actions | D | XCUITest scenario | ➖ | Re-evaluate |
| AUT.3 | Brute-force protection (rate limit, lockout) | R / D | Server-side rate-limit test or local backoff test | ➖ | Re-evaluate |
| AUT.4 | Secure session handling (token expiry, rotation) | D | Token claim assertion in test | ➖ | Re-evaluate |
| AUT.5 | Secure credential storage (Keychain) | D | Code review + entitlements | ➖ | Re-evaluate |

### A.3 Local data storage (STO)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| STO.1 | Sensitive data not persisted to insecure storage | D | [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) static + dynamic check | 🔍 | Run MobSF on archive build |
| STO.2 | App sandbox respected; no shared mutable storage | D | MobSF + entitlements check | ✅ likely (default iOS) | Confirm via scan |
| STO.3 | Data-at-rest encrypted (Data Protection class A/B) | D | Plist + entitlements check | ✅ likely | Confirm via scan |
| STO.4 | Cache / temp purge on lock or app close | D | XCUITest + filesystem inspection | 🟡 | Author test |
| STO.5 | No secrets in `Info.plist` / strings | D | [`gitleaks`](https://github.com/gitleaks/gitleaks) + MobSF strings | 🔍 | Run gitleaks on repo |

### A.4 Network communication (NET)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| NET.1 | TLS ≥ 1.2 on all outbound connections | D + R | `Info.plist` ATS audit + [`testssl.sh`](https://github.com/drwetter/testssl.sh) on every reachable host | 🟡 — App Talks to App Store CDN; marketing site uses HTTPS | Run `testssl --jsonfile` over `twobreath.com` and any image CDNs; archive |
| NET.2 | No ATS exceptions without justification | D | `Info.plist` parse — fail if `NSAllowsArbitraryLoads`=true | ✅ likely | Add CI check |
| NET.3 | Certificate pinning for all backend hosts (where backend exists) | D | [`mitmproxy`](https://mitmproxy.org/) automated probe | ➖ — no backend today | Re-evaluate |
| NET.4 | Strong cipher suites only | R | testssl on hosts | 🔍 | Run + archive |
| NET.5 | HSTS where applicable | R | curl + header check | 🟡 (web) | [Mozilla Observatory](https://observatory.mozilla.org/) on `twobreath.com` |

### A.5 Platform interaction (PLT)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| PLT.1 | Minimal entitlements requested | D | Entitlements diff vs declared need; manual review | 🔍 | Audit `TwoBreath.entitlements` |
| PLT.2 | Background tasks scoped and disclosed | D | Plist + `BGTaskScheduler` audit | 🔍 | Audit |
| PLT.3 | Sensitive APIs (mic, camera, location, health) require runtime consent | D | Plist usage strings + XCUITest | ✅ likely (TwoBreath uses haptics + audio output, voice prompts) | Confirm |
| PLT.4 | App attestation / Device Check (where available) | D | Code grep + verify | ➖ — not attested today | Consider if backend added |
| PLT.5 | Anti-tamper / jailbreak detection (advisory under TR) | D | MobSF | ➖ | Document decision (TR-03161 typically accepts platform protections) |

### A.6 Resilience & update (RES)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| RES.1 | Signed updates only | D | Apple Notarisation + App Store distribution path is the proof; archive notarisation receipt | ✅ (App Store) | Capture receipt per release |
| RES.2 | Update mechanism does not bypass platform | D | Confirm no in-app downloaded executable code | ✅ | Add semgrep rule banning `dlopen` etc. |
| RES.3 | Recovery from corrupted state | M / D | Crash-loop XCUITest + manual review | 🔍 | Author test |
| RES.4 | SBOM produced per release | D | [`syft`](https://github.com/anchore/syft) over Xcode build → CycloneDX | ❌ — not generated today | Wire into GitHub Actions |
| RES.5 | Dependency CVE scan blocking on CRITICAL/HIGH | D | [`osv-scanner`](https://github.com/google/osv-scanner) on `Package.resolved` | ❌ | Wire into CI |

### A.7 Secure data processing (PRC)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| PRC.1 | Input validation on all user input | D | semgrep + code review | 🔍 | Run semgrep |
| PRC.2 | Output encoding (where rendering external content) | D | semgrep | ➖ — TwoBreath renders only static + own content | Re-evaluate |
| PRC.3 | No PII in logs | R + D | Log sample probe with [microsoft/presidio](https://github.com/microsoft/presidio) regex set | ✅ likely (no PII collected) | Document zero-PII posture explicitly |
| PRC.4 | Error messages do not leak internals | D | XCUITest scenarios | 🔍 | Author tests |

### A.8 Coding best practices (CBP)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| CBP.1 | Static analysis on each commit | D | [`swiftlint`](https://github.com/realm/SwiftLint) + [`semgrep`](https://semgrep.dev/) | 🟡 — likely some lint locally; not in CI | Wire into GitHub Actions |
| CBP.2 | No hard-coded secrets | D | [`gitleaks`](https://github.com/gitleaks/gitleaks), [`trufflehog`](https://github.com/trufflesecurity/trufflehog) | ❌ not enforced | Pre-commit + CI |
| CBP.3 | No banned APIs (e.g. `eval`, dynamic code load) | D | semgrep | ✅ likely | Confirm |
| CBP.4 | Code review on every change | M | GitHub PR policy | 🟡 (solo dev) | Document review-of-self process or add reviewer |
| CBP.5 | Threat model maintained | M / D | [`threagile`](https://threagile.io/) YAML in repo | ❌ | Author baseline threat model |

### A.9 Paid resources (PAY)

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| PAY.1 | Payment via platform-approved channels | D | App Store IAP only; no external payment | ✅ (if TwoBreath uses IAP) | Confirm |
| PAY.2 | No transmission of cardholder data through app | D | Audit + MobSF | ✅ | Document |

---

## B. BSI TR-03161-2 — Web applications

> Marketing site `twobreath.com` (GitHub Pages, static). The TwoBreath product itself has no web app.

| ID | Requirement | Class | Proof / Tool | TwoBreath status | Gap / next action |
| --- | --- | --- | --- | --- | --- |
| WEB.1 | TLS ≥ 1.2 + HSTS | R | [`testssl.sh`](https://github.com/drwetter/testssl.sh), [Mozilla Observatory](https://observatory.mozilla.org/) | 🔍 | Run + archive |
| WEB.2 | HTTP security headers (CSP, X-Frame-Options, X-Content-Type-Options) | R | Mozilla Observatory | 🔍 | Run + archive |
| WEB.3 | No PII collected from marketing site | M | Privacy policy + analytics audit | 🔍 | Document |
| WEB.* | All other TR-03161-2 controls | ➖ | — | Not applicable — site is static, no auth, no user data | Re-evaluate if app web client added |

---

## C. BSI TR-03161-3 — Backend systems

> No backend exists for TwoBreath today. All rows are ➖ pending the trigger.

**Trigger to populate this section:** any DiGA-related backend (prescription redemption, telemetry for positive-care-effect evidence, clinician dashboard, payer API). Adding any of these activates **the entire TR-03161-3 catalogue plus likely [BSI C5](https://www.bsi.bund.de/dok/7685384) for the cloud platform**.

| Anticipated control area | Class once active | Candidate tool | Notes |
| --- | --- | --- | --- |
| Container CVE scan | D | [`trivy image`](https://github.com/aquasecurity/trivy) | |
| IaC scan | D | [`checkov`](https://github.com/bridgecrewio/checkov), [`tfsec`](https://github.com/aquasecurity/tfsec) | |
| K8s CIS benchmark | P | [`kube-bench`](https://github.com/aquasecurity/kube-bench) | |
| API contract | D | [`schemathesis`](https://github.com/schemathesis/schemathesis) | |
| DAST | P | [OWASP ZAP](https://www.zaproxy.org/) | |
| Audit log retention | R | LogQL query | |

---

## D. DiGAV (BfArM)

> Source: [`regulations/markdown/DiGAV.md`](regulations/markdown/DiGAV.md) — fetched live from gesetze-im-internet.de. Each row's Section column links to the local ingested copy; the official online text is footnoted at the end of the table.

| Section | Requirement | Class | Proof | TwoBreath status | Gap |
| --- | --- | --- | --- | --- | --- |
| [§ 3](regulations/markdown/DiGAV.md#p3) | Sicherheit & Funktionstauglichkeit (CE / MDR) | M | CE Declaration of Conformity | ❌ | MDR pathway not started |
| [§ 4](regulations/markdown/DiGAV.md#p4) | Datenschutz & Datensicherheit | M + D | BSI cert + GDPR Art. 42 cert | ❌ | This exercise prepares the BSI side |
| [§ 5](regulations/markdown/DiGAV.md#p5) | Qualität (usability, accessibility, robustness) | M | Test reports, accessibility audit | 🔍 | Run [WCAG audit](https://www.w3.org/WAI/standards-guidelines/wcag/) |
| [§ 6](regulations/markdown/DiGAV.md#p6) | Interoperabilität (FHIR, SNOMED CT) | M | Spec compliance reports | ➖ today | Re-evaluate per indication |
| [§ 7](regulations/markdown/DiGAV.md#p7) | Nachweis durch Zertifikate | M | Certificate PDFs | ❌ | Pending Pillars |
| [§ 18](regulations/markdown/DiGAV.md#p18) | Wesentliche Veränderungen | M | Change-management process doc | ❌ | Author SOP |

Online sources: [§ 3](https://www.gesetze-im-internet.de/digav/__3.html) · [§ 4](https://www.gesetze-im-internet.de/digav/__4.html) · [§ 5](https://www.gesetze-im-internet.de/digav/__5.html) · [§ 6](https://www.gesetze-im-internet.de/digav/__6.html) · [§ 7](https://www.gesetze-im-internet.de/digav/__7.html) · [§ 18](https://www.gesetze-im-internet.de/digav/__18.html)

---

## E. § 139e SGB V

> Source: [`regulations/markdown/SGB-V-139e.md`](regulations/markdown/SGB-V-139e.md). Online: [gesetze-im-internet.de](https://www.gesetze-im-internet.de/sgb_5/__139e.html).

| Para | Requirement | Class | Proof | TwoBreath status | Gap |
| --- | --- | --- | --- | --- | --- |
| (2) | Three pillars (safety, data security, positive care effect) | M | Listing dossier | ❌ | See PLANNING § 4 |
| (6) | Change notification duty | M | Provider SOP | ❌ | Author |
| (10) | BSI data security requirements (TR-03161 + cert) | M + D | Tracked in [§ A](#a-bsi-tr-03161-1--mobile-applications) | 🟡 | This exercise |
| (11) | BfArM data protection requirements (GDPR Art. 42 cert) | M | Cert PDF | ❌ | Out of scope this exercise |

---

## F. GDPR

| Article | Requirement | Class | Proof | TwoBreath status | Gap |
| --- | --- | --- | --- | --- | --- |
| [Art. 25](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e3063-1-1) | Privacy by design / by default | M + D | Architecture doc + scan results | 🟡 — local-only architecture is strong evidence | Document explicitly |
| [Art. 32](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e3383-1-1) | Security of processing (TOMs) | M + D | TOMs document + scan results | 🟡 | Author TOMs doc |
| [Art. 35](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e3546-1-1) | DPIA for high-risk processing | M | DPIA document | ❌ | Required if/when health data processed |
| [Art. 42](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e3926-1-1) | Certification mechanism | M | Cert PDF | ❌ | Out of scope this exercise |

---

## G. MDR + medical-device standards

All M-class. Out of scope to produce in this exercise; tracked here so the matrix is honest about the surrounding regulatory perimeter.

| Standard | Purpose | TwoBreath status |
| --- | --- | --- |
| [MDR (EU) 2017/745](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745) | Medical device qualification | ❌ |
| [ISO 13485](https://www.iso.org/standard/59752.html) | QMS for medical devices | ❌ |
| [ISO 14971](https://www.iso.org/standard/72704.html) | Risk management | ❌ |
| [IEC 62304](https://www.iso.org/standard/38421.html) | Software lifecycle | 🟡 — git history + CI provide most artefacts informally |
| [IEC 82304-1](https://www.iso.org/standard/62863.html) | Health software product safety | ❌ |

---

## Coverage summary

| Section | Total rows | ✅ | 🟡 | ❌ | ➖ | 🔍 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A.1 CRY | 5 | 0 | 1 | 0 | 1 | 3 |
| A.2 AUT | 5 | 0 | 0 | 0 | 5 | 0 |
| A.3 STO | 5 | 0 | 1 | 0 | 0 | 4 |
| A.4 NET | 5 | 0 | 2 | 0 | 1 | 2 |
| A.5 PLT | 5 | 0 | 0 | 0 | 1 | 4 |
| A.6 RES | 5 | 1 | 0 | 2 | 0 | 2 |
| A.7 PRC | 4 | 0 | 1 | 0 | 1 | 2 |
| A.8 CBP | 5 | 0 | 2 | 1 | 0 | 2 |
| A.9 PAY | 2 | 1 | 0 | 0 | 0 | 1 |
| **TR-03161-1 total** | **41** | **2** | **7** | **3** | **8** | **20** |

`🔍` rows are the immediate target after Phase 2 ingestion + Phase 3 tool wiring. `❌` rows are the most informative for the BSI dialogue — they show where deterministic tooling already exists but is not wired into the typical provider pipeline.

---

## References

### BSI / TR-03161

- [TR-03161 hub](https://www.bsi.bund.de/dok/TR-03161)
- [TR-03161-1 — Mobile (PDF)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR03161/BSI-TR-03161-1.pdf?__blob=publicationFile)
- [TR-03161-2 — Web (PDF)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR03161/BSI-TR-03161-2.pdf?__blob=publicationFile)
- [TR-03161-3 — Backend (PDF)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR03161/BSI-TR-03161-3.pdf?__blob=publicationFile)
- [TR-02102 — Cryptographic mechanisms](https://www.bsi.bund.de/dok/TR-02102)
- [BSI C5 — Cloud security catalogue](https://www.bsi.bund.de/dok/7685384)

### German law

- [§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)
- [DiGAV](https://www.gesetze-im-internet.de/digav/)

### EU

- [GDPR (EU) 2016/679](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
- [MDR (EU) 2017/745](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745)

### Tooling (alphabetical)

- [checkov](https://github.com/bridgecrewio/checkov) · [cosign](https://github.com/sigstore/cosign) · [gitleaks](https://github.com/gitleaks/gitleaks) · [Mozilla Observatory](https://observatory.mozilla.org/) · [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) · [osv-scanner](https://github.com/google/osv-scanner) · [OWASP ZAP](https://www.zaproxy.org/) · [presidio](https://github.com/microsoft/presidio) · [schemathesis](https://github.com/schemathesis/schemathesis) · [semgrep](https://semgrep.dev/) · [swiftlint](https://github.com/realm/SwiftLint) · [syft](https://github.com/anchore/syft) · [testssl.sh](https://github.com/drwetter/testssl.sh) · [threagile](https://threagile.io/) · [trivy](https://github.com/aquasecurity/trivy) · [trufflehog](https://github.com/trufflesecurity/trufflehog)
