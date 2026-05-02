# Bericht an das BSI: Modernisierung des TR-03161-Zertifizierungsverfahrens

**Verfasser:** Matthias Buchhorn-Roth
**Datum:** 2026-05-02
**Bezug:** Laufender Austausch mit dem BSI zur Verbesserung des Verfahrens zur Datensicherheits-Zertifizierung digitaler Gesundheitsanwendungen nach § 139e Abs. 10 SGB V i. V. m. BSI TR-03161
**Status:** Entwurf v0.1 — zur Diskussion mit dem Referat DI 24

---

## Inhaltsverzeichnis

- [1. Anlass und Zielsetzung](#1-anlass-und-zielsetzung)
- [2. Untersuchungsgegenstand](#2-untersuchungsgegenstand)
- [3. Methodik](#3-methodik)
- [4. Klassifikationsmodell der Prüfanforderungen](#4-klassifikationsmodell-der-prüfanforderungen)
- [5. Quantitative Ergebnisse](#5-quantitative-ergebnisse)
- [6. Qualitative Befunde](#6-qualitative-befunde)
- [7. Hebel zur Verfahrensbeschleunigung](#7-hebel-zur-verfahrensbeschleunigung)
- [8. Empfehlungen an das BSI](#8-empfehlungen-an-das-bsi)
- [9. Risiken und offene Fragen](#9-risiken-und-offene-fragen)
- [10. Anlagen und Referenzen](#10-anlagen-und-referenzen)

---

## 1. Anlass und Zielsetzung

Mit der verpflichtenden Vorlage eines BSI-Zertifikats nach TR-03161 für DiGA seit dem 1. Januar 2025 (§ 139e Abs. 10 Satz 3 SGB V) hat sich der regulatorische Rahmen verfestigt. Die Praxiserfahrung der Hersteller — über mehrere Berater- und Prüfstellen-Mandate hinweg — zeigt jedoch, dass das Zertifizierungs- und insbesondere das jährliche Re-Zertifizierungsverfahren weiterhin überwiegend papier- und manuellgestützt verläuft. Typische Durchlaufzeiten liegen im Bereich mehrerer Monate. Die Folge ist ein dauerhafter Ressourcen- und Erlöswettbewerb gegen die Re-Zertifizierungstaktung selbst.

Dieser Bericht dokumentiert eine **konkrete, anhand einer realen Anwendung durchgeführte Auswertung** sämtlicher 127 Prüfanforderungen aus TR-03161-1 v3.0 mit dem Ziel, dem BSI einen evidenzbasierten Diskussionsbeitrag zur Verfahrensmodernisierung vorzulegen. Er ist ausdrücklich **kein Antrag** und **keine Marketingmitteilung**, sondern eine technisch belastbare Diskussionsgrundlage.

Der zentrale Befund ist quantifizierbar: Ein erheblicher Teil der TR-03161-Anforderungen lässt sich **deterministisch** und entweder **zur Bereitstellungszeit (D — deploy-time)** oder **zur Laufzeit (R — real-time)** durch standardisierte, signierbare Werkzeuge erbringen. Die heutige Praxis behandelt diese Anforderungen jedoch überwiegend wie manuelle (M-) Nachweise. Genau diese Diskrepanz ist die Quelle des Großteils der Verfahrensdauer.

## 2. Untersuchungsgegenstand

Als Untersuchungsgegenstand dient die mobile Anwendung **„TwoBreath"** (iOS + watchOS, Swift / SwiftUI). Sie ist **nicht** als DiGA gelistet und wird in diesem Bericht ausdrücklich als **methodisches Beispiel** verwendet. Maßgebliche Eigenschaften:

| Merkmal | Ausprägung |
| --- | --- |
| Plattformen | iOS, watchOS |
| Hintergrundsystem | nicht vorhanden (rein lokale Datenhaltung) |
| Personenbezogene Daten in Übertragung | keine |
| Authentifizierung / Konten | keine |
| Drittsysteme | nur Apple App Store / Apple-Plattformdienste |
| Distribution | Apple App Store + Apple Notarisation |

Diese „lokal-zuerst"-Architektur ist methodisch geeignet, weil sie eine klare, kompakte Angriffsfläche bietet und damit erlaubt, die TR-03161-Anforderungen ohne Vermischung mit umfangreichen Hintergrundsystem-Themen einzeln durchzuarbeiten. TR-03161-2 (Web-Anwendungen) und TR-03161-3 (Hintergrundsysteme) entfallen für diese Anwendung weitgehend, sind im Bericht aber als „aktivierbar bei Architekturänderung" mitgeführt.

## 3. Methodik

Die Auswertung folgt vier Grundsätzen:

1. **Markdown-zuerst.** Alle Artefakte (Plan, Speicher, Compliance-Matrix, BSI-Bericht, Regelwerk-Auszüge) liegen als versionierbare Markdown-Dateien im Git-Repository der Anwendung. Es kommt **keine proprietäre Plattform** zum Einsatz.
2. **Deterministisch-zuerst.** Der eigentliche Nachweis je Anforderung wird ausschließlich von reproduzierbaren Werkzeugen (z. B. `testssl.sh`, `MobSF`, `syft`, `osv-scanner`, `semgrep`, `gitleaks`, `cosign`) erbracht. Die Werkzeugausgabe ist der Beweis. Sie ist signierbar und identisch reproduzierbar.
3. **Generative KI nur auf dem Strukturierungspfad.** Sprachmodelle (hier: Claude Opus 4.7) werden ausschließlich zur Extraktion von Anforderungen aus dem TR-PDF, zur Zuordnung von Anforderungen zu Werkzeugen und zur Erstellung von Begleittexten eingesetzt. Sie sind **nicht im Beweispfad**. Jede LLM-Ausgabe ist mit der zugrundeliegenden deterministischen Quelle gekoppelt.
4. **Quellen-Pinning.** Alle Originaldokumente (TR-03161-1/-2/-3, DiGAV, § 139e SGB V) werden mit URL, sha256-Prüfsumme, Bytegröße und Abrufzeitpunkt in `regulations/source-manifest.yaml` festgehalten. Eine Änderung des Regelwerks erscheint als Diff in einem Pull Request.

Die im Anhang verlinkten Skripte sind in unter 700 Zeilen Python und Shell vollständig nachvollziehbar.

## 4. Klassifikationsmodell der Prüfanforderungen

Jede TR-03161-Anforderung wird in eine von vier Klassen einsortiert:

| Klasse | Definition | Konsequenz für die Zertifizierung |
| --- | --- | --- |
| **R** — Real-time | Nachweis ist im Produktivsystem fortlaufend gültig und bei jeder Änderung neu auswertbar (z. B. TLS-Posture, Header-Konfiguration, Audit-Log-Aufbewahrung) | geeignet für **kontinuierliche Zertifizierung**: die Geltung des Zertifikats ließe sich an ein Live-Signal koppeln |
| **D** — Deploy-time | Nachweis wird beim CI/CD-Build erzeugt, signiert und archiviert (z. B. SBOM, SAST-Berichte, Abhängigkeits-CVE-Scan, Signaturkette) | geeignet für **release-bezogene Zertifizierung** mit Bezug auf den exakten Build-Hash |
| **P** — Periodic | Nachweis besitzt eine definierte Gültigkeitsdauer (z. B. Penetrationstest, Restore-Drill, Schlüsselrotation) | geeignet für **fenstergültige Zertifizierung** mit automatisierter Ablaufüberwachung |
| **M** — Manual | Nachweis erfordert menschliche Bewertung (z. B. DSFA, Threat-Model-Review, Prüfstellen-Audit, klinische Evidenz) | bleibt menschlich — automatisierbar ist nur die strukturierte **Sammlung** und **Signatur**, nicht die Bewertung |

Diese Klassifikation ist anforderungsweise — sie ersetzt nicht das menschliche Urteil der Prüfstelle, sondern macht **vor** der Prüfung sichtbar, welche Nachweise bereits maschinenlesbar vorliegen können.

## 5. Quantitative Ergebnisse

Aus TR-03161-1 v3.0 wurden **127 eindeutige Prüfanforderungen (`O.*`)** in 13 Gruppen extrahiert (siehe [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md)). Jede Anforderung wurde gegen die tatsächliche Konfiguration der TwoBreath-Anwendung (Stand 2026-05-02, Quellen: `project.yml`, `Info.plist`, `*.entitlements`, `PrivacyInfo.xcprivacy`, `.github/workflows/`, `Shared/Services/*`) bewertet.

### 5.1 Status-Verteilung nach Anwendung der Bewertung

| Status | Bedeutung | Anzahl | Anteil |
| --- | --- | ---: | ---: |
| ✅ erfüllt | Beleg vorhanden oder Anforderung trivial erfüllt | 40 | 31 % |
| 🟡 teilweise | Im Wesentlichen erfüllt; formaler Beleg / Dokumentation lückenhaft | 25 | 20 % |
| ❌ fehlt | Konkreter, behebbarer Mangel | 6 | 5 % |
| ➖ nicht anwendbar | Architektur-/Funktionsstand schließt Anwendung der Anforderung aus | 56 | 44 % |
| 🔍 offen | Determinierung pendent | 0 | 0 % |
| **Gesamt** | | **127** | **100 %** |

Die hohe Quote der Klasse ➖ (44 %) ergibt sich konsistent aus der lokal-zuerst-Architektur ohne Hintergrundsystem, ohne Nutzerkonten und ohne Drittanbieter-Bibliotheken. Sämtliche Authentisierungs- und Passwort-Anforderungen (`O.Auth_*`, `O.Pass_*` — 20 Stück) sowie die Mehrzahl der Backend-bezogenen Anforderungen entfallen damit. Diese Bewertung ist im Anhang zeilenweise begründet und verbleibt überprüfbar.

### 5.2 Verteilung der Anforderungen je Prüfaspekt

| Prüfaspekt (TR-03161-1 § 4.3) | Anforderungen | Default-Klasse | Bemerkung |
| --- | ---: | --- | --- |
| (1) Anwendungszweck (`O.Purp_*`) | 9 | M | Einwilligungsfluss / Datenverarbeitungsbeschreibung |
| (2) Architektur (`O.Arch_*`) | 12 | M + D | Architektur-, Threat-Model-Dokumente |
| (3) Quellcode (`O.Source_*`) | 10 | D | SAST, Code-Review |
| (4) Drittanbieter-Software (`O.TrdP_*`) | 8 | D | SBOM + CVE-Scan |
| (5) Kryptographische Umsetzung (`O.Cryp_*` + `O.Rand_*`) | 8 | D | Krypto-Inventar gegen TR-02102 |
| (6) Authentisierung (`O.Auth_*` + `O.Pass_*`) | 20 | D | im TwoBreath-Profil durchgängig ➖ |
| (7) Datensicherheit (`O.Data_*`) | 18 | D + M | Speicher- und Verarbeitungsseite |
| (8) Kostenpflichtige Ressourcen (`O.Paid_*`) | 10 | D | App-Store-IAP-Pfad |
| (9) Netzwerkkommunikation (`O.Ntwk_*`) | 8 | R + D | TLS-Posture, ATS, Pinning |
| (10) Plattformspezifische Interaktionen (`O.Plat_*`) | 14 | D | Entitlements, Berechtigungen |
| (11) Resilienz (`O.Resi_*`) | 10 | D + P | Update-Pfad, Wiederherstellung |
| **Gesamt** | **127** | | |

### 5.3 Verteilung der Anforderungen je Nachweisklasse (R / D / P / M)

| Klasse | Anzahl | Anteil |
| --- | ---: | ---: |
| **R** Real-time | 5 | 4 % |
| **D** Deploy-time | 94 | 74 % |
| **P** Periodic | 2 | 2 % |
| **M** Manual | 26 | 20 % |

> **101 von 127 Anforderungen (~80 %) sind grundsätzlich deterministisch erbringbar (R, D oder P).** Nur 26 Anforderungen (20 %) erfordern manuelle Bewertung im engeren Sinne — überwiegend Dokumentations- und Konzeptarbeiten (Anwendungszweck, Architektur, Datenschutzkonzept).

### 5.4 Schließung der ehemaligen Lücken (Stand v0.2)

In der Fassung v0.1 wurden 6 ❌- und 25 🟡-Anforderungen ausgewiesen. Mit den Folgematerialien sind diese geschlossen:

| Werkzeug der Schließung | Schließt |
| --- | --- |
| [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) | O.Purp_1, O.Purp_2, O.Purp_4, O.Data_5, O.Data_6 |
| [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md) | O.Arch_2, O.Source_7 |
| [`concepts/03-threat-model.md`](concepts/03-threat-model.md) | O.Arch_1 (Threat-Model-Anteil) |
| [`concepts/04-secure-coding-standards.md`](concepts/04-secure-coding-standards.md) | O.Arch_1, O.Source_1, O.Source_2, O.Source_5 |
| [`concepts/05-einwilligungsverzeichnis.md`](concepts/05-einwilligungsverzeichnis.md) | O.Purp_3, O.Purp_5, O.Purp_6 |
| [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md) | O.Arch_3 (Plattform-Delegierung explizit) |
| [`concepts/07-netzwerk-sicherheitskonzept.md`](concepts/07-netzwerk-sicherheitskonzept.md) | O.Ntwk_1 (Lesart), O.Ntwk_8 |
| [`concepts/08-resilienz-haertungskonzept.md`](concepts/08-resilienz-haertungskonzept.md) | O.Arch_10, O.Resi_2 |
| [`SECURITY.md`](SECURITY.md) | O.Arch_9 |
| [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) | beantwortet die Rückfrage zu SAST/DAST und ergänzt die Pipeline |
| [`patches/PATCHES.md`](patches/PATCHES.md) § 1 | O.Resi_3 |
| § 2 | O.Plat_9, O.Data_13 |
| § 3 | O.Data_10 |
| § 4 | O.Data_11 |
| § 5 | O.Plat_1, O.Plat_13, O.Resi_1 |
| § 6 | O.Resi_5, O.Resi_7 (Stub vorbereitet) |
| § 7 | O.Data_17 |
| § 8 | O.Source_9, O.Resi_8 |
| § 9 | O.Purp_3, O.Purp_5, O.Purp_6 (Code-Seite) |
| § 10 | O.Source_3 |

### 5.5 Verbleibende offene Punkte

Zwei `🟡`-Reihen verbleiben — nicht als Mangel, sondern als bewusst aufgeschobene Aktivierung:

| ID | Status | Begründung |
| --- | --- | --- |
| [O.Resi_5](COMPLIANCE_MATRIX_TR1_OFFICIAL.md#oresi_-9) | 🟡 | App-Attest-Stub vorbereitet; mangels Hintergrundsystem ohne Verifizierer. Aktivierung mit Backend-Anbindung. |
| [O.Resi_7](COMPLIANCE_MATRIX_TR1_OFFICIAL.md#oresi_-13) | 🟡 | wie O.Resi_5 — Härtungs-Integritätsprüfung fußt auf App Attest. |

Aus Hersteller-Sicht entspricht der Bearbeitungsumfang dieser Schließung **wenigen Personentagen** — nicht Monaten. Das ist die Pointe für den BSI-Dialog: das hier dokumentierte Material ist die Form, in der ein Hersteller einen TR-03161-Audit erfolgreich vorbereiten kann; die Größe der Aufgabe wird durch das Verfahren, nicht durch die Anforderungen, bestimmt.

### 5.5 Implikation

Die zentrale These des Berichts findet sich quantitativ bestätigt: **74 % aller 127 Anforderungen sind deploy-time-erbringbar, weitere 4 % real-time, 2 % periodisch.** Die heutige Praxis behandelt all diese Anforderungen weiterhin überwiegend wie manuelle Nachweise. Das ist die zu hebende Diskrepanz.

Die zeilenweise Klassifikation ist in [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) dokumentiert und durch [`evidence/tr1-twobreath-status.yaml`](evidence/tr1-twobreath-status.yaml) reproduzierbar; jede Zeile verlinkt zurück auf die offizielle TR-Anforderung in der eingelesenen Markdown-Fassung.

## 6. Qualitative Befunde

### 6.1 Plattform-Voraussetzungen sind starke implizite Erfüller

Eine erhebliche Zahl der TR-03161-1-Anforderungen wird durch korrekt konfigurierte Apple-Plattformeigenschaften (App-Sandbox, Data-Protection-Klassen, App Transport Security, Notarisation, App-Store-Distribution) implizit erfüllt. Diese implizite Erfüllung ist heute weder maschinenlesbar belegt noch im Verfahren als solche anerkannt. Eine **Sammlung von Plattform-Aussagen** (z. B. eine vom BSI gepflegte Liste, welche `O.*`-Anforderungen durch welche dokumentierte Apple- bzw. Android-Plattformfunktion abgedeckt werden) würde Hersteller und Prüfstellen erheblich entlasten.

### 6.2 Doppelte Verschriftlichung gleicher Sachverhalte

In Kapitel 3 und in Kapitel 4 von TR-03161-1 wird jede Anforderung zweifach beschrieben: einmal normativ, einmal als Tabellenzeile mit Prüftiefe. Beide Versionen haben in der Auswertung identifiziert werden können, weil der Anker-Generator die zweite Vorkommnis mit `-2`-Suffix versieht. Auf der Hersteller- wie auf der Prüfstellen-Seite führt die doppelte Form aktuell zu Redundanz in den Lieferungen. Eine **maschinenlesbare Single-Source-Fassung** (siehe § 8) würde dies bereinigen.

### 6.3 Fehlende Standardisierung der Nachweisverpackung

Heute liefert jede Prüfstelle einen Prüfbericht in eigener Form. Eine **standardisierte Einreichungsverpackung** (SARIF + CycloneDX + JUnit + cosign-Signaturen + PROV-O-Manifest) würde die Auditeur:innen-Arbeit von einem Lese- in einen Diff-Vorgang verwandeln und für Re-Zertifizierungen quantifizierbare Aussagen über Veränderungen seit der letzten Vorlage erlauben.

### 6.4 Fehlende Kopplung an CVE- und TR-Versionsstand

Ein BSI-Zertifikat ist heute in seiner Geltung an einen Stichtag gebunden, nicht an einen technischen Zustand. Wird zwischen zwei Re-Zertifizierungen ein kritisches CVE in einer eingesetzten Bibliothek bekannt, oder erfährt TR-03161 selbst eine Revision, ändert sich der formale Zertifikatsstatus zunächst nicht. Ein **kontinuierliches, signiertes Posture-Signal** (mindestens für Klasse R) würde diese Lücke schließen, ohne das Zertifizierungsmodell selbst aufzugeben.

## 7. Hebel zur Verfahrensbeschleunigung

Aus den Befunden ergeben sich vier konkrete, einzeln einführbare Hebel:

| # | Hebel | Wirkung | Schwierigkeit |
| --- | --- | --- | --- |
| H1 | **Standardisiertes Einreichungsformat** für Nachweispakete (CycloneDX + SARIF + JUnit + cosign + PROV-O), abgestimmt mit BSI und Prüfstellen | reduziert Audit-Lesezeit; ermöglicht Re-Zertifizierungs-Diff | mittel |
| H2 | **Maschinenlesbare Fassung von TR-03161** (z. B. JSON/YAML mit `O.*`-IDs als Schlüssel, Prüftiefe, Verweisstruktur) — neben der weiterhin gültigen PDF | beendet doppelte Verschriftlichung; ermöglicht Versionsdiff | klein–mittel |
| H3 | **Plattform-Aussagen-Katalog** (welche `O.*` werden durch welche iOS/Android-Plattformfunktion implizit erfüllt) | reduziert Prüfaufwand bei Standard-Konfigurationen | klein |
| H4 | **Reaktive Re-Zertifizierungs-Triggern** auf Basis CVE- und TR-Revisions-Diffs, statt rein zeitbasiert | Sicherheit pro Geld-Einheit erhöht; Hersteller-Aufwand pro Jahr sinkt | groß (Verfahrensänderung) |

## 8. Empfehlungen an das BSI

Auf Grundlage der Befunde werden dem Referat DI 24 folgende Empfehlungen zur Diskussion gestellt:

**E1 — Maschinenlesbarer Anhang zur nächsten TR-03161-Revision.**
Veröffentlichung einer JSON- oder YAML-Fassung, welche je `O.*`-ID die Prüftiefe, das Datum der Einführung, die Vorgängerversion und einen Verweis auf den normativen Abschnitt enthält. Das BSI behält die PDF als verbindliche Fassung; die maschinenlesbare Fassung dient als technischer Spiegel für Hersteller-Toolchains.

**E2 — Konsultationsentwurf zum Einreichungsformat.**
Veröffentlichung eines Entwurfs „Nachweispaket TR-03161" auf Basis offener Standards (CycloneDX 1.5+, SARIF 2.1+, JUnit, cosign, PROV-O), mit einem 60-Tage-Konsultationsfenster für Hersteller und akkreditierte Prüfstellen.

**E3 — Plattform-Aussagen-Katalog.**
Erarbeitung eines BSI-publizierten Katalogs, welcher die Erfüllung einzelner `O.*`-Anforderungen durch dokumentierte Apple-iOS- und Google-Android-Plattformfunktionen ausweist (mit Versions-Bezug zu iOS/Android-Major-Versionen). Dies senkt den Prüfaufwand bei Standard-Konfigurationen ohne den Schutzbedarf zu reduzieren.

**E4 — Pilot-Prüfstelle für strukturierte Einreichungen.**
Auswahl einer Prüfstelle, die — auf freiwilliger Basis — strukturierte Nachweispakete entgegennimmt und die Mehrarbeit gegenüber dem klassischen PDF-Pfad quantifiziert. Bei positivem Ergebnis Anerkennung des strukturierten Pfads als gleichwertige Einreichungsform.

**E5 — Reaktiver Re-Zertifizierungs-Trigger.**
Mittelfristige Diskussion eines Verfahrensmodells, in dem die zwei-jährige Geltungsdauer eines Zertifikats durch CVE- oder TR-Revisions-Trigger früher ablaufen kann, ergänzt durch ein verkürztes Bestätigungsverfahren bei nachweisbar unbetroffenen Anwendungen.

## 9. Risiken und offene Fragen

| # | Risiko / Frage | Adressat |
| --- | --- | --- |
| 1 | Akzeptanz strukturierter Einreichungen durch akkreditierte Prüfstellen | BSI + DAkkS |
| 2 | Souveränitätsanforderungen an die Verarbeitung beim Einreichungsportal | BSI / BMI |
| 3 | Verhältnis zur GDPR-Art.-42-Zertifizierung beim BfArM (vermeidet doppelte Pflichten?) | BfArM ↔ BSI |
| 4 | Übergangsregelung: dürfen Hersteller, die bereits in einem Zyklus stehen, das strukturierte Format nutzen? | BSI |
| 5 | Vertraulichkeit der Nachweispakete: welche Felder sind aggregierbar / öffentlich? | BSI + Datenschutz |

## 10. Anlagen und Referenzen

### Anlagen (im Repository)

- [`PLANNING.md`](PLANNING.md) — Planungsdokument mit Eignungsanalyse und Phasenmodell.
- [`BSI_TOOL_EMPFEHLUNGEN.md`](BSI_TOOL_EMPFEHLUNGEN.md) — **werkzeug-spezifische Empfehlung pro Anforderung × Lebenszyklus-Phase**, einschließlich konkretem Vorschlag für ein standardisiertes Einreichungsformat „Nachweispaket TR-03161" (Empfehlung E2-Konkretisierung).
- [`DIGA_ROADMAP.md`](DIGA_ROADMAP.md) — Repositionierungs-Roadmap (Indikation, MDR, Studie) + Partner-Ökosystem.
- [`COMPLIANCE_MATRIX.md`](COMPLIANCE_MATRIX.md) — Arbeitsmatrix in CRY/AUT/STO-Gruppierung.
- [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) — vollständige 127-Zeilen-Matrix entlang der offiziellen `O.*`-IDs.
- [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) — Inventarisierung der CI-Pipeline + drop-in `security.yml`-Erweiterung.
- [`concepts/`](concepts/) — acht Konzeptdokumente (Datenschutz, Datenlebenszyklus, Threat-Model, Secure-Coding, Einwilligungsverzeichnis, Kryptographie, Netzwerk, Resilienz/Härtung).
- [`patches/PATCHES.md`](patches/PATCHES.md) — zehn PR-fertige Swift-Snippets.
- [`SECURITY.md`](SECURITY.md) — Vulnerability Disclosure.
- [`MEMORY.md`](MEMORY.md) — Lauf-Protokoll mit sha256-Pinning, Werkzeugversionen und Modell-Snapshots.
- [`regulations/markdown/BSI-TR-03161-1.md`](regulations/markdown/BSI-TR-03161-1.md) — eingelesene TR-03161-1 v3.0 mit Anker je `O.*`-Anforderung.
- [`regulations/markdown/BSI-TR-03161-2.md`](regulations/markdown/BSI-TR-03161-2.md), [`-3.md`](regulations/markdown/BSI-TR-03161-3.md) — Web- und Hintergrundsystem-Teile.
- [`regulations/markdown/DiGAV.md`](regulations/markdown/DiGAV.md) — DiGAV vollständig (51 §§).
- [`regulations/markdown/SGB-V-139e.md`](regulations/markdown/SGB-V-139e.md) — § 139e SGB V.
- [`regulations/source-manifest.yaml`](regulations/source-manifest.yaml) — Quellen-Pinning mit sha256.

### Externe Referenzen

- BSI TR-03161 Übersicht: <https://www.bsi.bund.de/dok/TR-03161>
- TR-03161-1 (Mobile, v3.0, 25.03.2024): <https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR03161/BSI-TR-03161-1.pdf?__blob=publicationFile>
- BSI TR-02102 (Kryptographische Verfahren): <https://www.bsi.bund.de/dok/TR-02102>
- § 139e SGB V: <https://www.gesetze-im-internet.de/sgb_5/__139e.html>
- DiGAV: <https://www.gesetze-im-internet.de/digav/>
- DiGA-Verzeichnis (BfArM): <https://diga.bfarm.de/de>

### Verwendete Werkzeuge (Stand 2026-05-02)

`pdftotext` (poppler) 26.04.0 · `python3` 3.13.13 · `bs4` 4.13.4 · `pandoc` 3.9.0.2 · Sprachmodell: `claude-opus-4-7` (nur strukturierend, nicht beweisführend).

---

*Dieser Bericht versteht sich als Arbeitsstand. Rückmeldungen aus dem BSI-Referat DI 24 werden in eine v0.2 eingearbeitet.*
