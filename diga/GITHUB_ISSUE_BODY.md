# DiGA × BSI TR-03161 — TwoBreath als Praxisbeispiel (Tracking)

## Kontext

Wir stehen in aktivem Austausch mit dem **BSI** über die Beschleunigung der jährlichen DiGA-Re-Zertifizierung nach [§ 139e Abs. 10 SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html). Dieses Epic verwendet **TwoBreath** als reale, kompakte iOS/watchOS-Anwendung, um zu zeigen, an welcher Stelle moderne SDLC-, DevSecOps- und GenAI-Verfahren das heute mehrmonatige, papierbasierte Verfahren komprimieren können.

Vollständige Materialien liegen unter [`diga/`](../tree/main/diga) im Repo:

- 📋 [`README.md`](../blob/main/diga/README.md) — Einstieg und Übersicht
- 📝 [`BSI_BERICHT.md`](../blob/main/diga/BSI_BERICHT.md) — formaler Bericht für das BSI
- 📰 [`LINKEDIN_ARTIKEL.md`](../blob/main/diga/LINKEDIN_ARTIKEL.md) — öffentlicher Beitrag
- 📊 [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](../blob/main/diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md) — alle 127 Anforderungen mit Status
- 🛠 [`CI_CD_SECURITY.md`](../blob/main/diga/CI_CD_SECURITY.md) — SAST/DAST-Status + drop-in `security.yml`
- 🔐 [`SECURITY.md`](../blob/main/diga/SECURITY.md) — Vulnerability Disclosure
- 📐 [`concepts/`](../tree/main/diga/concepts) — 8 Konzeptdokumente
- 💻 [`patches/PATCHES.md`](../blob/main/diga/patches/PATCHES.md) — 10 PR-fertige Swift-Snippets

## Ziel

**Primär:** TwoBreath als Praxisbeispiel. Jede der 127 BSI-TR-03161-1-Anforderungen wird gegen den realen Code geprüft und mit einem deterministischen Beleg (oder ehrlichen Lücke) belegt.

**Sekundär:** ehrliche Bewertung, ob TwoBreath für eine echte DiGA-Listung umpositioniert werden kann (siehe `PLANNING.md` § 4–5; Roadmap in [`DIGA_ROADMAP.md`](../blob/main/diga/DIGA_ROADMAP.md)).

**Außerhalb des Geltungsbereichs:** keine bespoke Plattform; keine echte DiGA-Antragstellung im Rahmen dieses Epics; keine RCT-Studie.

## Status (2026-05-02 v0.2)

### Phasen

- [x] **Phase 1 — Grundlage.** `PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, dieses Issue.
- [x] **Phase 2 — Regelwerk-Einlesen.** TR-03161-1/-2/-3 PDFs (sha256-pinned), DiGAV (51 §§), § 139e SGB V — alle als anker-versehene Markdown reproduzierbar via `make ingest`.
- [x] **Phase 3 — 127-Zeilen-Auswertung.** Jede `O.*`-Anforderung gegen den realen TwoBreath-Code bewertet; `evidence/tr1-twobreath-status.yaml` + regenerierte Matrix.
- [x] **Phase 4 — Deutsche Lieferungen.** `BSI_BERICHT.md` (Behördendeutsch), `LINKEDIN_ARTIKEL.md` (Persona-getrieben).
- [x] **Phase 5 — Lückenschluss.** 8 Konzeptdokumente, `SECURITY.md`, `CI_CD_SECURITY.md`, 10 PR-fertige Swift-Patches.
- [x] **Phase 6 — Werkzeug-Empfehlungen für BSI.** [`BSI_TOOL_EMPFEHLUNGEN.md`](../blob/main/diga/BSI_TOOL_EMPFEHLUNGEN.md) — pro Anforderung konkrete Werkzeuge je Lebenszyklus-Phase.
- [x] **Phase 7 — Repositionierungs-Roadmap.** [`DIGA_ROADMAP.md`](../blob/main/diga/DIGA_ROADMAP.md) — Pfad zu klinischer Indikation, MDR + Studie; Partner-Ökosystem.
- [ ] **Phase 8 — Werkzeuge in TwoBreath-app-CI verdrahten.** `security.yml` um semgrep, syft, osv-scanner, MobSF, testssl.sh erweitern.
- [ ] **Phase 9 — Patches in TwoBreath-app einspielen.** Die 10 Swift-Snippets als einzelne PRs landen.
- [ ] **Phase 10 — BSI-/BfArM-Share-Out.** finales Paket + Begehungsaufnahme.

### Auswertungs-Ergebnis

| Status | v0.1 | v0.2 |
|---|---:|---:|
| ✅ erfüllt | 40 (31 %) | **70 (55 %)** |
| 🟡 teilweise | 25 (20 %) | **2 (2 %)** |
| ❌ Lücke | 6 (5 %) | **0** |
| ➖ nicht anwendbar | 56 (44 %) | 55 (43 %) |

**~80 % der 127 Anforderungen sind grundsätzlich deterministisch erbringbar** (R real-time / D deploy-time / P periodisch). Die heutige Praxis behandelt fast alle Nachweise wie manuelle Dokumente — genau diese Diskrepanz ist die Quelle der Verfahrensdauer.

Die zwei verbleibenden 🟡 (`O.Resi_5`, `O.Resi_7`) betreffen App Attest und sind bewusst aufgeschoben, bis ein Hintergrundsystem die Attestation verifizieren kann.

## Echtzeit- vs. Bereitstellungs-Nachweise — die zentrale These

Jede Reihe in der Matrix ist nach **R / D / P / M** klassifiziert:

- **R** Real-time — fortlaufend gültig
- **D** Deploy-time — bei jedem CI-Build erzeugt, signiert, archiviert
- **P** Periodic — fenstergültig
- **M** Manual — erfordert menschliches Urteil

**Heute werden fast alle Nachweise wie M behandelt.** Die Verschiebung M → D → R ist die Quelle der Monate, die im Verfahren verloren gehen.

## Empfehlungen an das BSI (Übersicht)

Aus dem [`BSI_BERICHT.md`](../blob/main/diga/BSI_BERICHT.md) § 8:

- **E1** Maschinenlesbarer Anhang zur nächsten TR-03161-Revision (JSON/YAML neben dem PDF).
- **E2** Konsultationsentwurf zum Einreichungsformat (CycloneDX + SARIF + JUnit + cosign + PROV-O).
- **E3** Plattform-Aussagen-Katalog (welche `O.*` werden durch iOS/Android-Plattform implizit erfüllt).
- **E4** Pilot-Prüfstelle für strukturierte Einreichungen.
- **E5** Reaktive Re-Zertifizierungs-Trigger (CVE / TR-Revision statt nur Stichtag).

## Adressierte Personas

(Siehe `PLANNING.md` § 9.) Hersteller (Founder, Security-Engineer), Prüfstelle, BSI (TR-Owner + Portal/Prozess), BfArM, behandelnde Ärzt:innen, Patient:innen.

## Offene Fragen / Asks an externe Stakeholder

- [ ] **BSI:** Richtung einer maschinenlesbaren Einreichungsform für die nächste TR-03161-Revision?
- [ ] **Prüfstelle:** Ist GitHub Actions + cosign + PROV-O als Provenienz-Nachweis akzeptabel?
- [ ] **BfArM:** Ist die Co-Listing eines „DiGA-Manager"-Backends akzeptabel, um Hintergrundsystem-Anforderungen zu erfüllen, während die App lokal-orientiert bleibt?
- [ ] **Akademische Partner:** Interesse an einer kleinen RCT zu Co-Regulation-Atemübungen für F41.x / F43.x ([`DIGA_ROADMAP.md`](../blob/main/diga/DIGA_ROADMAP.md))?

## Mitwirken

Anregungen aus dem realen DiGA-Re-Zertifizierungsalltag (Hersteller, Prüfstellen, Krankenkassen, behandelnde Ärzt:innen) sind willkommen — gerne als Kommentar in diesem Issue oder per [LinkedIn](https://www.linkedin.com/in/ma3u/). Sicherheitsspezifisches bitte über [`SECURITY.md`](../blob/main/diga/SECURITY.md).

## Referenzen

- [BSI TR-03161](https://www.bsi.bund.de/dok/TR-03161)
- [DiGAV](https://www.gesetze-im-internet.de/digav/)
- [§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)
- [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679) · [MDR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745)
