# Kryptographiekonzept (TwoBreath)

> Schließt: O.Arch_3, O.Cryp_1, O.Cryp_2, O.Cryp_3, O.Cryp_4, O.Cryp_5, O.Cryp_6, O.Cryp_7, O.Rand_1.
> Stand: 2026-05-02 · Bezug: [BSI TR-02102-1/-2](https://www.bsi.bund.de/dok/TR-02102).

## 1. Aussage in einem Satz

> **TwoBreath enthält keine eigene Implementierung kryptographischer Primitive und keine eigenen kryptographischen Schlüssel.** Sämtliche Kryptographie wird durch Apple-Plattform-Mechanismen erbracht. Das Konzept dokumentiert die genutzten Plattform-Mechanismen und ihre Konfiguration.

## 2. Erfasste Krypto-Verwendungen

| # | Verwendung | Mechanismus | Konfiguration |
| --- | --- | --- | --- |
| K1 | Verschlüsselung der Sandbox-Dateien (SessionLog, ConsentLog, PartnerPairing) | iOS Data Protection Class A (`NSFileProtectionComplete`) | Plattform-default; nicht abschaltbar in `project.yml` |
| K2 | Verschlüsselung HealthKit-Speicher | Apple HealthKit-Store | Plattform-vermittelt |
| K3 | Verschlüsselung iCloud-Backup | iCloud-Backup-Schlüssel + Account-Schlüssel | Plattform-vermittelt; Nutzer:in steuert |
| K4 | Verschlüsselung MPC-P2P-Verbindung | MultipeerConnectivity, `MCSession.encryptionPreference: .required` | App-Code: `PairingService.swift` |
| K5 | TLS für ATS-Verbindungen (Default-Beschränkung der App) | iOS App Transport Security | `Info.plist` ohne `NSAllowsArbitraryLoads` |
| K6 | Code-Signatur des App-Bundles | Apple Code-Signing | App Store-Pfad |
| K7 | Notarisation des App-Bundles | Apple Notarisation | App-Store-Connect-Workflow |

## 3. Genutzte Primitive (durch die Plattform)

Apple macht in seiner Dokumentation Aussagen über die intern verwendeten Algorithmen. Die folgende Tabelle ist eine Plattform-Aussage; sie wird mit jeder iOS-Major-Version validiert.

| Mechanismus | Algorithmus(en) (Apple-Aussage) | TR-02102-Konformität |
| --- | --- | --- |
| Data Protection Class A | AES-256-XTS, abgeleitet aus Passcode + UID-Schlüssel | konform |
| Secure Enclave (für Schlüsselableitung der Class A) | NIST P-256 + AES-GCM | konform |
| MultipeerConnectivity-Sitzungs-Verschlüsselung | TLS-DTLS (Apple-vetted), AES-GCM | konform |
| ATS / TLS | TLS 1.2+, AEAD-Cipher-Suiten (siehe Apple-Doku) | konform mit TR-02102-2-Schlüsselempfehlungen |
| Code-Signatur | RSA-2048 oder ECDSA P-256 | konform |

## 4. Schlüsselmaterial (`O.Cryp_1`)

| Schlüssel-Klasse | Lebensdauer | Speicherort | Hersteller-Eingriff |
| --- | --- | --- | --- |
| Data-Protection-Datei-Schlüssel | bis Geräte-Wipe | abgeleitet aus Passcode + UID | keiner |
| MPC-Sitzungs-Schlüssel | pro Sitzung, flüchtig | Arbeitsspeicher | keiner |
| App-Signatur-Schlüssel | pro Apple-Developer-Account | Apple Developer Portal + Mac-Keychain | nur Build/Release |

**Es gibt keine vom Hersteller in den Quellcode eingebetteten geheimen oder privaten Schlüssel.** Dies wird durch `gitleaks` mit Custom-Regeln in `.gitleaks.toml` (CI-blockierend) durchgesetzt — siehe `../CI_CD_SECURITY.md` § 1.

## 5. Schlüsseltrennung (`O.Cryp_4`)

Da keine Schlüssel im Hersteller-Verfügungsbereich liegen, ist eine Schlüsseltrennung im engeren Sinn nicht herstellerseitig anwendbar. Die genutzten Plattform-Schlüssel haben jeweils einen eindeutigen Zweck (Datei-Schutz, Sitzung, Signatur). Eine Mehrfachnutzung gleicher Schlüssel über Zwecke hinweg findet nicht statt.

## 6. Schlüssel-Stärke (`O.Cryp_5`)

Apple-Plattform-Defaults entsprechen TR-02102-1-Empfehlungen (Stand 2024–2025). Mit jeder iOS-Major-Version wird im Rahmen der jährlichen Sicherheits-Review (siehe [`08-resilienz-haertungskonzept.md`](08-resilienz-haertungskonzept.md) § 5) geprüft, dass diese Aussage weiterhin gilt.

## 7. Schutz vor Manipulation und Offenlegung (`O.Cryp_6`, `O.Cryp_7`)

| Schicht | Schutz |
| --- | --- |
| Datei-Schutz-Schlüssel | im Secure Enclave; Hardware-isoliert |
| MPC-Sitzungs-Schlüssel | in Apple-Plattform-Speicher; nicht App-zugreifbar |
| App-Signatur-Schlüssel | im Mac-Keychain, ausschließlich beim Release-Vorgang |
| Krypto-Operationen | innerhalb Apple-Plattform-Bibliotheken (CryptoKit, CommonCrypto, Network), die in dafür geschützten Prozessen oder Hardware-Bereichen ablaufen |

## 8. Zufallswerte (`O.Rand_1`)

Die App selbst erzeugt keine kryptographisch relevanten Zufallswerte. Falls ein zukünftiger Anwendungsfall (z. B. lokal generierter Pairing-Code) Zufall benötigt, wird ausschließlich Apples `SystemRandomNumberGenerator` oder `SecRandomCopyBytes` verwendet, beide CSPRNGs.

SwiftLint-Regel `arc4random` blockiert die Verwendung der älteren BSD-API.

## 9. Ergänzende Maßnahmen (`O.Arch_3`)

Eine ausgearbeitete Schlüsselrichtlinie im klassischen Sinn (Lebenszyklus, Aufgabentrennung, Hash-Algorithmen) ist mangels herstellerseitiger Schlüssel **nicht erforderlich**. Dieses Dokument ersetzt die formal geforderte Richtlinie durch die explizite Plattform-Delegierungs-Aussage. Bei Architekturänderung (Backend, Custom-Crypto) wird eine vollständige Richtlinie nach TR-02102-2 nachgezogen.

## 10. Nachweis-Kette

| Anforderung | Nachweis |
| --- | --- |
| Keine Hard-Coded-Schlüssel | `gitleaks` (CI), `.gitleaks.toml` Custom-Regeln |
| Keine eigenen Krypto-Primitiven | `semgrep`-Regeln für `CommonCrypto`, `CryptoKit` Usage; Code-Review |
| Plattform-Konfiguration korrekt | `MobSF` (geplant) statisch über `.ipa`; verifiziert ATS, Entitlements |
| ITSAppUsesNonExemptEncryption | `Info.plist` per Build-Audit |

---

**Querverweis:** [`07-netzwerk-sicherheitskonzept.md`](07-netzwerk-sicherheitskonzept.md) (TLS/ATS-Details), [`08-resilienz-haertungskonzept.md`](08-resilienz-haertungskonzept.md) (Plattform-Aussagen-Re-Validierung).
