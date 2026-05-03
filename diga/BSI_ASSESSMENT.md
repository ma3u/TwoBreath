# Hersteller-Selbstdeklaration nach BSI TR-03161-1 — TwoBreath

> **Eingabe-Dossier zur Vorlage bei einer akkreditierten Prüfstelle** als Vorbereitung des BSI-Zertifizierungsverfahrens nach TR-03161-1 (Mobile Anwendungen).

**Status:** Entwurf v0.1 · zur Übergabe an die ausgewählte Prüfstelle
**Datum:** 2026-05-03
**App-Version im Scope:** **TwoBreath 1.6.0 (Build 25)** — TestFlight WAITING_FOR_REVIEW
**TR-Bezug:** BSI TR-03161-1 v3.0 vom 25.03.2024

---

> ⚠️ **Wichtiger Hinweis zur Eigenart dieses Dokuments**
>
> Das BSI publiziert **keine offizielle Vorlage** für das Hersteller-Eingabe-Paket. Die Struktur dieses Dokuments folgt der **direkten Anforderungs-Gliederung der TR-03161-1** (Kapitel 4 + 5) plus der branchenüblichen Praxis akkreditierter Prüfstellen ([secuvera](https://www.secuvera.de/bsi-pruefstelle/bsi-tr-03161-zertifizierung-pruefstelle/), [TÜViT](https://www.tuvit.de/de/services/normen-richtlinien-vorgaben/bsi-tr-03161/), [SRC](https://src-gmbh.de/blog/tr-03161-pruefstelle/)).
>
> Die eigentliche **Prüfung und der Prüfbericht** erfolgen durch die Prüfstelle. Das BSI erteilt das Zertifikat anschließend auf Basis dieses Prüfberichts. Diese Selbstdeklaration ist die **Eingabe für die Prüfstelle**, nicht das BSI-Zertifikat selbst.

---

## Inhaltsverzeichnis

- [1. Antragsteller und Produktidentifikation](#1-antragsteller-und-produktidentifikation)
- [2. Geltungsbereich der Prüfung (Target of Evaluation, ToE)](#2-geltungsbereich-der-prüfung-target-of-evaluation-toe)
- [3. Sicherheits-Anwendungshinweise (Anwender-Information)](#3-sicherheits-anwendungshinweise-anwender-information)
- [4. Architektur und Datenflussbeschreibung](#4-architektur-und-datenflussbeschreibung)
- [5. Bedrohungsmodell (Threat Model)](#5-bedrohungsmodell-threat-model)
- [6. Anforderungs-Compliance-Matrix (alle 127 `O.*`)](#6-anforderungs-compliance-matrix-alle-127-o)
- [7. Kryptographie-Inventar](#7-kryptographie-inventar)
- [8. Authentifizierungs- und Sitzungs-Konzept](#8-authentifizierungs--und-sitzungs-konzept)
- [9. Sichere Datenspeicherung und Datenschutz](#9-sichere-datenspeicherung-und-datenschutz)
- [10. Sicherer Software-Lebenszyklus, Lieferkette, SBOM](#10-sicherer-software-lebenszyklus-lieferkette-sbom)
- [11. Resilienz, Logging, Incident-Response](#11-resilienz-logging-incident-response)
- [12. Anhänge / Evidenz-Verzeichnis](#12-anhänge--evidenz-verzeichnis)
- [Bekannte Lücken und Restrisiken](#bekannte-lücken-und-restrisiken)

---

## 1. Antragsteller und Produktidentifikation

### 1.1 Antragsteller

| Feld | Wert |
| --- | --- |
| Hersteller | Matthias Buchhorn-Roth |
| Sicherheits-Ansprechpartner | E-Mail `security@twobreath.com` (siehe [`SECURITY.md`](SECURITY.md)) |
| Verschlüsselter Kanal | PGP auf Anfrage; GitHub Private Vulnerability Reporting auf <https://github.com/ma3u/TwoBreath> |

### 1.2 Produkt

| Feld | Wert |
| --- | --- |
| Produktname | TwoBreath — Couples Breathing Ritual |
| Bundle-ID iOS | `com.ma3u.twobreath` |
| Bundle-ID watchOS | `com.ma3u.twobreath.watchkitapp` |
| Marketing-Version (Scope) | **1.6.0** |
| Build-Number (Scope) | **25** |
| Mindest-iOS | 17.0 |
| Mindest-watchOS | 10.0 |
| Distribution | Apple App Store + Apple Notarisation |
| App Store Connect ID | 6761666145 |
| Sprachen | Deutsch, Englisch, Japanisch |

### 1.3 Hersteller-Erklärung zur Vollständigkeit

Der Antragsteller erklärt hiermit, dass die in diesem Dossier zusammengetragenen Angaben nach bestem Wissen vollständig und korrekt sind und dass alle bekannten Restrisiken und offenen Punkte in [Bekannte Lücken und Restrisiken](#bekannte-lücken-und-restrisiken) ausgewiesen sind.

---

## 2. Geltungsbereich der Prüfung (Target of Evaluation, ToE)

### 2.1 In-Scope

- **TwoBreath iOS-App** (Universal, iPhone + iPad, Mindest-iOS 17.0)
- **TwoBreath watchOS-Companion-App** (Apple Watch Series 4+, watchOS 10.0+)
- Der **lokal-zuerst**-Datenpfad: SwiftData (`SessionLog`, `ConsentLog`), HealthKit-Reads/Writes, MultipeerConnectivity-Pairing, NearbyInteraction (UWB), WatchConnectivity (iPhone↔Watch)
- Apple-Plattform-Services, soweit sie Sicherheits-Eigenschaften der App tragen

### 2.2 Out-of-Scope

| Aspekt | Begründung | Trigger zur Reaktivierung |
| --- | --- | --- |
| TR-03161-2 (Web-Anwendungen) | TwoBreath stellt **keine eigene Web-Anwendung** bereit. Die Marketing-Site `twobreath.com` ist **statisch** (GitHub Pages, kein Auth, kein Datenfluss zu/von der App). | wenn die App eine eigene WebView mit Hersteller-Inhalten lädt |
| TR-03161-3 (Hintergrundsysteme) | TwoBreath hat **kein eigenes Backend**. Sämtliche Daten verbleiben lokal auf dem Gerät oder fließen P2P zum gepairten Partner-Gerät. | wenn ein Hersteller-Backend angebunden wird (z. B. für DiGA-Manager-Plattform, Cloud-Sync, Telemetrie) |
| BSI C5 (Cloud-Sicherheits-Katalog) | n/a, da kein Hersteller-Cloud-Service. | bei TR-03161-3-Aktivierung gemeinsam zu prüfen |

### 2.3 Begründung der Architektur-Wahl

Die lokal-zuerst-Architektur ist **bewusste Designentscheidung** und Teil des Datenschutz-Konzepts. Sie entspricht dem Prinzip „Privacy by Design" ([Art. 25 DSGVO](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679)) und vermeidet die Mehrzahl der TR-03161-3-Anforderungen vollständig. Eine Erweiterung um ein Backend bedingt die Re-Auswertung dieses Dokuments.

---

## 3. Sicherheits-Anwendungshinweise (Anwender-Information)

> Erfüllt: TR-03161-1 [O.Resi_1](regulations/markdown/BSI-TR-03161-1.md#o-resi-1), [O.Plat_13](regulations/markdown/BSI-TR-03161-1.md#o-plat-13), [O.Plat_1](regulations/markdown/BSI-TR-03161-1.md#o-plat-1), [O.Purp_1](regulations/markdown/BSI-TR-03161-1.md#o-purp-1).

Die App enthält einen Settings-Bildschirm **„Sicherheit"** (`SecurityInfoView`, `TwoBreath/Features/Settings/Views/SecurityInfoView.swift` — TwoBreath-app commit [`b73419a`](https://github.com/ma3u/TwoBreath-app/commit/b73419a)) mit:

- **Sicherheits-Empfehlungen** an den Nutzer (iOS-Code-Sperre / Face-ID, Aktualität, vertrauensvolles Pairing, Verzicht auf Jailbreak, iCloud-Backup-Empfehlung)
- **Übersicht der verarbeiteten Daten** (HealthKit-Reads, Mindful-Minutes-Writes, Lokales Netzwerk, lokale Speicherung, keine Drittanbieter)
- **Navigation in das Einwilligungs-Verzeichnis** (`ConsentLogView`)
- **Button „Alle TwoBreath-Daten löschen"** (`DataEraseService`, mit Bestätigungs-Dialog und Hinweis auf HealthKit-Daten-Verbleib)
- **Link zu `SECURITY.md`** für die Meldung von Sicherheitsproblemen

### Volltext-Anhang
Volltext der Anwender-Information siehe [`concepts/01-datenschutzkonzept.md` § 12](concepts/01-datenschutzkonzept.md#12-anlage-erstinformations-texte-vorschlag) (Erstinformations-Texte für die drei Sprachen DE/EN/JA).

---

## 4. Architektur und Datenflussbeschreibung

> Vollständiges Designdokument: [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md) (mit ASCII-Trust-Boundary-Diagramm und Lebenszyklus-Tabellen pro Datenkategorie D1–D7).

### 4.1 Komponenten

```
TwoBreath iOS-App  ←→  Apple HealthKit-Store  (read: HR, HRV, Schlaf;  write: Mindful-Minutes)
TwoBreath iOS-App  ←→  iOS App-Sandbox        (SwiftData: SessionLog, ConsentLog; UserDefaults: PartnerPairing)
TwoBreath iOS-App  ←→  WatchConnectivity      (Apple-vermittelt, iPhone↔Apple Watch)
TwoBreath iOS-App  ←→  MultipeerConnectivity  (P2P-Pairing zum Partner-iPhone, encryption=required)
TwoBreath iOS-App  ←→  NearbyInteraction      (UWB-Distanzmessung zum Partner-iPhone)
TwoBreath iOS-App  ←→  Apple App Store        (Notarisation, Distribution, Updates)
```

### 4.2 Trust-Boundaries

| Grenze | Schutz |
| --- | --- |
| App-Sandbox ↔ HealthKit | Apple-Berechtigungs-API mit Nutzer-Dialog |
| App-Sandbox ↔ Lokales Netzwerk + UWB | Apple-Berechtigungs-API |
| iPhone ↔ Apple Watch | Apple WatchConnectivity (plattformseitig verschlüsselt, gleicher iCloud-Account) |
| iPhone ↔ Partner-iPhone | MPC mit `encryptionPreference: .required` + manueller Pairing-Code |
| Außenwelt (Internet) | **kein Datenfluss** (kein Backend) |

### 4.3 Drittanbieter

**Keine.** Die App nutzt ausschließlich Apple-Frameworks (SwiftUI, SwiftData, AVFoundation, HealthKit, MultipeerConnectivity, NearbyInteraction, WatchConnectivity). Keine SPM-Pakete, kein CocoaPods, kein Carthage (siehe `TwoBreath-app/CLAUDE.md`). Trivial-Erfüllung von [O.Purp_7](regulations/markdown/BSI-TR-03161-1.md#o-purp-7), [O.TrdP_1](regulations/markdown/BSI-TR-03161-1.md#o-trdp-1) bis [O.TrdP_8](regulations/markdown/BSI-TR-03161-1.md#o-trdp-8).

---

## 5. Bedrohungsmodell (Threat Model)

> Vollständige STRIDE-Analyse: [`concepts/03-threat-model.md`](concepts/03-threat-model.md).

### 5.1 Akteur:innen und Vertrauen

| Akteur:in | Vertrauen |
| --- | --- |
| Eigentümer:in des iPhones | hoch |
| Apple-iOS-Plattform | hoch |
| Gepaarte:r Partner:in | hoch (manuell bestätigt) |
| Lokales WLAN / Bluetooth-Reichweite | niedrig |
| Apple App Store | hoch |
| Drittanbieter / Internet | n/a (kein Datenfluss) |

### 5.2 Hauptbedrohungen und Mitigationen (Auszug)

| # | Bedrohung | Maßnahme | TR-Bezug |
| --- | --- | --- | --- |
| G1 | Geräteverlust ohne Code-Sperre | User-Hinweis im SecurityInfoView | [O.Plat_1](regulations/markdown/BSI-TR-03161-1.md#o-plat-1) |
| G2 | Geräteverlust mit Code-Sperre | iOS Data Protection Class A | [O.Data_14](regulations/markdown/BSI-TR-03161-1.md#o-data-14), [O.Data_15](regulations/markdown/BSI-TR-03161-1.md#o-data-15) |
| G3 | Jailbreak / Modifikation | Mindest-iOS-Version + Hinweis | [O.Resi_2](regulations/markdown/BSI-TR-03161-1.md#o-resi-2) |
| G4 | Reverse Engineering der Binärdatei | Apple-Toolchain-Defaults + Symbol-Stripping in Release | [O.Resi_8](regulations/markdown/BSI-TR-03161-1.md#o-resi-8), [O.Source_9](regulations/markdown/BSI-TR-03161-1.md#o-source-9) |
| G5 | Hostiles WiFi während Pairing | MPC `encryptionPreference: .required` + Pairing-Code | [O.Ntwk_1](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) |
| G6 | Geheimnisse im Repo | `gitleaks` in CI, weekly cron | [O.Cryp_1](regulations/markdown/BSI-TR-03161-1.md#o-cryp-1) |
| G7 | Veraltete App-Version | Apple App Store-Update-Modell | [O.Arch_10](regulations/markdown/BSI-TR-03161-1.md#o-arch-10) |
| G8 | Sicherheitsmeldung erreicht Hersteller nicht | `SECURITY.md` mit verschlüsseltem Kanal | [O.Arch_9](regulations/markdown/BSI-TR-03161-1.md#o-arch-9) |
| G10 | Debug-Modus in Release versehentlich aktiv | `assertNotDebugged()` in App-Init (Patch §1) | [O.Resi_3](regulations/markdown/BSI-TR-03161-1.md#o-resi-3), [O.Source_8](regulations/markdown/BSI-TR-03161-1.md#o-source-8) |

---

## 6. Anforderungs-Compliance-Matrix (alle 127 `O.*`)

> **Kerntabelle des Dossiers.** Die vollständige Matrix mit jeder einzelnen Anforderung der TR-03161-1 v3.0, mit Status, Prüftiefe, Klasse (R/D/P/M), Begründung und Verweis auf Code-/Konzept-Beleg liegt in:
>
> **[`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md)** (auto-generiert aus [`evidence/tr1-twobreath-status.yaml`](evidence/tr1-twobreath-status.yaml)).

### 6.1 Aggregat-Stand (2026-05-03)

| Status | Bedeutung | Anzahl | Anteil |
| --- | --- | ---: | ---: |
| ✅ erfüllt | Beleg vorhanden, im Code/Konzept verlinkt | **70** | **55 %** |
| 🟡 teilweise | App-Attest-Pfad — Stub vorhanden, Konsument fehlt (kein Backend) | **2** | **2 %** |
| ❌ fehlt | — | **0** | **0 %** |
| ➖ nicht anwendbar | Architektur-/Funktions-Begründung in der Matrix-Zeile | **55** | **43 %** |
| 🔍 offen | — | 0 | 0 % |
| **Gesamt** | | **127** | **100 %** |

### 6.2 Klassen-Verteilung (Nachweis-Form)

| Klasse | Bedeutung | Anzahl |
| --- | --- | ---: |
| **R** Real-time | live im Produktivsystem fortlaufend gültig | 5 |
| **D** Deploy-time | bei jedem CI/CD-Build erzeugt + signiert | 94 |
| **P** Periodic | mit definierter Gültigkeitsdauer | 2 |
| **M** Manual | menschliche Bewertung erforderlich | 26 |

### 6.3 Verteilung über die elf Prüfaspekte

| TR-03161-1 § 4.3 Prüfaspekt | Anzahl `O.*` | Default-Klasse | Bemerkung |
| --- | ---: | --- | --- |
| (1) Anwendungszweck (`O.Purp_*`) | 9 | M | Einwilligung, Datenverarbeitungs-Zweck |
| (2) Architektur (`O.Arch_*`) | 12 | M + D | Architektur-, Threat-Model-Doku |
| (3) Quellcode (`O.Source_*`) | 10 | D | SAST, Code-Review |
| (4) Drittanbieter-Software (`O.TrdP_*`) | 8 | D | trivial — keine Drittanbieter |
| (5) Kryptographische Umsetzung (`O.Cryp_*` + `O.Rand_*`) | 8 | D | Plattform-Delegierung (Krypto-Konzept § 2) |
| (6) Authentisierung (`O.Auth_*` + `O.Pass_*`) | 20 | D | im TwoBreath-Profil durchgängig ➖ (keine Konten) |
| (7) Datensicherheit (`O.Data_*`) | 18 | D + M | Speicher- und Verarbeitungsseite |
| (8) Kostenpflichtige Ressourcen (`O.Paid_*`) | 10 | D | keine kostenpflichtigen Funktionen |
| (9) Netzwerkkommunikation (`O.Ntwk_*`) | 8 | R + D | MPC + ATS |
| (10) Plattformspezifische Interaktionen (`O.Plat_*`) | 14 | D | Entitlements, Berechtigungen |
| (11) Resilienz (`O.Resi_*`) | 10 | D + P | Update-Pfad, Wiederherstellung |
| **Gesamt** | **127** | | |

---

## 7. Kryptographie-Inventar

> Vollständiges Konzept: [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md) — explizite Plattform-Delegierung nach BSI **TR-02102**.

### 7.1 Kernaussage

**TwoBreath enthält keine eigene Implementierung kryptographischer Primitive und keine eigenen kryptographischen Schlüssel.** Sämtliche Kryptographie wird durch Apple-Plattform-Mechanismen erbracht.

### 7.2 Verwendete Krypto-Pfade (Plattform-Aussagen)

| # | Verwendung | Mechanismus | Apple-Aussage zu Algorithmen | TR-02102-Konformität |
| --- | --- | --- | --- | --- |
| K1 | Verschlüsselung der Sandbox-Dateien | iOS Data Protection Class A (`NSFileProtectionComplete`) | AES-256-XTS, Schlüssel abgeleitet aus Passcode + Secure-Enclave-UID | konform |
| K2 | HealthKit-Speicher | Apple HealthKit-Store | Apple-vermittelt | konform |
| K3 | iCloud-Backup | iCloud-Backup-Schlüssel + Account-Schlüssel | Apple-vermittelt | konform |
| K4 | MPC-P2P-Verbindung | MultipeerConnectivity, `encryptionPreference: .required` | TLS-DTLS, AES-GCM | konform |
| K5 | App Transport Security | iOS ATS | TLS 1.2+, AEAD-Cipher-Suiten | konform |
| K6 | Code-Signatur | Apple Code-Signing | RSA-2048 oder ECDSA P-256 | konform |
| K7 | Notarisation | Apple Notarisation | Apple-vermittelt | konform |

### 7.3 Schlüsselmaterial im Hersteller-Bereich

**Keines.** Bestätigt durch:
- `gitleaks` in CI, push + PR + weekly cron, mit Custom-Regeln in `.gitleaks.toml` für ElevenLabs- und Apple-API-Keys
- Build-Manifest-Audit: keine eingebetteten Schlüssel im IPA (verifiziert per `MobSF` — geplant in CI-Phase)
- `Info.plist` `ITSAppUsesNonExemptEncryption: false`

---

## 8. Authentifizierungs- und Sitzungs-Konzept

### 8.1 Hersteller-Erklärung

**TwoBreath verwendet keine Nutzer-Authentifizierung im klassischen Sinn.** Es gibt:

- **Keine Nutzerkonten**
- **Keine Passwörter**
- **Keine Tokens / Sessions / Refresh-Tokens**

Sämtliche `O.Auth_*`- und `O.Pass_*`-Anforderungen (zusammen 20 Stück) sind aus diesem Grund mit **➖ nicht anwendbar** in der Compliance-Matrix klassifiziert, jeweils mit Architektur-Begründung.

### 8.2 Partner-Pairing als Zugangs-Schutz

Das einzige verwandte Konzept ist das **Partner-Pairing** (zwei iPhones, manueller Pairing-Code, MPC-verschlüsselte Sitzung). Die Sicherheits-Konzept-Erklärung dazu liegt in [`concepts/07-netzwerk-sicherheitskonzept.md` § 3](concepts/07-netzwerk-sicherheitskonzept.md). Die Pairing-Code-Eingabe ist mit `.textContentType(.oneTimeCode)`, `.privacySensitive()`, `.autocorrectionDisabled()` konfiguriert (Patch §3, TwoBreath-app commit [`c6557e0`](https://github.com/ma3u/TwoBreath-app/commit/c6557e0)).

### 8.3 Trigger zur Reaktivierung

Sobald ein Hersteller-Backend mit Nutzerkonten oder Tokens hinzukommt, ist ein vollständiges Authentisierungs-Konzept nach [O.Auth_1](regulations/markdown/BSI-TR-03161-1.md#o-auth-1) zu erstellen. Erfahrungsgemäß empfohlen: OIDC mit MFA (FIDO2 / Apple Sign-In), Token-Rotation, Brute-Force-Rate-Limit serverseitig.

---

## 9. Sichere Datenspeicherung und Datenschutz

> Vollständiges Datenschutzkonzept: [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md). Datenlebenszyklus pro Kategorie: [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md).

### 9.1 Datenkategorien (Auszug)

| ID | Kategorie | Sensitivität | Speicherort |
| --- | --- | --- | --- |
| D1 | Sitzungsmetadaten (`SessionLog`) | gering | iOS App-Sandbox, Data Protection Class A |
| D2 | Achtsamkeits-Minuten | mittel — Gesundheitsdaten | Apple HealthKit-Store |
| D3 | HealthKit-Reads (HR, HRV, Schlaf) | hoch — Gesundheitsdaten | nicht persistiert in der App; nur in-Memory zur Anzeige |
| D4 | Partner-Pairing | mittel | iOS App-Sandbox (UserDefaults), Data Protection Class A |
| D5 | MPC-Sitzungsdaten | mittel | flüchtig (Arbeitsspeicher) |
| D6 | Watch-Sync-Daten | gering | flüchtig + Watch-`SessionLog` |
| D7 | iOS-Logs (`os.Logger`) | gering | Apple Unified Logging, Plattform-Standard-Retention |

### 9.2 Verschlüsselung at-rest

Alle persistierten Daten unter Data Protection Class A (`NSFileProtectionComplete`). Bei Geräte-Sperre vollständig verschlüsselt — Schlüssel abgeleitet aus Passcode + Secure-Enclave-UID. Erfüllt [O.Data_14](regulations/markdown/BSI-TR-03161-1.md#o-data-14), [O.Data_15](regulations/markdown/BSI-TR-03161-1.md#o-data-15).

### 9.3 Lösch- und Export-Funktionen

- **In-App-Löschung aller lokalen Daten**: `DataEraseService.eraseAllLocalData(modelContext:)` (Patch §7, TwoBreath-app commit [`7b9ca59`](https://github.com/ma3u/TwoBreath-app/commit/7b9ca59)) — Confirmation-Dialog im `SecurityInfoView`.
- **Einwilligungs-Verlauf-Export als JSON**: `ConsentTracker.exportAsJSON(modelContext:)` (Patch §9, TwoBreath-app commit [`17ab902`](https://github.com/ma3u/TwoBreath-app/commit/17ab902)) — über System-Share-Sheet.
- **Komplett-Löschung über App-Deinstallation**: iOS-Sandbox wird vollständig entfernt; HealthKit-Daten verbleiben absichtlich in HealthKit (Plattform-Modell, vom Nutzer steuerbar).

Erfüllt [O.Data_16](regulations/markdown/BSI-TR-03161-1.md#o-data-16), [O.Data_17](regulations/markdown/BSI-TR-03161-1.md#o-data-17), [O.Purp_5](regulations/markdown/BSI-TR-03161-1.md#o-purp-5).

### 9.4 DSFA und Auftragsverarbeitung

Eine **vollständige Datenschutz-Folgenabschätzung nach Art. 35 DSGVO** ist für die DiGA-Listung erforderlich, in der heutigen Form **noch nicht erstellt**. Das Datenschutzkonzept ([`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md)) deckt § 1–11 strukturell ab und dient als DSFA-Light. Vollständige DSFA wird vor formaler DiGA-Antragstellung nachgezogen — siehe [Bekannte Lücken und Restrisiken](#bekannte-lücken-und-restrisiken) Punkt L1.

**Auftragsverarbeitung:** **keine.** Die App betreibt keinen Auftragsverarbeiter (kein Backend). Apple App Store / iCloud-Backup ist Plattform-Dienst, kein Auftragsverarbeiter im engeren Sinne.

---

## 10. Sicherer Software-Lebenszyklus, Lieferkette, SBOM

> Vollständige Standards: [`concepts/04-secure-coding-standards.md`](concepts/04-secure-coding-standards.md). CI/CD-Stand: [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) (mit drop-in-`security.yml`-Vorschlag).

### 10.1 Entwicklungsprozess

| Bereich | Stand |
| --- | --- |
| Versionskontrolle | Git, GitHub `ma3u/TwoBreath-app` (privat) |
| Branching | aktuell `main`-only; PR-Reviews bei größeren Änderungen |
| Pre-Commit | `husky` lokal — gitleaks, SwiftLint |
| CI in `TwoBreath-app/.github/workflows/` | `gitleaks` (push + PR + cron Mo 06:00 UTC), `SwiftLint --strict`, ESLint, `npm audit` (Build-Toolchain), iPhone- + Watch-Tests, Playwright (Web), Release-Build-Gate |
| **Tests** | **600 Swift-Testing-Tests, 0 Failures** auf iPhone-Target, gemessene Coverage **35,3 %** Overall, **>90 %** auf den Patch-Business-Logik-Files |
| Release-Build-Härtung | `STRIP_INSTALLED_PRODUCT`, `STRIP_SWIFT_SYMBOLS`, `DEAD_CODE_STRIPPING`, `-Wl,-x` (Patch §8) |
| Code-Signatur | Apple Code-Signing + Notarisation, App Store Connect API-Key-basierte Pipeline |

### 10.2 SBOM

**Status:** SBOM-Generierung mit `syft` ist als Pipeline-Erweiterung in [`CI_CD_SECURITY.md` § 4](CI_CD_SECURITY.md#4-konkreter-vorschlag-erweiterte-securityyml-für-twobreath-app) als drop-in-YAML-Block hinterlegt; **noch nicht aktiviert**, da:

1. Die App hat **null Drittanbieter-Pakete** — eine SBOM dieser App ist trivial leer (oder enthält nur Apple-Frameworks, die nicht in einer SBOM für CVE-Tracking relevant sind, weil sie über Apple-Plattform-Updates patchbar sind).
2. Die SBOM für die **Build-Toolchain** (`package-lock.json` der Marketing-Site mit `markdownlint-cli2`) liegt im Public-Repo `ma3u/TwoBreath` und wird durch `osv-scanner` in jeder Pipeline gescannt — **0 Vulnerabilities** im aktuellen Stand.

Der Prüfstelle wird auf Verlangen eine signierte CycloneDX-SBOM des aktuellen Builds zur Verfügung gestellt.

### 10.3 Patch-Policy

| Schwere | SLA |
| --- | --- |
| Kritisch (CVSS ≥ 9.0) | binnen 7 Tagen Hot-Fix-Release |
| Hoch (CVSS 7.0–8.9) | binnen 30 Tagen Folge-Release |
| Mittel (CVSS 4.0–6.9) | nächstes reguläres Release |
| Niedrig | bei Gelegenheit |

Quelle: [`SECURITY.md` § Reaktionszeiten](SECURITY.md).

---

## 11. Resilienz, Logging, Incident-Response

> Vollständig: [`concepts/08-resilienz-haertungskonzept.md`](concepts/08-resilienz-haertungskonzept.md).

### 11.1 Stufenmodell der Härtung

| Stufe | Maßnahme | Status |
| --- | --- | --- |
| 1 | App-Sandbox | ✅ iOS-Default |
| 2 | Code-Signatur + Notarisation | ✅ App-Store-Pfad |
| 3 | Compiler-Hardening (Stack-Canary, ASLR, NX, PAC) | ✅ Apple-Toolchain-Default |
| 4 | Symbol-Stripping in Release | ✅ Patch §8 (TwoBreath-app commit [`f699bc5`](https://github.com/ma3u/TwoBreath-app/commit/f699bc5)) |
| 5 | Mindest-iOS-Version 17.0 | ✅ `project.yml` |
| 6 | Debug-Umgebungs-Erkennung beim Start | ✅ Patch §1 (TwoBreath-app commit [`7ecd9da`](https://github.com/ma3u/TwoBreath-app/commit/7ecd9da)) |
| 7 | App Attest (Geräteintegrität) | 🟡 Stub vorbereitet (Patch §6, [`5bc76be`](https://github.com/ma3u/TwoBreath-app/commit/5bc76be)) — wartet auf Backend-Konsumenten |
| 8 | Anti-Debugging (`PT_DENY_ATTACH`) | ❌ **bewusst nicht implementiert** — Begründung in `concepts/08` § 5.2 |
| 9 | Jailbreak-Heuristiken | ❌ **bewusst nicht implementiert** — Begründung in `concepts/08` § 5.3 |

### 11.2 Logging

- **Werkzeug**: `os.Logger` (Apple Unified Logging)
- **PII-Schutz**: SwiftLint-Custom-Regel `os_log_privacy_marker` erzwingt `privacy:`-Marker bei jeder String-Interpolation (Patch §10, TwoBreath-app commit [`e463e68`](https://github.com/ma3u/TwoBreath-app/commit/e463e68)) — `print(...)` ist in Produktiv-Pfaden via SwiftLint-Regel verboten.
- **Sensible Größen** (HR, HRV, Schlaf, Partner-Name, Pairing-Code) immer mit `privacy: .private` markiert.
- **Logs verlassen das Gerät niemals**.

### 11.3 Incident-Response und CVD-Policy

- **CVD-Pfad**: [`SECURITY.md`](SECURITY.md) — verschlüsselter Kanal (`security@twobreath.com`, PGP auf Anfrage), GitHub Private Vulnerability Reporting, Safe-Harbor-Erklärung.
- **SLA-Ziele**: kritisch ≤ 24 h Erstantwort, hoch ≤ 72 h, etc.

### 11.4 Robustheit

- **Swift-Testing-Unit-Tests** auf BreathingEngine-State-Machine (pause/resume), Audio-Interruption-Handling, RitualEngine, ConsentLog, ConsentTracker, DataEraseService, AppSwitcherShield, DebugDetection, AppAttestStub.
- **600 Tests, 0 Failures** auf dem aktuellen 1.6.0/25-Build.
- CI testet auf iPhone- und Watch-Simulator bei jedem PR.

---

## 12. Anhänge / Evidenz-Verzeichnis

Alle Anhänge liegen im öffentlichen Repo `ma3u/TwoBreath` unter [`diga/`](https://github.com/ma3u/TwoBreath/tree/main/diga) und sind Git-versioniert.

| Nr. | Anhang | Status | Pfad |
| --- | --- | --- | --- |
| A1 | Architektur-Diagramm + Trust-Boundaries (ASCII) | ✅ | [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md) § 2 |
| A2 | Datenfluss-Beschreibung pro Datenkategorie D1–D7 | ✅ | [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md) § 4 |
| A3 | Threat Model (STRIDE) | ✅ | [`concepts/03-threat-model.md`](concepts/03-threat-model.md) |
| A4 | Krypto-Inventar mit TR-02102-Bezug | ✅ | [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md) |
| A5 | SBOM (CycloneDX) | 🟡 vorbereitet | wird in Phase-3-CI per `syft` generiert; siehe [`CI_CD_SECURITY.md` § 4](CI_CD_SECURITY.md#4-konkreter-vorschlag-erweiterte-securityyml-für-twobreath-app) |
| A6 | Anforderungs-Compliance-Matrix (alle 127 `O.*`) | ✅ | [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) + [`evidence/tr1-twobreath-status.yaml`](evidence/tr1-twobreath-status.yaml) |
| A7 | Sicherheits-Anwendungshinweise | ✅ | [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) § 12 + In-App `SecurityInfoView` |
| A8 | DSFA Art. 35 DSGVO | 🟡 strukturell abgedeckt im Datenschutzkonzept; vollständige DSFA vor DiGA-Antrag erforderlich | [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) § 11 |
| A9 | AVV-Liste | ✅ trivial — keine Auftragsverarbeiter | siehe Abschnitt 9.4 |
| A10 | Pen-Test-Bericht | ❌ **noch nicht durchgeführt** | siehe Lücke L2 unten |
| A11 | Vulnerability-Management-Policy + SLAs | ✅ | [`SECURITY.md`](SECURITY.md) |
| A12 | CVD-Policy / SECURITY.md | ✅ | [`SECURITY.md`](SECURITY.md) |
| A13 | Quellcode-Zugang oder Build-Reproduktion | 🟡 ab Vertragsschluss mit Prüfstelle (privates Repo) | `git@github.com:ma3u/TwoBreath-app.git`, fine-grained PAT auf Anfrage |
| A14 | TLS-Server-Konfig (`testssl.sh`) für `twobreath.com` | ✅ | wöchentlicher Lauf in [`.github/workflows/security.yml`](https://github.com/ma3u/TwoBreath/blob/main/.github/workflows/security.yml), Artefakte 90 Tage |
| A15 | Plattform-Härtungs-Nachweis (Plist + Entitlements) | ✅ in TwoBreath-app: `TwoBreath/Info.plist`, `TwoBreath.entitlements`, `PrivacyInfo.xcprivacy` | auf Anfrage |
| A16 | Build-Reproduzierbarkeits-Nachweis | 🟡 Apple-Notarisation als signierter Build-Beleg | [App Store Connect](https://appstoreconnect.apple.com) |
| A17 | Versions-Inventar Frameworks/SDKs | ✅ Apple-only, in `project.yml` deklariert | `TwoBreath-app/project.yml` |
| A18 | Test-Account-Zugänge + Demo-Daten für Prüfstelle | 🟡 ad-hoc — TwoBreath benötigt keine Konten; Demo-Pairing-Code wird dem Prüfer auf Anfrage gestellt | n/a |

---

## Bekannte Lücken und Restrisiken

Diese Liste ist Pflichtbestandteil der Hersteller-Selbstdeklaration und Grundlage für die Diskussion mit der Prüfstelle.

| # | Lücke | Auswirkung | Behebungsplan |
| --- | --- | --- | --- |
| **L1** | **Vollständige DSFA Art. 35 DSGVO** noch nicht erstellt | DiGA-Listung beim BfArM erfordert vollständige DSFA | Markdown-DSFA-Vorlage wird aus [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) abgeleitet, vor BfArM-Antragstellung |
| **L2** | **Pen-Test-Bericht** der App noch nicht durchgeführt | DiGA-Leitfaden BfArM erwartet Pen-Test ≤ 12 Monate alt | Beauftragung an akkreditierte Prüfstelle (secuvera, TÜViT, SRC) gemeinsam mit dem TR-03161-Audit |
| **L3** | **App Attest** ([O.Resi_5](regulations/markdown/BSI-TR-03161-1.md#o-resi-5), [O.Resi_7](regulations/markdown/BSI-TR-03161-1.md#o-resi-7)) Stub vorhanden, aber nicht aktiv | Geräteintegritäts-Beleg fehlt | aktivieren bei Hinzufügen eines Hintergrundsystems, das die Attestation verifiziert |
| **L4** | **MobSF iOS-Binär-Analyse + `semgrep` Swift-SAST** in CI noch nicht aktiv | klassische Mobile-AppSec-Werkzeug-Berichte fehlen | drop-in YAML in [`CI_CD_SECURITY.md` § 4](CI_CD_SECURITY.md#4-konkreter-vorschlag-erweiterte-securityyml-für-twobreath-app) — Aktivierung mit nächster App-Iteration |
| **L5** | **MDR-Klasse-I-Konformitätserklärung** und **GDPR-Art.-42-Zertifikat** sind separate, parallele Pflichten | DiGA-Listung erfordert beide zusätzlich zum BSI-Zertifikat | nicht Teil dieser TR-03161-Selbstdeklaration; siehe [`DIGA_ROADMAP.md` § 3](DIGA_ROADMAP.md) |
| **L6** | **Klinischer Wirknachweis** (positive Versorgungseffekte nach § 139e Abs. 2 SGB V) | DiGA-Listung erfordert RCT oder Erprobungslistung | nicht Teil dieser Selbstdeklaration; siehe [`DIGA_ROADMAP.md` § 4](DIGA_ROADMAP.md) |

> Lücken **L1–L4** liegen im Verantwortungsbereich des Herstellers und werden vor oder gemeinsam mit der Prüfstellen-Beauftragung adressiert. **L5–L6** sind regulatorisch parallele Pfade, die für eine BSI-TR-03161-Zertifizierung **nicht erforderlich** sind, aber für die DiGA-Listung beim BfArM **zusätzlich** vorgelegt werden müssen.

---

## Übergabe-Hinweis

Dieses Dossier ist als **Eingabe** für die Prüfstelle konzipiert. Die Prüfstelle wird im Zuge ihres eigenen Audits:

1. die Angaben dieses Dossiers gegen die TR-03161-1 Anforderungen verifizieren
2. eigene Werkzeug-Tests durchführen (SAST, MobSF, ggf. Pen-Test)
3. den **Prüfbericht** erstellen
4. den Prüfbericht an das BSI übermitteln, das daraufhin das Zertifikat erteilt

Empfohlene Prüfstellen (Stand: Mai 2026, siehe [`PARTNER_SHORTLIST.md` § B.1](PARTNER_SHORTLIST.md#b1-bsi-anerkannte-prüfstellen-für-tr-03161)):

- **secuvera GmbH** (Gäufelden) — DiGA-Track-Record (Referenz: kontina, BSI-K-TR-0832, April 2026)
- **TÜV Informationstechnik (TÜViT)** (Essen)
- **SRC Security Research & Consulting** (Bonn)

Der Hersteller ersucht die Prüfstelle, etwaige offene Punkte direkt mit ihm zu klären unter `security@twobreath.com`.

---

**Autor:** Matthias Buchhorn-Roth
**Letzte Änderung:** 2026-05-03
**Reproduktion:** dieses Dokument wird Git-versioniert; Diff über die Zeit als Audit-Trail.
