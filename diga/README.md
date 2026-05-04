# DiGA × BSI TR-03161 — TwoBreath als Praxisbeispiel

> **Was ist das hier?** Eine reproduzierbare Auswertung aller **127 Prüfanforderungen** der BSI TR-03161-1 v3.0 (25.03.2024) gegen die reale TwoBreath-iOS/watchOS-Anwendung — als Diskussionsgrundlage für die Modernisierung des DiGA-Datensicherheits-Zertifizierungsverfahrens nach § 139e Abs. 10 SGB V.

**Autor:** Matthias Buchhorn-Roth
**Stand:** 2026-05-02 · Entwurf v0.1

---

## Wo soll ich anfangen?

| Wenn Sie sind … | … lesen Sie zuerst |
| --- | --- |
| **BSI / Referat DI 24** | [`BSI_BERICHT.md`](BSI_BERICHT.md) — formaler Bericht mit 5 Empfehlungen + [`BSI_TOOL_EMPFEHLUNGEN.md`](BSI_TOOL_EMPFEHLUNGEN.md) (pro Anforderung) |
| **Prüfstelle bei Beauftragung** | [`BSI_ASSESSMENT.md`](BSI_ASSESSMENT.md) — **Hersteller-Selbstdeklaration** (12 Abschnitte, alle Anhänge verlinkt) |
| **Grundschutz++ / Zero-Trust-Diskussion** | [`BSI_GRUNDSCHUTZ_ZT.md`](BSI_GRUNDSCHUTZ_ZT.md) — Eignungs-Analyse: methodisch ja, strukturell nein |
| **Patient:in, Ärzt:in, Krankenkasse, Hersteller** | [`LINKEDIN_ARTIKEL.md`](LINKEDIN_ARTIKEL.md) — der LinkedIn-Beitrag |
| **Prüfstelle / Auditor:in** | [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) — alle 127 Anforderungen mit Status, Klasse und Quelle |
| **DevSecOps-interessiert** | [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) — SAST/DAST-Status und konkreter `security.yml`-Erweiterungs-Vorschlag |
| **Hersteller (Code-Vorlage)** | [`patches/PATCHES.md`](patches/PATCHES.md) — 10 PR-fertige Swift-Snippets |
| **strategische Roadmap (DiGA-Listung)** | [`DIGA_ROADMAP.md`](DIGA_ROADMAP.md) — Repositionierungs-Plan + Partner-Ökosystem |
| **Partner-Liste mit Quellenlinks** | [`PARTNER_SHORTLIST.md`](PARTNER_SHORTLIST.md) — recherchierte und verifizierte Kandidat:innen je Kategorie |
| **technisch interessiert** | [`PLANNING.md`](PLANNING.md) und [`MEMORY.md`](MEMORY.md) |

## Kernergebnis

| Status | v0.1 | v0.2 (nach Schließung) |
| --- | ---: | ---: |
| ✅ erfüllt | 40 (31 %) | **70 (55 %)** |
| 🟡 teilweise | 25 (20 %) | **2 (2 %)** |
| ❌ Lücke | 6 (5 %) | **0** |
| ➖ nicht anwendbar | 56 (44 %) | 55 (43 %) |

**101 von 127 Anforderungen (~80 %) sind grundsätzlich deterministisch erbringbar** (R real-time / D deploy-time / P periodisch). Nur 26 (20 %) erfordern manuelles Urteil. Die ehemaligen 6 ❌- und 23 von 25 🟡-Reihen sind durch acht Konzeptdokumente (`concepts/`), `SECURITY.md`, `CI_CD_SECURITY.md` und zehn PR-fertige Code-Patches (`patches/PATCHES.md`) geschlossen. Die zwei verbleibenden 🟡 betreffen App Attest und sind bewusst aufgeschoben (warten auf Backend).

## Inhaltsverzeichnis

```
diga/
├── README.md                          ← Sie sind hier
├── PLANNING.md                        Planungsdokument + Eignungsanalyse
├── MEMORY.md                          Lauf-Protokoll + Reproduktions-Anleitung
├── COMPLIANCE_MATRIX_TR1_OFFICIAL.md  127-Zeilen-Matrix entlang offizieller O.*-IDs (auto-generiert)
├── BSI_BERICHT.md                     Formaler Bericht für das BSI (Behördendeutsch)
├── BSI_ASSESSMENT.md                  Hersteller-Selbstdeklaration für die Prüfstelle
├── BSI_GRUNDSCHUTZ_ZT.md              Eignung für Grundschutz++ und ZT-Eckpunktepapier
├── BSI_TOOL_EMPFEHLUNGEN.md           Werkzeug-Empfehlungen je Anforderung × Phase
├── LINKEDIN_ARTIKEL.md                LinkedIn-Beitrag für die Öffentlichkeit
├── DIGA_ROADMAP.md                    Repositionierungs-Roadmap + Partner-Ökosystem
├── PARTNER_SHORTLIST.md               recherchierte konkrete Partner-Kandidat:innen mit Quellen
├── CI_CD_SECURITY.md                  SAST/DAST-Status + drop-in security.yml-Erweiterung
├── SECURITY.md                        Vulnerability Disclosure (verschlüsselter Kanal)
├── NOTICE.md                          Drittquellen-Attribution
├── LICENSE                            MIT für Eigeninhalte
├── Makefile                           make ingest | make official-matrix
├── concepts/                          formale Konzeptdokumente (8 Stück)
│   ├── 01-datenschutzkonzept.md       Zwecke, Rechtsgrundlagen, Widerruf
│   ├── 02-datenlebenszyklus.md        Datenfluss-Diagramm + Trust-Boundaries
│   ├── 03-threat-model.md             STRIDE-Bedrohungsanalyse
│   ├── 04-secure-coding-standards.md  Swift-spezifische Sicherheits-Regeln
│   ├── 05-einwilligungsverzeichnis.md Hersteller-Verzeichnis (O.Purp_6)
│   ├── 06-kryptographiekonzept.md     explizite Plattform-Delegierung TR-02102
│   ├── 07-netzwerk-sicherheitskonzept.md MPC, ATS, Logging
│   └── 08-resilienz-haertungskonzept.md Stufenmodell, Re-Validierung
├── patches/
│   └── PATCHES.md                     10 PR-fertige Swift-Snippets
├── evidence/
│   └── tr1-twobreath-status.yaml      Per-O.*-Bewertung (127 Einträge)
├── regulations/
│   ├── source-manifest.yaml           URLs + sha256 aller Quelldokumente
│   ├── markdown/                      eingelesene TR-03161-1/-2/-3, DiGAV, § 139e SGB V
│   ├── pdf/                           (.gitignore — via `make fetch` reproduzierbar)
│   └── html/                          (.gitignore — via `make fetch` reproduzierbar)
└── scripts/
    ├── fetch-pdfs.sh                  BSI-PDFs herunterladen
    ├── fetch-laws.py                  DiGAV + § 139e SGB V scrapen
    ├── pdf-to-md.py                   PDF → Markdown mit TOC + Anker
    └── build-official-matrix.py       Matrix aus TR-Markdown + YAML-Overrides bauen
```

## Reproduktion

```bash
git clone https://github.com/ma3u/TwoBreath.git
cd TwoBreath/diga
make ingest          # PDFs + Gesetze laden, in Markdown wandeln, 127-Zeilen-Matrix bauen
```

`make ingest` führt aus:

1. `scripts/fetch-pdfs.sh` — lädt BSI TR-03161-1/-2/-3 von `bsi.bund.de`, schreibt sha256 in `regulations/source-manifest.yaml`.
2. `scripts/fetch-laws.py` — lädt 51 DiGAV-Paragraphen + § 139e SGB V von `gesetze-im-internet.de`.
3. `scripts/pdf-to-md.py` — PDF → Markdown mit Kapitel-/Anforderungs-Ankern.
4. `scripts/build-official-matrix.py` — kombiniert TR-Markdown mit `evidence/tr1-twobreath-status.yaml` zur `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`.

**Voraussetzungen:** `python3` ≥ 3.11, `pdftotext` (poppler), `curl`, `pyyaml`, `beautifulsoup4`.

## Methodik in einem Satz

Markdown-zuerst, deterministische Werkzeuge auf dem Beweispfad, generative KI (Claude Opus 4.7) ausschließlich auf dem Strukturierungspfad. Keine Plattform, kein Vendor-Lock-in. Quellen sha256-gepinnt; jede Veränderung am Regelwerk erscheint als Diff in einem Pull Request.

## Was ist TwoBreath?

[TwoBreath](https://www.twobreath.com) ist eine iOS-/Apple-Watch-App für Paar-Atemübungen, die ich gemeinsam mit Dascha entwickelt habe. **TwoBreath ist heute keine DiGA** — und genau deshalb ein nützliches methodisches Beispiel: kein Hintergrundsystem, keine Konten, keine Drittanbieter-Bibliotheken. Diese kompakte Angriffsfläche erlaubt eine saubere TR-03161-Auswertung ohne Vermischung mit umfangreichen Backend-Themen. Der Umfang der Anforderungen ändert sich, sobald ein Hintergrundsystem hinzukommt; die Methodik nicht.

## Lizenz und Quellen

Eigene Inhalte unter [MIT-Lizenz](LICENSE). Verbatim-Auszüge aus offiziellen Quellen — siehe [`NOTICE.md`](NOTICE.md):

- BSI TR-03161-1/-2/-3, BSI TR-02102 — © Bundesamt für Sicherheit in der Informationstechnik. Auszüge zur Kommentierung im Sinne der Werkzeug-Diskussion mit Referat DI 24.
- DiGAV, § 139e SGB V — amtliche Werke gemäß § 5 UrhG, gemeinfrei.

Die kanonischen Originalfassungen verlinken wir in `regulations/source-manifest.yaml`. Bei Abweichung gilt stets die offizielle Fassung.

## Mitwirken

Der Bericht ist ein Arbeitsstand. Ergänzende Erfahrungen aus dem realen DiGA-Re-Zertifizierungsalltag (Hersteller, Prüfstellen, Krankenkassen) sind ausdrücklich willkommen — gerne als GitHub-Issue oder per [LinkedIn](https://www.linkedin.com/in/ma3u/).

---

*Für Kontext zum Hackathon, Marketing-Site und Pitch siehe das übergeordnete [`README.md`](../README.md) im TwoBreath-Repo.*
