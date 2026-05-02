# DiGA × BSI TR-03161 — TwoBreath als Praxisbeispiel

> **Was ist das hier?** Eine reproduzierbare Auswertung aller **127 Prüfanforderungen** der BSI TR-03161-1 v3.0 (25.03.2024) gegen die reale TwoBreath-iOS/watchOS-Anwendung — als Diskussionsgrundlage für die Modernisierung des DiGA-Datensicherheits-Zertifizierungsverfahrens nach § 139e Abs. 10 SGB V.

**Autor:** Matthias Buchhorn-Roth
**Stand:** 2026-05-02 · Entwurf v0.1

---

## Wo soll ich anfangen?

| Wenn Sie sind … | … lesen Sie zuerst |
| --- | --- |
| **BSI / Referat DI 24** | [`BSI_BERICHT.md`](BSI_BERICHT.md) — formaler Bericht mit 5 Empfehlungen |
| **Patient:in, Ärzt:in, Krankenkasse, Hersteller** | [`LINKEDIN_ARTIKEL.md`](LINKEDIN_ARTIKEL.md) — der LinkedIn-Beitrag |
| **Prüfstelle / Auditor:in** | [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) — alle 127 Anforderungen mit Status, Klasse und Quelle |
| **technisch interessiert** | [`PLANNING.md`](PLANNING.md) und [`MEMORY.md`](MEMORY.md) |

## Kernergebnis

| Status | Anforderungen | Anteil |
| --- | ---: | ---: |
| ✅ erfüllt | 40 | 31 % |
| 🟡 teilweise | 25 | 20 % |
| ❌ Lücke (konkret behebbar) | 6 | 5 % |
| ➖ nicht anwendbar (heute) | 56 | 44 % |

**101 von 127 Anforderungen (~80 %) sind grundsätzlich deterministisch erbringbar** (R real-time / D deploy-time / P periodisch). Nur 26 (20 %) erfordern manuelles Urteil. Die heutige Praxis behandelt jedoch fast alle Nachweise wie manuelle Dokumente — genau hier liegt die zu hebende Diskrepanz.

## Inhaltsverzeichnis

```
diga/
├── README.md                          ← Sie sind hier
├── PLANNING.md                        Planungsdokument + Eignungsanalyse
├── MEMORY.md                          Lauf-Protokoll + Reproduktions-Anleitung
├── COMPLIANCE_MATRIX.md               Kurzform-Arbeitsmatrix (CRY/AUT/STO)
├── COMPLIANCE_MATRIX_TR1_OFFICIAL.md  127-Zeilen-Matrix entlang offizieller O.*-IDs
├── BSI_BERICHT.md                     Formaler Bericht für das BSI (Behördendeutsch)
├── LINKEDIN_ARTIKEL.md                LinkedIn-Beitrag für die Öffentlichkeit
├── GITHUB_ISSUE.md                    Anleitung zum Anlegen eines Tracking-Issues
├── GITHUB_ISSUE_BODY.md               Kopiervorlage für gh issue create
├── Makefile                           make ingest | make official-matrix
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
