# Werkzeug-Empfehlungen je TR-03161-1-Anforderung

> Konkrete Werkzeug-Vorschläge **pro Anforderung** und **pro Lebenszyklus-Phase** — als Anhang zum [`BSI_BERICHT.md`](BSI_BERICHT.md) und als Diskussionsgrundlage für Empfehlung **E3** (Plattform-Aussagen-Katalog) bzw. **E2** (Einreichungsformat).

**Stand:** 2026-05-02 · Geltung: BSI TR-03161-1 v3.0 (Mobile Anwendungen).

---

## 1. Lebenszyklus-Phasen

| Phase | Ort | Akteur:in | Typische Auslöser |
| --- | --- | --- | --- |
| **D — Design** | Repo-Dokumente, ADR-Verzeichnis | Architekt:in, Datenschutzbeauftragte:r | initial + bei Architekturänderung |
| **C — Code/IDE** | lokale Entwicklungsumgebung | Entwickler:in | jedes Editieren |
| **P — Pre-Commit** | Git-Hook | Entwickler:in | jeder `git commit` |
| **B — Build/CI** | GitHub Actions, GitLab CI | CI-Runner | jeder Push / PR / nightly |
| **R — Pre-Release** | CI nach Build, vor Veröffentlichung | CI-Runner + manueller QA-Gate | jeder Release-Kandidat |
| **L — Laufzeit / Live** | Produktivumgebung | Monitoring-System | fortlaufend |
| **Z — Periodisch** | Sicherheits-Plan | Security-Lead | Plan-getrieben (z. B. monatlich, quartalsweise) |
| **A — Audit** | Prüfstelle | Auditor:in | im Re-Zertifizierungsfall |

In der nachfolgenden Matrix steht je Anforderung an erster Stelle die **primäre** Phase (Hauptbeleg), danach optional weitere Phasen, in denen das Werkzeug zusätzlich Wirkung hat.

## 2. Werkzeug-Kategorien (Kurzlexikon)

| Werkzeug | Klasse | Output-Format | Anwendbar auf |
| --- | --- | --- | --- |
| [`gitleaks`](https://github.com/gitleaks/gitleaks) | Secret-Scan | SARIF/JSON | Quellcode + Git-History |
| [`trufflehog`](https://github.com/trufflesecurity/trufflehog) | Secret-Scan (tiefer) | JSON | Quellcode + Container-Images |
| [`detect-secrets`](https://github.com/Yelp/detect-secrets) | Secret-Scan (Pre-Commit-fokussiert) | JSON | Pre-Commit |
| [`SwiftLint`](https://github.com/realm/SwiftLint) | Linter | GitHub-Annotations / Junit | Swift |
| [`semgrep`](https://semgrep.dev) | SAST (regelbasiert) | SARIF | Multi-Sprach |
| [CodeQL](https://codeql.github.com) | SAST (datenfluss) | SARIF | Swift (beta), JS, Py, … |
| [`Periphery`](https://github.com/peripheryapp/periphery) | Dead-Code-Detect | JSON | Swift |
| [`syft`](https://github.com/anchore/syft) | SBOM-Erzeuger | CycloneDX, SPDX | beliebig |
| [`osv-scanner`](https://github.com/google/osv-scanner) | Dependency-CVE | SARIF | Lock-Files |
| [`grype`](https://github.com/anchore/grype) | Dependency-CVE | SARIF | SBOM, Container |
| [`scancode-toolkit`](https://github.com/aboutcode-org/scancode-toolkit) | Lizenz-Compliance | JSON | Quellbäume |
| [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) | Mobile-Binär-Analyse (statisch + dyn) | JSON / HTML | iOS `.ipa`, Android `.apk` |
| [`frida`](https://frida.re/) / [`objection`](https://github.com/sensepost/objection) | Runtime-Manipulation | Logs | iOS / Android |
| [`testssl.sh`](https://github.com/drwetter/testssl.sh) | TLS-Posture | JSON | HTTPS-Endpunkte |
| [Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory-cli) | HTTP-Header | JSON | Web-Endpunkte |
| [OWASP ZAP](https://www.zaproxy.org/) | DAST | SARIF / JSON | HTTP-Endpunkte |
| [`presidio`](https://github.com/microsoft/presidio) | PII-Detect | JSON | Logs / Texte |
| [`cosign`](https://github.com/sigstore/cosign) | Signatur / Verifizierung | OCI-Annotation, in-toto | Artefakte |
| [SLSA `slsa-verifier`](https://github.com/slsa-framework/slsa-verifier) | Build-Provenienz | in-toto | Build-Artefakte |
| Apple Notarisation | Code-Signatur + Notarisierung | Apple Receipt | iOS/macOS |
| [`threagile`](https://threagile.io/) | Threat-Model-as-Code | JSON / SVG / Excel | YAML-Modell |
| [Apple App Attest](https://developer.apple.com/documentation/devicecheck) | Geräte-Integrität | DeviceCheck-Zertifikat | iOS-Laufzeit |
| Apple Privacy Report | Privacy-Manifest-Validierung | Apple-internes Format | iOS-Build |

## 3. Werkzeug-Matrix je Anforderung (alle 127)

> Lesehilfe: **Werkzeug** = primäre Empfehlung; **Phase** = wann der Beleg entsteht; **Klasse** = R/D/P/M aus der Compliance-Matrix; **Hinweis** = Implementations-Pointer (Konzept oder Patch).

### 3.1 Prüfaspekt (1) — Anwendungszweck (`O.Purp_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Purp_1 | Markdown-Konzept (Datenschutzkonzept) + App-Store-Beschreibung + In-App-Onboarding | D, R | M+D | [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) § 4 + [`patches/PATCHES.md`](patches/PATCHES.md) § 5 |
| O.Purp_2 | [Apple PrivacyInfo.xcprivacy](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files) + manuelle Review der [HealthKit](https://developer.apple.com/documentation/healthkit)-Berechtigungen | B, A | M | `PrivacyInfo.xcprivacy` im Repo |
| O.Purp_3 | iOS-System-Dialog + In-App-Erstinformation + ConsentTracker | C, B, R | M+D | [`patches/PATCHES.md`](patches/PATCHES.md) § 5 + § 9 |
| O.Purp_4 | XCUITest-Szenario (Verweigerung → kein Datenzugriff); [HealthKit](https://developer.apple.com/documentation/healthkit)-API-Erzwingen plattformseitig | B | D | [Apple HealthKit-API](https://developer.apple.com/documentation/healthkit) Code-Review |
| O.Purp_5 | iOS-Settings + In-App-Pairing-Aufhebung + In-App-Datenlöschung | C, R | M+D | [`patches/PATCHES.md`](patches/PATCHES.md) § 7 + § 9 |
| O.Purp_6 | ConsentLog-Modell (SwiftData) + In-App-Verlauf + JSON-Export | C, B | M+D | [`concepts/05-einwilligungsverzeichnis.md`](concepts/05-einwilligungsverzeichnis.md) + [`patches/PATCHES.md`](patches/PATCHES.md) § 9 |
| O.Purp_7 | `syft`-SBOM + manuelle Inventarisierung Apple-Frameworks | B, A | D | leere SBOM = trivialer Beleg |
| O.Purp_8 | Code-Review + DLP-Probe mit `presidio` über Logs/Outputs | B, A | M | künftig in CI |
| O.Purp_9 | UI-Review + Threat-Model-Cross-Check | D, A | M | [`concepts/03-threat-model.md`](concepts/03-threat-model.md) |

### 3.2 Prüfaspekt (2) — Architektur (`O.Arch_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Arch_1 | `threagile`-YAML + ADR-Verzeichnis + Secure-Coding-Standards-Dokument | D, A | M+D | [`concepts/03-threat-model.md`](concepts/03-threat-model.md) + [`concepts/04-secure-coding-standards.md`](concepts/04-secure-coding-standards.md) |
| O.Arch_2 | Datenfluss-Diagramm (z. B. Mermaid) + Trust-Boundary-Tabelle | D, A | M | [`concepts/02-datenlebenszyklus.md`](concepts/02-datenlebenszyklus.md) |
| O.Arch_3 | Krypto-Inventar-YAML, abgeglichen via `semgrep` mit `CryptoKit`/`CommonCrypto`-Verwendungen | D, B | M | [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md); App-seitig leer |
| O.Arch_4 | iOS Data Protection Class A (Plattform) + iCloud-Backup-Verschlüsselung; manuelle Auditierung | B, A | D | Plattform-Aussage |
| O.Arch_5 | Code-Review + [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) (Plist-/Entitlements-Audit) | B, A | D | MobSF in CI (siehe [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) § 4) |
| O.Arch_6 | Apple Code-Signing + Apple Notarisation; zusätzlich `cosign` für Evidence-Bundle | R | D | Apple-Pfad standard |
| O.Arch_7 | `syft`-SBOM-Beleg + Code-Review | B, A | D | trivial bei null Drittanbieter-Code |
| O.Arch_8 | Code-Grep auf `WKWebView`/`WKUserContentController`; semgrep-Regel | B | D | TwoBreath: keine WebView |
| O.Arch_9 | `SECURITY.md` mit verschlüsseltem Kontaktkanal + GitHub Private Vulnerability Reporting | D, R | M | [`SECURITY.md`](SECURITY.md) |
| O.Arch_10 | Apple App-Store-Update-Pfad + Mindest-Build-Prüfung in App | R, L | R | Plattform-vermittelt |
| O.Arch_11 | Apple App Store (einzige Distributionsquelle) | R | D | Konvention |
| O.Arch_12 | Marketing-Site-Link + QR-Code-Material | R | M | `twobreath.com` |

### 3.3 Prüfaspekt (3) — Quellcode (`O.Source_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Source_1 | [`semgrep`](https://semgrep.dev) (`p/swift`, `p/security-audit`) + Code-Review | C, B | D | [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) § 4 |
| O.Source_2 | [`semgrep`](https://semgrep.dev) + typisierte Codable-Schnittstellen | C, B | D | [`concepts/04-secure-coding-standards.md`](concepts/04-secure-coding-standards.md) § 1 |
| O.Source_3 | benutzerdefinierte [`SwiftLint`](https://github.com/realm/SwiftLint)-Regel + [`presidio`](https://github.com/microsoft/presidio)-Sample über Logs | P, B, Z | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 10 |
| O.Source_4 | Release-Build-Test (manuelle UI-Probe in QA) + `semgrep` | C, B, R | D | |
| O.Source_5 | Swift ARC + Code-Review | C | D | [`concepts/04-secure-coding-standards.md`](concepts/04-secure-coding-standards.md) § 4 |
| O.Source_6 | Swift hat ARC — Anforderung n/a; semgrep als Rückversicherung gegen `unsafe*`-Verwendung | B | D | |
| O.Source_7 | Datenschutz-Konzept (Aufbewahrung) + In-App-Löschung | D, C | M+D | [`concepts/01-datenschutzkonzept.md`](concepts/01-datenschutzkonzept.md) § 7 + [`patches/PATCHES.md`](patches/PATCHES.md) § 7 |
| O.Source_8 | `gitleaks`, `trufflehog`, semgrep-Regel `debug-url` | P, B | D | bereits aktiv + erweiterbar |
| O.Source_9 | `STRIP_INSTALLED_PRODUCT`/`STRIP_SWIFT_SYMBOLS` in `project.yml` Release-Konfig | B, R | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 8 |
| O.Source_10 | `SwiftLint --strict` + `semgrep` + `Periphery` (Dead-Code) | C, B | D | + `swiftlint analyze` |

### 3.4 Prüfaspekt (4) — Drittanbieter-Software (`O.TrdP_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.TrdP_1 | `syft` → CycloneDX SBOM + signierte Veröffentlichung pro Release | B, R | D | bei null Deps trivial |
| O.TrdP_2 | `osv-scanner` mit Versions-Pinning aus `Package.resolved` | B | D | derzeit n/a |
| O.TrdP_3 | `osv-scanner` + [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) + `npm audit` | B, Z | D | bereits aktiv für Build-Tools |
| O.TrdP_4 | Dependabot-Auto-PR + Sicherheits-Konzept-Doc | B, R | D+M | + Grace-Period-Tabelle |
| O.TrdP_5 | manuelle Vendor-Bewertung; SLSA-Provenienz-Check beim Beziehen | D, B | M | bei null Deps trivial |
| O.TrdP_6 | Code-Review + DLP-Probe | B, A | M | n/a heute |
| O.TrdP_7 | `semgrep` + Codable-Validierung über Drittanbieter-Schnittstellen | B | D | n/a heute |
| O.TrdP_8 | Lifecycle-Bewertung; `osv-scanner` mit `--include-deprecated` | Z | P | n/a heute |

### 3.5 Prüfaspekt (5) — Kryptographische Umsetzung (`O.Cryp_*`, `O.Rand_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Cryp_1 | `gitleaks` (CI + weekly cron) mit Custom-Regeln | P, B, Z | D | `.gitleaks.toml` |
| O.Cryp_2 | semgrep-Regelsatz „crypto-bad-practice“ (z. B. `MD5`, `arc4random`) + Code-Review | B | D | [BSI TR-02102](https://www.bsi.bund.de/dok/TR-02102)-Konformitäts-Check |
| O.Cryp_3 | Krypto-Inventar-YAML, abgeglichen mit Code-Scan | D, B | D | Plattform-vermittelt |
| O.Cryp_4 | manuelle Schlüssel-Zweck-Inventarisierung; n/a bei reiner Plattform-Delegierung | D | M | [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md) § 6 |
| O.Cryp_5 | [BSI TR-02102-1](https://www.bsi.bund.de/dok/TR-02102)-Abgleich; Plattform-Aussage je iOS-Version | A, Z | M | halbjährliche Re-Validierung |
| O.Cryp_6 | Plattform-Aussage (Secure Enclave); MobSF-Plist-Audit | B, A | D | |
| O.Cryp_7 | Plattform-Aussage; semgrep-Regel gegen Userspace-Krypto-Handling | B | D | |
| O.Rand_1 | semgrep-Regel: `arc4random` blockieren, `SecRandomCopyBytes` zulassen | C, B | D | bereits in Coding-Standards |

### 3.6 Prüfaspekt (6) — Authentisierung (`O.Auth_*`, `O.Pass_*`)

> Bei TwoBreath durchgängig **➖ nicht anwendbar** (keine Konten/Passwörter). Werkzeuge gelistet für die generelle Empfehlung.

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Auth_1 | ADR „Auth-Konzept" + Threat-Model-Auth-Anteil | D | M | [TR-03107-1](https://www.bsi.bund.de/dok/TR-03107) als Referenz |
| O.Auth_2–O.Auth_15 | Auth0/Keycloak/oAuth2-Proxy-Konfig + Postman-/`schemathesis`-Vertragstests + JWT-Claim-Assertions in Tests | C, B, L | D+R | + Logging via `os.Logger` |
| O.Auth_3 (MFA) | Apple Sign-In, FIDO2 (z. B. `WebAuthn4Swift`); MFA-Schritte in XCUITest | C, B | D | |
| O.Auth_5 (Kontextfaktoren) | Risk-Engine-Bibliothek; SIEM-Anomaly-Detect | L | R | |
| O.Auth_7 (Brute-Force) | Server-seitige Rate-Limits (ggf. Auth0-Policy); Last-Test mit [`k6`](https://k6.io/) | B, L | R+D | |
| O.Auth_13 (Token als sensibel) | Keychain (iOS), `Security.framework` | C | D | |
| O.Pass_1–O.Pass_5 | [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)-Konformes Policy-Set; bcrypt/scrypt/argon2 ([libsodium](https://doc.libsodium.org/)); semgrep-Regel | C, B | D | |

### 3.7 Prüfaspekt (7) — Datensicherheit (`O.Data_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Data_1 | PrivacyInfo.xcprivacy + Default-Konfig-Review | B, A | D | |
| O.Data_2 | iOS Data Protection (Plattform); Schutzbedarfsanalyse als Markdown | D, B | D+M | [`concepts/01`](concepts/01-datenschutzkonzept.md) |
| O.Data_3 | MobSF-Plist-/Entitlements-Audit; HealthKit-Audit | B, A | D | |
| O.Data_4 | Code-Grep auf `URLScheme`, Entitlements-Audit | B | D | |
| O.Data_5 | Datenschutzkonzept + Auto-Löschungs-Strategie | D | M | |
| O.Data_6 | Datenminimierungs-Audit (Felder vs. Zweck) | D, A | M | |
| O.Data_7 | n/a ohne Backend; bei Hinzufügen: [TR-03161-3](https://www.bsi.bund.de/dok/TR-03161) + [BSI C5](https://www.bsi.bund.de/dok/C5) | D | M | Trigger dokumentiert |
| O.Data_8 | Code-Grep auf `AVCaptureSession`/`UIImagePickerController`; EXIF-Strip-Bib | C, B | D | n/a heute |
| O.Data_9 | Sandbox-Audit; iOS-Foto-Berechtigung | B | D | n/a heute |
| O.Data_10 | `.privacySensitive()` + `.textContentType(.oneTimeCode)` | C, B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 3 |
| O.Data_11 | `.textSelection(.disabled)` | C | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 4 |
| O.Data_12 | iOS Secure Enclave (Plattform); Code-Audit auf Export-Pfade | B | D | |
| O.Data_13 | `AppSwitcherShield`-ViewModifier (`scenePhase`) | C, B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 2 |
| O.Data_14 | iOS Data Protection Class A (`NSFileProtectionComplete`) | B, R | D | Plattform |
| O.Data_15 | iOS UID-abhängige Schlüsselableitung (Plattform) | R | D | Plattform |
| O.Data_16 | iOS-Sandbox-Removal beim Uninstall | R | D | Plattform |
| O.Data_17 | In-App-Datenlösch-UI + `DataEraseService` | C, B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 7 |
| O.Data_18 (KANN) | Backend-Kill-Switch via Push (mit Hintergrundsystem) | L | D | n/a heute |

### 3.8 Prüfaspekt (8) — Kostenpflichtige Ressourcen (`O.Paid_*`)

> Bei TwoBreath durchgängig **➖** (keine kostenpflichtigen Funktionen). Empfehlung gelistet.

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Paid_1 | App Store Pricing-Beschreibung + In-App-UI | D, R | D+M | |
| O.Paid_2 | StoreKit-Bestätigungs-Dialog (Apple-vermittelt) | C | D | |
| O.Paid_3 | Apple Permission-API + Dialog | C | D | |
| O.Paid_4 | Apple StoreKit Subscription | C | D | |
| O.Paid_5 | Apple Subscription-Cancel-Pfad | C | D | |
| O.Paid_6 | StoreKit-Server-Notifications + Backend-Storage | L | D | |
| O.Paid_7 | Backend-PCI-Konzept | D | M | |
| O.Paid_8 | In-App Receipts View | C | D | |
| O.Paid_9 | App Store Server API (Server-Verify) | L | D | |
| O.Paid_10 | bei Drittanbieter: § 3.4 Werkzeuge | B | D | |

### 3.9 Prüfaspekt (9) — Netzwerkkommunikation (`O.Ntwk_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Ntwk_1 | App: MPC `encryptionPreference: .required` + Pairing-Code; Backend (sobald vorhanden): mTLS via Service-Mesh | C, L | D | [`concepts/07`](concepts/07-netzwerk-sicherheitskonzept.md) § 3 |
| O.Ntwk_2 | `testssl.sh` + Mozilla Observatory (Site); ATS-Default (App) | B, L, Z | R+D | |
| O.Ntwk_3 | Apple `Network.framework` + ATS; bei Backend: `URLSession` | C | D | |
| O.Ntwk_4 | bei Backend: [TrustKit](https://github.com/datatheorem/TrustKit) (iOS) + Code-Grep | C, B | D | n/a heute |
| O.Ntwk_5 | bei Backend: `URLSession` Cert-Validation (Plattform) + manuelle Test | B | D | n/a heute |
| O.Ntwk_6 | bei Backend: HMAC oder JWS-Signaturen + `URLSession`-Validation | C, L | D | n/a heute |
| O.Ntwk_7 | `Info.plist`-Audit auf ATS-Ausnahmen; MobSF | B | D | bereits sicher |
| O.Ntwk_8 | `os.Logger`-Subsystem; bei Backend: zentrale Loki/Splunk | L, Z | R | [`concepts/07`](concepts/07-netzwerk-sicherheitskonzept.md) § 6 |

### 3.10 Prüfaspekt (10) — Plattformspezifische Interaktionen (`O.Plat_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Plat_1 | In-App-Hinweis-UI + `LAContext.canEvaluatePolicy` | C, B | D+M | [`patches/PATCHES.md`](patches/PATCHES.md) § 5 |
| O.Plat_2 | MobSF-Entitlements-Audit + `Info.plist`-Diff in PR | B | D | |
| O.Plat_3 | `Info.plist` Usage-Strings (verpflichtend); MobSF | C, B | D | |
| O.Plat_4 | semgrep-Regel auf `UNNotificationContent.body` mit sensiblen Quellen | B | D | |
| O.Plat_5 | UNUserNotificationCenter-Dialog (Plattform); In-App-Toggle | C | D | n/a heute |
| O.Plat_6 | iOS-Sandbox + HealthKit-Berechtigung | B | D | Plattform |
| O.Plat_7 | Code-Review IPC; semgrep-Regel auf `XPC`/`UIPasteboard` | B | D | |
| O.Plat_8 | bei WebView: `WKWebpagePreferences.javaScriptEnabled = false`; CSP-Header | C, B | D | n/a heute |
| O.Plat_9 | `AppSwitcherShield`-ViewModifier | C, B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 2 |
| O.Plat_10 | bei WebView: WKWebView-Konfig + URL-Schema-Filter | C | D | n/a |
| O.Plat_11 | bei WebView: `WKWebsiteDataStore.removeData(...)` | C | D | n/a |
| O.Plat_12 | Swift ARC; Code-Review auf eigene Buffer | C | D | |
| O.Plat_13 | `SecurityInfoView` (Settings-Bildschirm) | C, B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 5 |
| O.Plat_14 | bei Backend: zentrale Logs Loki + Alerting | L | R | n/a heute |

### 3.11 Prüfaspekt (11) — Resilienz (`O.Resi_*`)

| ID | Werkzeug | Phase | Klasse | Hinweis |
| --- | --- | --- | --- | --- |
| O.Resi_1 | `SecurityInfoView` (gemeinsam mit O.Plat_13) | C, B | D+M | [`patches/PATCHES.md`](patches/PATCHES.md) § 5 |
| O.Resi_2 | Mindest-iOS-Version (project.yml `deploymentTarget`); halbjährliche Re-Validierung | D, B, Z | D+M | [`concepts/08`](concepts/08-resilienz-haertungskonzept.md) § 3 |
| O.Resi_3 | `assertNotDebugged()` via `sysctl(KERN_PROC, P_TRACED)` | C, B, R | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 1 |
| O.Resi_4 | iOS-Sandbox; n/a außer Jailbreak | B | D | Begründung in [`concepts/08-resilienz-haertungskonzept.md`](concepts/08-resilienz-haertungskonzept.md) § 5.3 |
| O.Resi_5 | Apple App Attest (`DCAppAttestService`) — Stub | C | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 6 (inaktiv) |
| O.Resi_6 | bei Backend: TrustKit-Pinning + App-Attest-Verify | C, L | D | n/a heute |
| O.Resi_7 | App Attest pro sensitiver Aktion | C, L | D | wartet auf Backend |
| O.Resi_8 | Symbol-Stripping (`STRIP_*`) + Apple-Toolchain-Defaults | B | D | [`patches/PATCHES.md`](patches/PATCHES.md) § 8 |
| O.Resi_9 | iOS-only — n/a | — | D | Begründung in [`concepts/08-resilienz-haertungskonzept.md`](concepts/08-resilienz-haertungskonzept.md) § 9 |
| O.Resi_10 | Swift Testing Unit-Tests (BreathingEngine pause/resume); Audio-Interruption-Handling | B, Z | D+P | bereits aktiv in `ci.yml` |

## 4. Aggregat: Werkzeuge nach Phase

Wer eine **Phase** umsetzen möchte, findet hier die Hauptwerkzeuge im Schnellzugriff.

### 4.1 Design (D)

[`threagile`](https://threagile.io/) · ADR-Verzeichnis · Markdown-Konzepte · Mermaid-Datenfluss-Diagramme · DSFA-Vorlage

### 4.2 Code/IDE (C)

[`SwiftLint`](https://github.com/realm/SwiftLint) (mit Custom-Regeln) · [`semgrep`](https://semgrep.dev) (CLI lokal) · [`gitleaks`](https://github.com/gitleaks/gitleaks) Pre-Commit · [`swiftformat`](https://github.com/nicklockwood/SwiftFormat) · IDE-Integrationen

### 4.3 Pre-Commit (P)

[`husky`](https://typicode.github.io/husky/)-Hook → [`gitleaks`](https://github.com/gitleaks/gitleaks), [`swiftformat`](https://github.com/nicklockwood/SwiftFormat), `swiftlint --quiet`, [`detect-secrets`](https://github.com/Yelp/detect-secrets)

### 4.4 Build/CI (B)

[`SwiftLint --strict`](https://github.com/realm/SwiftLint) · [`semgrep`](https://semgrep.dev) (`p/swift`, `p/security-audit`) · [`gitleaks`](https://github.com/gitleaks/gitleaks) · [`syft`](https://github.com/anchore/syft) SBOM · [`osv-scanner`](https://github.com/google/osv-scanner) · [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) (statisch) · `npm audit` (Build-Toolchain) · `xcodebuild test`

### 4.5 Pre-Release (R)

[Apple Notarisation](https://developer.apple.com/documentation/xcode/notarizing-macos-software-before-distribution) · [`cosign`](https://github.com/sigstore/cosign) für Evidence-Bundle · Symbol-Stripping-Verifizierung · `nm`/`otool`-Sanity-Check · finaler [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF)-Lauf

### 4.6 Laufzeit / Live (L)

[`testssl.sh`](https://github.com/drwetter/testssl.sh) (Marketing-Site, scheduled) · [Mozilla HTTP Observatory](https://github.com/mozilla/http-observatory-cli) · [Apple App Attest](https://developer.apple.com/documentation/devicecheck) · Loki/Splunk (mit Backend)

### 4.7 Periodisch (Z)

[`gitleaks`](https://github.com/gitleaks/gitleaks) weekly cron · TLS-Re-Scan · Pen-Test · Restore-Drill · Backup-Restore-Test · [`osv-scanner`](https://github.com/google/osv-scanner) über externe Manifest-Datei · iOS-Major-Version-Re-Validierung (halbjährlich)

### 4.8 Audit (A)

signiertes Evidence-Bundle ([CycloneDX](https://cyclonedx.org/) + [SARIF 2.1](https://sarifweb.azurewebsites.net/) + JUnit + [`cosign`](https://github.com/sigstore/cosign) + [PROV-O](https://www.w3.org/TR/prov-o/)) · diff gegen vorigen Audit · Konzeptdokumente in [`concepts/`](concepts/) · Plattform-Aussagen (BSI E3-Vorschlag)

## 5. Werkzeug-Empfehlung an das BSI (E2-Konkretisierung)

Aus den Werkzeugen oben ergibt sich der konkrete Vorschlag für ein **standardisiertes Einreichungsformat „Nachweispaket TR-03161"**:

```
nachweis-bundle/
├── manifest.json                # PROV-O: TR-Version, App-Version, Build-Hash, Zeitstempel
├── manifest.json.sig            # cosign-Signatur
├── sbom.cdx.json                # CycloneDX (syft)
├── reports/
│   ├── semgrep.sarif
│   ├── swiftlint.junit.xml
│   ├── gitleaks.sarif
│   ├── osv-scanner.sarif
│   ├── mobsf.json
│   ├── testssl.json
│   └── observatory.json
├── tests/
│   ├── iphone-unit.junit.xml
│   ├── watch-unit.junit.xml
│   └── playwright.junit.xml
├── concepts/                    # frozen snapshot der Konzeptdokumente
│   ├── 01-datenschutzkonzept.md
│   └── …
└── matrix.json                  # 127-Zeilen-Status pro O.* mit Werkzeug-Beleg-Referenz
```

Jeder Eintrag in `matrix.json` referenziert über Pfad + sha256 die zugehörige Beweis-Datei in `reports/` oder `concepts/`. Eine Prüfstelle kann so:

1. das Bundle gegen `cosign verify` validieren,
2. das Manifest gegen die TR-Version prüfen,
3. den Diff zu einer Vor-Einreichung berechnen (welche `O.*` haben sich seit dem letzten Audit verändert?),
4. Stichproben-Belege gegen die Status-Aussagen abgleichen.

Das ersetzt nicht die menschliche Bewertung, aber es ändert die **Form** der Einreichung von „PDF-Lesen" zu „Diff-Lesen" — was Zertifizierungs-Aufwand strukturell senkt.

---

**Querverweis:** [`BSI_BERICHT.md`](BSI_BERICHT.md) (Empfehlungen E1–E5), [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) (drop-in `security.yml`), [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) (per-row Status).
