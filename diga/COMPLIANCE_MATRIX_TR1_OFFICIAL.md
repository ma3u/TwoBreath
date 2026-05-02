# TwoBreath × DiGA — TR-03161-1 official-IDs compliance matrix

> Auto-generated from `regulations/markdown/BSI-TR-03161-1.md` + `evidence/tr1-twobreath-status.yaml` by `scripts/build-official-matrix.py`.
> Total unique requirement IDs: **127** across **13** groups (mapping the 11 official Prüfaspekte). Per-row determinations: **127/127**.
> Re-run via `make official-matrix` to refresh after a TR update or after editing overrides.

## Resolved status across all 127 requirements

| Status | Bedeutung | Anzahl | Anteil |
| --- | --- | ---: | ---: |
| ✅ | met | 40 | 31 % |
| 🟡 | partial | 25 | 20 % |
| ❌ | missing | 6 | 5 % |
| ➖ | n/a | 56 | 44 % |
| 🔍 | tbd | 0 | 0 % |
| **Gesamt** | | **127** | **100 %** |

**Nachweisklasse-Verteilung (Default je Anforderung):**

| Klasse | Anzahl |
| --- | ---: |
| R | 5 |
| D | 94 |
| P | 2 |
| M | 26 |


## Legend

- **Class:** R real-time · D deploy-time · P periodic · M manual (see `PLANNING.md` § 7).
- **Status:** ✅ met · 🟡 partial · ❌ missing · ➖ not applicable today (with trigger) · 🔍 to be determined.
- **Prüftiefe:** as printed in TR-03161-1 v3.0 § 4.3 (CHECK / EXAMINE).

## Coverage at a glance

| Group | Official Prüfaspekt | Reqs |
| --- | --- | ---: |
| `O.Purp_*` — Anwendungszweck | [(1) Anwendungszweck](regulations/markdown/BSI-TR-03161-1.md#431-testcharakteristik-zu-prüfaspekt-1-anwendungszweck) | 9 |
| `O.Arch_*` — Architektur | [(2) Architektur](regulations/markdown/BSI-TR-03161-1.md#432-testcharakteristik-zu-prüfaspekt-2-architektur) | 12 |
| `O.Source_*` — Quellcode | [(3) Quellcode](regulations/markdown/BSI-TR-03161-1.md#433-testcharakteristik-zu-prüfaspekt-3-quellcode) | 10 |
| `O.TrdP_*` — Drittanbieter-Software | [(4) Drittanbieter-Software](regulations/markdown/BSI-TR-03161-1.md#434-testcharakteristik-zu-prüfaspekt-4-drittanbieter-software) | 8 |
| `O.Cryp_*` — Kryptographische Umsetzung | [(5) Kryptographische Umsetzung](regulations/markdown/BSI-TR-03161-1.md#435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung) | 7 |
| `O.Rand_*` — Zufallswerte (Krypto) | [(5) Kryptographische Umsetzung](regulations/markdown/BSI-TR-03161-1.md#435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung) | 1 |
| `O.Auth_*` — Authentisierung | [(6) Authentisierung und Authentifizierung](regulations/markdown/BSI-TR-03161-1.md#436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung) | 15 |
| `O.Pass_*` — Passwörter | [(6) Authentisierung und Authentifizierung](regulations/markdown/BSI-TR-03161-1.md#436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung) | 5 |
| `O.Data_*` — Datensicherheit | [(7) Datensicherheit](regulations/markdown/BSI-TR-03161-1.md#437-testcharakteristik-zu-prüfaspekt-7-datensicherheit) | 18 |
| `O.Paid_*` — Kostenpflichtige Ressourcen | [(8) Kostenpflichtige Ressourcen](regulations/markdown/BSI-TR-03161-1.md#438-testcharakteristik-zu-prüfaspekt-8-kostenpflichtige-ressourcen) | 10 |
| `O.Ntwk_*` — Netzwerkkommunikation | [(9) Netzwerkkommunikation](regulations/markdown/BSI-TR-03161-1.md#439-testcharakteristik-zu-prüfaspekt-9-netzwerkkommunikation) | 8 |
| `O.Plat_*` — Plattformspezifische Interaktionen | [(10) Plattformspezifische Interaktionen](regulations/markdown/BSI-TR-03161-1.md#4310-testcharakteristik-zu-prüfaspekt-10-plattformspezifische-interaktionen) | 14 |
| `O.Resi_*` — Resilienz | [(11) Resilienz](regulations/markdown/BSI-TR-03161-1.md#4311-testcharakteristik-zu-prüfaspekt-11-resilienz) | 10 |
| **Total** | | **127** |

---

## `O.Purp_*` — Anwendungszweck

**Official Prüfaspekt:** [(1) Anwendungszweck](regulations/markdown/BSI-TR-03161-1.md#431-testcharakteristik-zu-prüfaspekt-1-anwendungszweck)
**Default class:** M  ·  **Default tool:** Manual review of consent flow + privacy text

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Purp_1](regulations/markdown/BSI-TR-03161-1.md#o-purp-1) | Informationspflicht des Herstellers | CHECK | M | 🟡 | App-Store-Beschreibung deklariert Zweck (Atemübung); Info.plist usage strings deklarieren Datenzwecke. Formelle Erstinformation beim ersten Start zu auditieren. |
| [O.Purp_2](regulations/markdown/BSI-TR-03161-1.md#o-purp-2) | Zweckgebundene Erhebung und | CHECK | M | ✅ | PrivacyInfo.xcprivacy: Health + Fitness ausschließlich für AppFunctionality, kein Tracking. HealthKit-Berechtigungen entsprechen den deklarierten Zwecken. |
| [O.Purp_3](regulations/markdown/BSI-TR-03161-1.md#o-purp-3) | Einholung einer | CHECK | M | 🟡 | iOS-vermittelte Berechtigungsdialoge für HealthKit, LocalNetwork, NearbyInteraction. Eigene App-Einwilligungs-UI zusätzlich zum Plattform-Standard zu dokumentieren. |
| [O.Purp_4](regulations/markdown/BSI-TR-03161-1.md#o-purp-4) | Nutzung ausschließlich | CHECK | D | ✅ | Apple-HealthKit-API erzwingt Autorisierungsprüfung; bei Verweigerung kein Datenzugriff. Verifikation per Code-Review von HealthKitService.swift. |
| [O.Purp_5](regulations/markdown/BSI-TR-03161-1.md#o-purp-5) | Entzug der Einwilligung | CHECK | M | 🟡 | Plattform-Mechanismus (iOS Einstellungen) ermöglicht Widerruf. App-eigene UI mit Hinweis auf Konsequenzen empfohlen — heute partiell. |
| [O.Purp_6](regulations/markdown/BSI-TR-03161-1.md#o-purp-6) | Führen eines Verzeichnisses der | CHECK | M | ❌ | Hersteller-Verzeichnis der Nutzereinwilligungen fehlt; iOS speichert Berechtigungsstatus, ist aber nicht als Hersteller-Verzeichnis abrufbar. Lücke. |
| [O.Purp_7](regulations/markdown/BSI-TR-03161-1.md#o-purp-7) | Nutzung nur erforderlicher | CHECK | D | ✅ | Anwendung nutzt ausschließlich Apple-Frameworks (SwiftUI, SwiftData, HealthKit, MultipeerConnectivity, NearbyInteraction, AVFoundation, WatchConnectivity). Keine Drittanbieter-Bibliotheken — Anforderung trivial erfüllt. |
| [O.Purp_8](regulations/markdown/BSI-TR-03161-1.md#o-purp-8) | Weitergabe von sensiblen Daten nur | CHECK | M | ✅ | Daten werden ausschließlich lokal verarbeitet (SwiftData) oder mit dem Partner-Gerät über MPC nach expliziter Bestätigung geteilt. Keine Drittanbieter-Schnittstellen. |
| [O.Purp_9](regulations/markdown/BSI-TR-03161-1.md#o-purp-9) | Nur zweckgebundene Darstellung | CHECK | M | ✅ | Anzeige beschränkt auf Atemphasen und Achtsamkeitsminuten. Keine sensiblen Datenelemente auf dem Bildschirm außerhalb des primären Zwecks. |

## `O.Arch_*` — Architektur

**Official Prüfaspekt:** [(2) Architektur](regulations/markdown/BSI-TR-03161-1.md#432-testcharakteristik-zu-prüfaspekt-2-architektur)
**Default class:** M  ·  **Default tool:** Architecture doc + threat-model review (`threagile`)

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Arch_1](regulations/markdown/BSI-TR-03161-1.md#o-arch-1) | „Security“ ist Bestandteil des | CHECK | M + D | 🟡 | DevSecOps-Pipeline existiert (security.yml, ci.yml: gitleaks, swiftlint --strict, eslint, npm audit, Tests, Playwright). Formale 'Security-in-SDLC'-Dokumentation des Herstellers (Threat-Model, Secure-Coding-Standards) ergänzungsbedürftig. |
| [O.Arch_2](regulations/markdown/BSI-TR-03161-1.md#o-arch-2) | Berücksichtigung der Verarbeitung | CHECK | M | ❌ | Datenlebenszyklus für HealthKit-Reads (HR/HRV/Schlaf) und Writes (Mindful-Minutes) sowie für SwiftData SessionLog ist im Code nachvollziehbar, aber nicht formal als Designdokument aufgesetzt. Lücke. |
| [O.Arch_3](regulations/markdown/BSI-TR-03161-1.md#o-arch-3) | Dokumentation des Lebenszyklus | CHECK | M | ➖ | Anwendung hält keine eigenen kryptographischen Schlüssel. MultipeerConnectivity-Sitzungsschlüssel werden plattformseitig verwaltet. Schlüsselrichtlinie nicht anwendbar — Plattform-Aussage zu dokumentieren. |
| [O.Arch_4](regulations/markdown/BSI-TR-03161-1.md#o-arch-4) | Keine unverschlüsselten sensiblen | EXAMINE | D | ✅ | iOS-Backups sind plattformseitig verschlüsselt (iCloud + iTunes-Backup). SwiftData-Datei liegt unter Data-Protection Class A. Anforderung durch Plattform abgedeckt. |
| [O.Arch_5](regulations/markdown/BSI-TR-03161-1.md#o-arch-5) | Verteilte Implementierung von | EXAMINE | D | ✅ | Externe Schnittstellen: (a) MPC mit `encryptionPreference: .required`, (b) WatchConnectivity (Apple-vermittelt), (c) NearbyInteraction (Apple-vermittelt). Alle tragen plattformseitige Sicherheitsfunktionen. |
| [O.Arch_6](regulations/markdown/BSI-TR-03161-1.md#o-arch-6) | Authentizitäts- und Integritätsschutz | EXAMINE | D | ✅ | Apple Code-Signing + Notarisation auf jedem Release. CURRENT_PROJECT_VERSION + MARKETING_VERSION versioniert in project.yml. |
| [O.Arch_7](regulations/markdown/BSI-TR-03161-1.md#o-arch-7) | Sichere Nutzung der Funktionen von | EXAMINE | D | ✅ | Keine Drittanbieter-Software in Verwendung (CLAUDE.md: 'No SPM packages, no CocoaPods, no Carthage'). |
| [O.Arch_8](regulations/markdown/BSI-TR-03161-1.md#o-arch-8) | Zweckgebundener Zugriff auf | EXAMINE | D | ➖ | Keine WebView in der Anwendung. Marketing-Website ist im separaten Repo `ma3u/TwoBreath`. |
| [O.Arch_9](regulations/markdown/BSI-TR-03161-1.md#o-arch-9) | Barrierearme Möglichkeit zum | CHECK | M | ❌ | Vulnerability-Disclosure-Pfad fehlt. Empfehlung: `SECURITY.md` mit verschlüsseltem Kontakt (PGP-Key) im Repo ergänzen. |
| [O.Arch_10](regulations/markdown/BSI-TR-03161-1.md#o-arch-10) | Anwendung fragt Zwangsupdates | EXAMINE | R | 🟡 | App Store ist die Update-Quelle; iOS-System prompt'et zum Update. App-eigene 'sicherheitsrelevant'-Unterscheidung gibt es nicht. Zu auditieren, ob TR-Anforderung durch Apple-Modell hinreichend abgedeckt. |
| [O.Arch_11](regulations/markdown/BSI-TR-03161-1.md#o-arch-11) | Bereitstellung von Updates über | CHECK | D | ✅ | Distribution ausschließlich über Apple App Store. |
| [O.Arch_12](regulations/markdown/BSI-TR-03161-1.md#o-arch-12) | Nutzung kryptographischer | CHECK | M | ✅ | twobreath.com verlinkt App-Store-Eintrag; QR-Codes auf Marketing-Material. |

## `O.Source_*` — Quellcode

**Official Prüfaspekt:** [(3) Quellcode](regulations/markdown/BSI-TR-03161-1.md#433-testcharakteristik-zu-prüfaspekt-3-quellcode)
**Default class:** D  ·  **Default tool:** `semgrep` + `swiftlint` SAST

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Source_1](regulations/markdown/BSI-TR-03161-1.md#o-source-1) | Prüfung von Eingaben vor | CHECK | D | 🟡 | Nutzer-Eingaben minimal (Slider, Buttons, Pairing-Code). Externe Daten (programs.json, MPC-Nachrichten) via Codable validiert. SAST (semgrep) sollte ergänzt werden, um Validierungslücken systemisch zu erkennen. |
| [O.Source_2](regulations/markdown/BSI-TR-03161-1.md#o-source-2) | Nutzung einer Escape-Syntax bei | CHECK | D | 🟡 | Eingabe-/Ausgabe-Schnittstellen typisiert (Codable, HealthKit, MPC). Klassische Injection-Vektoren (SQL/HTML) liegen nicht vor. |
| [O.Source_3](regulations/markdown/BSI-TR-03161-1.md#o-source-3) | Keine sensiblen Daten in Meldungen. | CHECK | D | 🟡 | Log-Aufrufe (`print`, `os_log`) per Code-Review auf PII-Lecks zu prüfen. Empfehlung: presidio-Regex-Set über Log-Stichprobe in CI. |
| [O.Source_4](regulations/markdown/BSI-TR-03161-1.md#o-source-4) | Kontrollierte Behandlung und | EXAMINE | D | ✅ | Swift-Fehlerbehandlung via `throws/try/catch`; keine debugbaren Stack-Traces in Release-Builds (Apple-Standard). |
| [O.Source_5](regulations/markdown/BSI-TR-03161-1.md#o-source-5) | Abbruch des Zugriffs auf sensible | EXAMINE | D | 🟡 | Swift ARC + value semantics; keine eigenen sensiblen Speicherpuffer (delegiert an Apple-Frameworks). Anforderung implizit über Plattform abgedeckt. |
| [O.Source_6](regulations/markdown/BSI-TR-03161-1.md#o-source-6) | Nutzung von sicheren | EXAMINE | D | ➖ | Swift mit ARC; keine manuelle Speicherverwaltung. Anforderung nicht anwendbar. |
| [O.Source_7](regulations/markdown/BSI-TR-03161-1.md#o-source-7) | Sicheres Löschen von sensiblen | EXAMINE | D + M | 🟡 | SessionLog persistiert dauerhaft (für Streaks/Insights). Datenminimierung durch Aufzeichnung minimaler Felder. Auto-Löschung nach Zeit nicht implementiert — Datenschutzkonzept ergänzen. |
| [O.Source_8](regulations/markdown/BSI-TR-03161-1.md#o-source-8) | Vollständige Entfernung von | EXAMINE | D | ✅ | Release-Konfiguration in project.yml (`defaultConfig: Release`). Keine Debug-URLs / Test-Endpoints im Quellcode (per Code-Review + gitleaks). |
| [O.Source_9](regulations/markdown/BSI-TR-03161-1.md#o-source-9) | Aktivierung von modernen | CHECK | D | 🟡 | Apple-Toolchain aktiviert standardmäßig Stack-Canary, ASLR, NX. Obfuskation (Symbol-Stripping etc.) nicht aktiv — Wechselwirkung mit O.Resi_8. |
| [O.Source_10](regulations/markdown/BSI-TR-03161-1.md#o-source-10) | Verwendung von Werkzeugen zur | CHECK | D | ✅ | SwiftLint --strict + opt-in rules in `.swiftlint.yml`; in CI per security.yml. ESLint für Playwright-Skripte. Empfehlung: zusätzlich semgrep mit Swift-Regeln. |

## `O.TrdP_*` — Drittanbieter-Software

**Official Prüfaspekt:** [(4) Drittanbieter-Software](regulations/markdown/BSI-TR-03161-1.md#434-testcharakteristik-zu-prüfaspekt-4-drittanbieter-software)
**Default class:** D  ·  **Default tool:** `syft` SBOM + `osv-scanner` CVE

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.TrdP_1](regulations/markdown/BSI-TR-03161-1.md#o-trdp-1) | Abhängigkeiten durch Drittanbieter- | CHECK | D | ✅ | Liste der Drittanbieter-Software ist leer (per CLAUDE.md: 'Apple frameworks only'). Erfüllung trivial; SBOM-Erzeugung empfohlen, um Leerheit signiert zu belegen. |
| [O.TrdP_2](regulations/markdown/BSI-TR-03161-1.md#o-trdp-2) | Verwendung der aktuellen Version | CHECK | D | ✅ | Nicht anwendbar — keine Drittanbieter-Software. |
| [O.TrdP_3](regulations/markdown/BSI-TR-03161-1.md#o-trdp-3) | Herstellerprüfung Drittanbieter- | CHECK | P | ✅ | Nicht anwendbar — keine Drittanbieter-Software. `npm audit` wirkt nur auf Build-/Website-Toolchain. |
| [O.TrdP_4](regulations/markdown/BSI-TR-03161-1.md#o-trdp-4) | Sicherheitskonzept für zeitnahes | CHECK | D + P | ✅ | Nicht anwendbar. |
| [O.TrdP_5](regulations/markdown/BSI-TR-03161-1.md#o-trdp-5) | Prüfung auf Vertrauenswürdigkeit | CHECK | M | ✅ | Nicht anwendbar. |
| [O.TrdP_6](regulations/markdown/BSI-TR-03161-1.md#o-trdp-6) | Keine Weitergabe von sensiblen | EXAMINE | D | ✅ | Trivial erfüllt — keine Drittanbieter-Software vorhanden. |
| [O.TrdP_7](regulations/markdown/BSI-TR-03161-1.md#o-trdp-7) | Validierung eingehender Daten über | CHECK | D | ✅ | Nicht anwendbar. |
| [O.TrdP_8](regulations/markdown/BSI-TR-03161-1.md#o-trdp-8) | Prüfung der Wartung von | CHECK | P | ✅ | Nicht anwendbar. |

## `O.Cryp_*` — Kryptographische Umsetzung

**Official Prüfaspekt:** [(5) Kryptographische Umsetzung](regulations/markdown/BSI-TR-03161-1.md#435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung)
**Default class:** D  ·  **Default tool:** Crypto-inventory YAML reconciled vs build scan

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Cryp_1](regulations/markdown/BSI-TR-03161-1.md#o-cryp-1) | Keine fest einprogrammierten | EXAMINE | D | ✅ | Keine Hard-Coded-Schlüssel im Quellcode. `.gitleaks.toml` mit Custom-Regeln für ElevenLabs- und Apple-API-Keys; gitleaks läuft in CI (security.yml). |
| [O.Cryp_2](regulations/markdown/BSI-TR-03161-1.md#o-cryp-2) | Nur bewährte Implementierungen | EXAMINE | D | ➖ | Anwendung implementiert keine eigenen Krypto-Primitiven. MultipeerConnectivity nutzt Apple-vetted Implementierungen (CommonCrypto / CryptoKit intern). |
| [O.Cryp_3](regulations/markdown/BSI-TR-03161-1.md#o-cryp-3) | Passende Wahl der | EXAMINE | D | ➖ | Plattform-vermittelt; keine eigene Wahl von Primitiven. |
| [O.Cryp_4](regulations/markdown/BSI-TR-03161-1.md#o-cryp-4) | Zweckbindung kryptographischer | EXAMINE | M | ➖ | Keine eigenen Schlüssel; Anforderung nicht anwendbar. |
| [O.Cryp_5](regulations/markdown/BSI-TR-03161-1.md#o-cryp-5) | Nutzung von starken | EXAMINE | D | ➖ | Plattform-vermittelt. |
| [O.Cryp_6](regulations/markdown/BSI-TR-03161-1.md#o-cryp-6) | Manipulationsschutz | EXAMINE | D | ➖ | Plattform-vermittelt (Secure Enclave bei Bedarf). |
| [O.Cryp_7](regulations/markdown/BSI-TR-03161-1.md#o-cryp-7) | Manipulationsschutz | EXAMINE | D | ➖ | Plattform-vermittelt. |

## `O.Rand_*` — Zufallswerte (Krypto)

**Official Prüfaspekt:** [(5) Kryptographische Umsetzung](regulations/markdown/BSI-TR-03161-1.md#435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung)
**Default class:** D  ·  **Default tool:** `semgrep` ban on `arc4random`; assert `SecRandomCopyBytes`

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Rand_1](regulations/markdown/BSI-TR-03161-1.md#o-rand-1) | Erzeugung von Zufallswerten durch | EXAMINE | D | ➖ | Keine eigene Erzeugung kryptographischer Zufallswerte im App-Code. Plattform delegiert. |

## `O.Auth_*` — Authentisierung

**Official Prüfaspekt:** [(6) Authentisierung und Authentifizierung](regulations/markdown/BSI-TR-03161-1.md#436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung)
**Default class:** D  ·  **Default tool:** XCUITest auth flow + token-claim assertion

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Auth_1](regulations/markdown/BSI-TR-03161-1.md#o-auth-1) | Herstellerkonzept zur | CHECK | M | ➖ | Keine Nutzer-Authentifizierung in der Anwendung. Partner-Pairing erfolgt geräte-zu-gerät über MPC mit manueller Bestätigungs-Code (PairingService.swift). |
| [O.Auth_2](regulations/markdown/BSI-TR-03161-1.md#o-auth-2) | Getrennte Realisierung von | EXAMINE | D | ➖ | Nicht anwendbar — kein Konten-/Rollenmodell. |
| [O.Auth_3](regulations/markdown/BSI-TR-03161-1.md#o-auth-3) | Zwei-Faktor-Authentisierung. | EXAMINE | D | ➖ | Nicht anwendbar. |
| [O.Auth_4](regulations/markdown/BSI-TR-03161-1.md#o-auth-4) | Authentisierung über zusätzliche | EXAMINE | M | ➖ | Nicht anwendbar — keine Authentifizierung. |
| [O.Auth_5](regulations/markdown/BSI-TR-03161-1.md#o-auth-5) | Zusätzliche Informationen bei | EXAMINE | D | ➖ | Nicht anwendbar. |
| [O.Auth_6](regulations/markdown/BSI-TR-03161-1.md#o-auth-6) | Information des Benutzers über | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Auth_7](regulations/markdown/BSI-TR-03161-1.md#o-auth-7) | Verhinderung des Ausprobierens von | CHECK | R + D | ➖ | Nicht anwendbar. |
| [O.Auth_8](regulations/markdown/BSI-TR-03161-1.md#o-auth-8) | Erneute Authentifizierung bei | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Auth_9](regulations/markdown/BSI-TR-03161-1.md#o-auth-9) | Erneute Authentifizierung nach | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Auth_10](regulations/markdown/BSI-TR-03161-1.md#o-auth-10) | Erneute Authentifizierung nach | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Auth_11](regulations/markdown/BSI-TR-03161-1.md#o-auth-11) | Ausreichende Authentifizierung des | EXAMINE | D | ➖ | Nicht anwendbar. |
| [O.Auth_12](regulations/markdown/BSI-TR-03161-1.md#o-auth-12) | Authentifizierung an der | CHECK | D | ➖ | Nicht anwendbar — kein Hintergrundsystem. |
| [O.Auth_13](regulations/markdown/BSI-TR-03161-1.md#o-auth-13) | Schutz von Authentisierungsdaten. | CHECK | D | ➖ | Nicht anwendbar — keine Tokens. |
| [O.Auth_14](regulations/markdown/BSI-TR-03161-1.md#o-auth-14) | Invalidierung von | CHECK | D | ➖ | Nicht anwendbar — keine Sessions. |
| [O.Auth_15](regulations/markdown/BSI-TR-03161-1.md#o-auth-15) | Benachrichtigung des | CHECK | D | ➖ | Nicht anwendbar. |

## `O.Pass_*` — Passwörter

**Official Prüfaspekt:** [(6) Authentisierung und Authentifizierung](regulations/markdown/BSI-TR-03161-1.md#436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung)
**Default class:** D  ·  **Default tool:** XCUITest password policy assertion

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Pass_1](regulations/markdown/BSI-TR-03161-1.md#o-pass-1) | Durchsetzung starker | CHECK | D | ➖ | Nicht anwendbar — keine Passwörter. |
| [O.Pass_2](regulations/markdown/BSI-TR-03161-1.md#o-pass-2) | Anzeige der Stärke des verwendeten | EXAMINE | D | ➖ | Nicht anwendbar. |
| [O.Pass_3](regulations/markdown/BSI-TR-03161-1.md#o-pass-3) | Möglichkeit zur Änderung des | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Pass_4](regulations/markdown/BSI-TR-03161-1.md#o-pass-4) | Protokollierung und Information | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Pass_5](regulations/markdown/BSI-TR-03161-1.md#o-pass-5) | Verwendung von kryptographisch | EXAMINE | D | ➖ | Nicht anwendbar. |

## `O.Data_*` — Datensicherheit

**Official Prüfaspekt:** [(7) Datensicherheit](regulations/markdown/BSI-TR-03161-1.md#437-testcharakteristik-zu-prüfaspekt-7-datensicherheit)
**Default class:** D + M  ·  **Default tool:** MobSF static + dynamic; `gitleaks`

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Data_1](regulations/markdown/BSI-TR-03161-1.md#o-data-1) | Maximale Sicherheit bei | CHECK | D | ✅ | Werkseinstellung: kein Tracking, alle Daten lokal, alle sensiblen Berechtigungen vom Nutzer per iOS-Prompt explizit zu erteilen. PrivacyInfo.xcprivacy deklariert dies. |
| [O.Data_2](regulations/markdown/BSI-TR-03161-1.md#o-data-2) | Verschlüsselung aller sensiblen | EXAMINE | D + M | 🟡 | SwiftData liegt unter iOS Data Protection. HealthKit-Daten verbleiben im plattformseitig verschlüsselten HealthKit-Store. App-Ebene-Verschlüsselung über die Plattform hinaus heute nicht zusätzlich implementiert. TR fordert explizit über die OS-Verschlüsselung hinausgehende Maßnahmen — Begründung über Schutzbedarfsanalyse erforderlich. |
| [O.Data_3](regulations/markdown/BSI-TR-03161-1.md#o-data-3) | Ablage sensibler Daten. | EXAMINE | D | ✅ | iOS-App-Sandbox + Data-Protection Class A; HealthKit als zusätzlich isolierter Speicherbereich. |
| [O.Data_4](regulations/markdown/BSI-TR-03161-1.md#o-data-4) | Zugriff auf sensible Daten durch | EXAMINE | D | ✅ | Keine veröffentlichten URL-Schemes, keine Document-Provider-/Sharing-Extensions. MPC-Pairing erfordert manuelle Bestätigung (PairingService.swift). |
| [O.Data_5](regulations/markdown/BSI-TR-03161-1.md#o-data-5) | Löschung aller erhobenen | CHECK | D + M | 🟡 | SessionLog dauerhaft persistiert für Streaks-Funktion; Datenminimierung durch Aufzeichnung nur minimaler Felder. Auto-Löschung nach Zeit nicht implementiert — Begründung im Datenschutzkonzept erforderlich. |
| [O.Data_6](regulations/markdown/BSI-TR-03161-1.md#o-data-6) | Erhebung, Speicherung und | CHECK | M | ✅ | SessionLog speichert nur programID, Dauer, Phase-Zeiten, Comfort-Rating. HealthKit-Reads beschränkt auf deklarierte Typen (HR, HRV, Schlaf). |
| [O.Data_7](regulations/markdown/BSI-TR-03161-1.md#o-data-7) | Speicherung und Verarbeitung | CHECK | M | ➖ | Kein Hintergrundsystem; sensible Daten verbleiben lokal. |
| [O.Data_8](regulations/markdown/BSI-TR-03161-1.md#o-data-8) | Entfernung von Metadaten mit | CHECK | D | ➖ | Anwendung verwendet keine Aufnahmegeräte (nur Audio-Wiedergabe via AVFoundation aus pre-bundled MP3s). |
| [O.Data_9](regulations/markdown/BSI-TR-03161-1.md#o-data-9) | Zugriffsbeschränkung bei der | EXAMINE | D | ➖ | Nicht anwendbar — keine Aufnahme. |
| [O.Data_10](regulations/markdown/BSI-TR-03161-1.md#o-data-10) | Keine Aufzeichnungen bei der | EXAMINE | D | 🟡 | Tastatureingaben minimal (z. B. Pairing-Code). UITextContentType + isSecureTextEntry per Code-Review zu prüfen. |
| [O.Data_11](regulations/markdown/BSI-TR-03161-1.md#o-data-11) | Kein Export sensibler Daten in | CHECK | D | 🟡 | Sensible Anzeigen sollten `.textSelection(.disabled)` setzen. Per Code-Review zu prüfen. |
| [O.Data_12](regulations/markdown/BSI-TR-03161-1.md#o-data-12) | Kein Export von sensiblen Daten | EXAMINE | D | ➖ | Anwendung erhebt weder biometrische Daten noch hält private Schlüssel. |
| [O.Data_13](regulations/markdown/BSI-TR-03161-1.md#o-data-13) | Keine Speicherung des | CHECK | D | 🟡 | App-Switcher-Snapshot-Maskierung (`UIApplication.willResignActiveNotification`-Handler) wird empfohlen, ist heute nicht implementiert. Sensible HealthKit-Werte werden in der App jedoch nicht im Klartext angezeigt. |
| [O.Data_14](regulations/markdown/BSI-TR-03161-1.md#o-data-14) | Verschlüsselung aller sensiblen | EXAMINE | D | ✅ | iOS Data Protection (NSFileProtectionComplete) bei Gerätesperre — plattformseitig erfüllt. |
| [O.Data_15](regulations/markdown/BSI-TR-03161-1.md#o-data-15) | Gerätebindung lokal | EXAMINE | D | ✅ | iOS Data Protection: Verschlüsselung mit aus Passcode + Device-UID abgeleitetem Schlüssel = Geräte- und Nutzerbindung. |
| [O.Data_16](regulations/markdown/BSI-TR-03161-1.md#o-data-16) | Enterfernen oder anderweitiges | CHECK | D | ✅ | iOS-Deinstallation entfernt App-Sandbox vollständig; HealthKit-Daten verbleiben absichtlich in HealthKit (Plattformmodell, vom Nutzer steuerbar). |
| [O.Data_17](regulations/markdown/BSI-TR-03161-1.md#o-data-17) | Möglichkeit zum Löschen oder | EXAMINE | M | 🟡 | Vollständige Löschung über Deinstallation möglich. In-App-'Alles löschen'-Funktion noch nicht implementiert; Empfehlung für Aufnahme. |
| [O.Data_18](regulations/markdown/BSI-TR-03161-1.md#o-data-18) | Sicheres Überschreiben von | EXAMINE | D | ➖ | Optionale KANN-Anforderung. Ohne Hintergrundsystem nicht umsetzbar. |

## `O.Paid_*` — Kostenpflichtige Ressourcen

**Official Prüfaspekt:** [(8) Kostenpflichtige Ressourcen](regulations/markdown/BSI-TR-03161-1.md#438-testcharakteristik-zu-prüfaspekt-8-kostenpflichtige-ressourcen)
**Default class:** D  ·  **Default tool:** Code review for App Store IAP only

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Paid_1](regulations/markdown/BSI-TR-03161-1.md#o-paid-1) | Anzeige kostenpflichtiger Leistungen | CHECK | M | ✅ | Anwendung enthält heute keine kostenpflichtigen Funktionen oder Ressourcen. ITSAppUsesNonExemptEncryption=false. |
| [O.Paid_2](regulations/markdown/BSI-TR-03161-1.md#o-paid-2) | Einverständnis des Nutzers vor dem | CHECK | D | ➖ | Keine kostenpflichtigen Funktionen. |
| [O.Paid_3](regulations/markdown/BSI-TR-03161-1.md#o-paid-3) | Einverständnis des Nutzers vor einer | CHECK | D | ➖ | Keine kostenpflichtigen Ressourcen (SMS, Telefonate, Mobile-Daten) werden verwendet. |
| [O.Paid_4](regulations/markdown/BSI-TR-03161-1.md#o-paid-4) | Dauerhaftes Einverständnis des | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Paid_5](regulations/markdown/BSI-TR-03161-1.md#o-paid-5) | Entzug des Einverständnisses | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Paid_6](regulations/markdown/BSI-TR-03161-1.md#o-paid-6) | Ablage der sensiblen | EXAMINE | M | ➖ | Nicht anwendbar. |
| [O.Paid_7](regulations/markdown/BSI-TR-03161-1.md#o-paid-7) | Profilbildung durch Nachverfolgung | CHECK | M | ➖ | Nicht anwendbar. |
| [O.Paid_8](regulations/markdown/BSI-TR-03161-1.md#o-paid-8) | Anzeige der Übersicht der | CHECK | D | ➖ | Nicht anwendbar. |
| [O.Paid_9](regulations/markdown/BSI-TR-03161-1.md#o-paid-9) | Validierung von getätigten | EXAMINE | M | ➖ | Nicht anwendbar. |
| [O.Paid_10](regulations/markdown/BSI-TR-03161-1.md#o-paid-10) | Anforderungen bei Zahlverfahren | CHECK | D | ➖ | Nicht anwendbar. |

## `O.Ntwk_*` — Netzwerkkommunikation

**Official Prüfaspekt:** [(9) Netzwerkkommunikation](regulations/markdown/BSI-TR-03161-1.md#439-testcharakteristik-zu-prüfaspekt-9-netzwerkkommunikation)
**Default class:** R + D  ·  **Default tool:** `testssl.sh` + ATS plist audit

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Ntwk_1](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) | Netzwerkkommunikation | EXAMINE | D | 🟡 | MultipeerConnectivity nutzt session-key-basierte Verschlüsselung (`encryptionPreference: .required`, PairingService.swift:27). Beidseitige Authentisierung erfolgt per User-bestätigtem Pairing-Code, nicht per X.509-mTLS. Anforderung nach mTLS strikt nicht erfüllt; alternative Authentisierung dokumentationspflichtig. |
| [O.Ntwk_2](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-2) | Konfiguration der verschlüsselten | EXAMINE | R + D | ✅ | App führt keine eigenen HTTP(S)-Verbindungen aus. ATS-Default (TLS 1.2+, starke Ciphers) gilt; keine ATS-Ausnahmen in Info.plist. |
| [O.Ntwk_3](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-3) | Sichere Kommunikationskanäle nur | EXAMINE | D | ✅ | Sichere Kanäle ausschließlich über Apple-Plattformbibliotheken (MultipeerConnectivity, Network). |
| [O.Ntwk_4](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-4) | Unterstützung von Zertifikats- | EXAMINE | D | ➖ | Kein eigenes Hintergrundsystem; Zertifikats-Pinning nicht anwendbar. Falls künftig HTTPS-Backend angebunden, ist Pinning vorzusehen. |
| [O.Ntwk_5](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-5) | Validierung des Server-Zertifikats des | EXAMINE | D | ➖ | Kein Hintergrundsystem. |
| [O.Ntwk_6](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-6) | Validierung der Integrität und | EXAMINE | D | ➖ | Kein Hintergrundsystem. |
| [O.Ntwk_7](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-7) | Verwendung plattformspezifischer | EXAMINE | D | ✅ | Info.plist enthält keine ATS-Ausnahmen (`NSAllowsArbitraryLoads` nicht gesetzt). Cleartext-Traffic standardmäßig deaktiviert. |
| [O.Ntwk_8](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-8) | Vorhaltung von vollständigen Log- | CHECK | R | 🟡 | Keine zentrale Verbindungs-Log-Datei; angesichts fehlenden Hintergrundsystems heute nicht zielführend. Bei Architekturänderung neu zu bewerten. |

## `O.Plat_*` — Plattformspezifische Interaktionen

**Official Prüfaspekt:** [(10) Plattformspezifische Interaktionen](regulations/markdown/BSI-TR-03161-1.md#4310-testcharakteristik-zu-prüfaspekt-10-plattformspezifische-interaktionen)
**Default class:** D  ·  **Default tool:** Entitlements diff + `Info.plist` purpose-string check

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Plat_1](regulations/markdown/BSI-TR-03161-1.md#o-plat-1) | Geräteschutz für die Nutzung der | CHECK | M | 🟡 | Geräte-Sperrcheck via `LAContext.canEvaluatePolicy(.deviceOwnerAuthentication)` nicht implementiert. Gemäß Schutzbedarf der HealthKit-Daten zu prüfen, ob Hinweis nötig. |
| [O.Plat_2](regulations/markdown/BSI-TR-03161-1.md#o-plat-2) | Nur Anforderung der für den | CHECK | D | ✅ | Entitlements: nur HealthKit. Info.plist usage strings: nur Health, LocalNetwork (Bonjour-Pairing), NearbyInteraction (UWB-Pairing). Berechtigungen entsprechen primärem Zweck. |
| [O.Plat_3](regulations/markdown/BSI-TR-03161-1.md#o-plat-3) | Hinweis auf Zweck der | CHECK | D | ✅ | Alle Berechtigungs-Beschreibungen in Info.plist erklären Zweck (NSHealthShare/Update, NSLocalNetwork, NSNearbyInteraction). Auswirkung der Verweigerung sollte in App-UI ergänzt werden. |
| [O.Plat_4](regulations/markdown/BSI-TR-03161-1.md#o-plat-4) | Keine sensiblen Daten in Meldungen | EXAMINE | D | ✅ | Anwendung sendet heute keine Push- oder Local-Notifications mit sensiblen Inhalten. |
| [O.Plat_5](regulations/markdown/BSI-TR-03161-1.md#o-plat-5) | Option zur Anzeige von | CHECK | D | ➖ | Keine Notifications. |
| [O.Plat_6](regulations/markdown/BSI-TR-03161-1.md#o-plat-6) | Zugriffsbeschränkungen auf sensible | EXAMINE | D | ✅ | iOS-Sandbox plus HealthKit-Typ-spezifische Autorisierung. |
| [O.Plat_7](regulations/markdown/BSI-TR-03161-1.md#o-plat-7) | Nutzung von sensiblen | CHECK | D | ✅ | Genutzte IPC: WatchConnectivity (Geräte des Nutzers) + MPC (bestätigter Partner). Beide für primären Zweck erforderlich. |
| [O.Plat_8](regulations/markdown/BSI-TR-03161-1.md#o-plat-8) | Nutzung von Rendering Engines zum | CHECK | D | ➖ | Keine Rendering-Engine / WebView. |
| [O.Plat_9](regulations/markdown/BSI-TR-03161-1.md#o-plat-9) | Entfernung von sensiblen Daten bei | EXAMINE | D | 🟡 | Hintergrund-Übergangs-Maskierung empfohlen, heute nicht implementiert. |
| [O.Plat_10](regulations/markdown/BSI-TR-03161-1.md#o-plat-10) | Deaktivierung nicht benötigter | CHECK | D | ➖ | Keine Rendering-Engine. |
| [O.Plat_11](regulations/markdown/BSI-TR-03161-1.md#o-plat-11) | Löschen anwendungsspezifischer | EXAMINE | D | ➖ | Keine Rendering-Engine. |
| [O.Plat_12](regulations/markdown/BSI-TR-03161-1.md#o-plat-12) | Überschreiben aller | EXAMINE | D | ➖ | Swift ARC räumt Speicher beim Exit auf; keine eigenen sensiblen Speicherpuffer. |
| [O.Plat_13](regulations/markdown/BSI-TR-03161-1.md#o-plat-13) | Information des Nutzers über | CHECK | M | ❌ | User-Hinweise zur Geräte-PIN, App-Aktualisierung, Pairing-Sicherheit fehlen — empfohlen für Settings-/About-Screen. |
| [O.Plat_14](regulations/markdown/BSI-TR-03161-1.md#o-plat-14) | Protokollierung bestimmter | CHECK | R | ➖ | Kein Hintergrundsystem für Logging; abnormaler Anwendungsstart → iOS-Standard-Handling. |

## `O.Resi_*` — Resilienz

**Official Prüfaspekt:** [(11) Resilienz](regulations/markdown/BSI-TR-03161-1.md#4311-testcharakteristik-zu-prüfaspekt-11-resilienz)
**Default class:** D + P  ·  **Default tool:** Apple notarisation + `cosign` provenance

| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |
| --- | --- | --- | --- | --- | --- |
| [O.Resi_1](regulations/markdown/BSI-TR-03161-1.md#o-resi-1) | Informationen zum sicheren | CHECK | M | ❌ | User-Best-Practices-Seite fehlt — siehe O.Plat_13. |
| [O.Resi_2](regulations/markdown/BSI-TR-03161-1.md#o-resi-2) | Erkennung vom Betriebszustand des | EXAMINE | D | 🟡 | Mindest-iOS-Version per `deploymentTarget: iOS: '17.0'` erzwungen. Jailbreak-/Modifikations-Erkennung nicht implementiert. |
| [O.Resi_3](regulations/markdown/BSI-TR-03161-1.md#o-resi-3) | Erkennung und Unterbindung des | CHECK | D | ❌ | Debug-Erkennung (z. B. `sysctl(KERN_PROC_ALL)`) nicht implementiert. Bei TR-Strenge anzustreben. |
| [O.Resi_4](regulations/markdown/BSI-TR-03161-1.md#o-resi-4) | Abbruch des Starts der Anwendung | CHECK | D | ➖ | iOS-Sandbox-Modell: keine 'ungewöhnlichen Benutzerrechte' im klassischen Sinne. Anforderung primär für jailbroken devices relevant — siehe O.Resi_2. |
| [O.Resi_5](regulations/markdown/BSI-TR-03161-1.md#o-resi-5) | wird angenommen, dass das Betriebssystem Funktionen bereitstellt, mit denen eine Anwendung die Konformität des Betriebszustandes bezüglich der Anforderungen des Betriebssystemherstellers an das Betriebssystem abfragen kann. | — | D | 🟡 | Apple App Attest (`DCAppAttestService`) verfügbar, ist heute nicht implementiert. |
| [O.Resi_6](regulations/markdown/BSI-TR-03161-1.md#o-resi-6) | Überprüfung der Authentizität des | EXAMINE | D | ➖ | Kein Hintergrundsystem. |
| [O.Resi_7](regulations/markdown/BSI-TR-03161-1.md#o-resi-7) | Integration von | EXAMINE | D | 🟡 | Implementierung mit Apple App Attest empfohlen, heute nicht aktiv. |
| [O.Resi_8](regulations/markdown/BSI-TR-03161-1.md#o-resi-8) | Umsetzung von Maßnahmen gegen | EXAMINE | D | 🟡 | Apple-Toolchain-Defaults aktiv (Stack-Canary, ASLR, NX). Obfuskation (Symbol-Stripping, Anti-Debugging) nicht implementiert. Wechselwirkung mit O.Source_9. |
| [O.Resi_9](regulations/markdown/BSI-TR-03161-1.md#o-resi-9) | Berücksichtigung von Plattformen | EXAMINE | D | ➖ | Anwendung ist iOS-/watchOS-exklusiv; Hersteller-Variations-Problem entfällt. |
| [O.Resi_10](regulations/markdown/BSI-TR-03161-1.md#o-resi-10) | Robustheit gegenüber Störungen. | EXAMINE | D + P | ✅ | Robustheit durch Engine-State-Machine-Tests (BreathingEngine pause/resume, Audio-interruption-Handling). CI testet auf iPhone- und Watch-Simulator (ci.yml). |

