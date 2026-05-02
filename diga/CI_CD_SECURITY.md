# CI/CD-Sicherheitsprüfungen — Bestand, Lücken, Begründung

> Eine berechtigte Frage aus der Lektüre des Berichts: „Unter den verwendeten Werkzeugen vermisse ich Standard-SAST, -DAST und andere Security-Checks im CI/CD." Dieses Dokument beantwortet das im Detail — für die untersuchte Anwendung **und** als generelle Diskussionsgrundlage.

**Stand:** 2026-05-02 v0.2 — Implementierung der anwendbaren Werkzeuge auf den öffentlichen Repo gelandet.

> **Kurz-Status:** Im **öffentlichen Repo `ma3u/TwoBreath`** sind die anwendbaren Werkzeuge jetzt aktiv (siehe § 1.2 + [`.github/workflows/security.yml`](../.github/workflows/security.yml)). Im **privaten App-Repo `ma3u/TwoBreath-app`** bleibt der bisherige Stand (gitleaks, swiftlint, eslint, npm audit, Tests). Die in § 4 vorgeschlagene Erweiterung dort (semgrep, syft, osv-scanner, MobSF) wartet auf einen separaten PR im App-Repo.

---

## Inhaltsverzeichnis

- [1. Was im CI/CD heute aktiv ist](#1-was-im-cicd-heute-aktiv-ist)
- [2. Warum „Standard-SAST/DAST" für diese App teilweise nicht greift](#2-warum-standard-sastdast-für-diese-app-teilweise-nicht-greift)
- [3. Werkzeug-Kategorien und Anwendbarkeits-Bewertung](#3-werkzeug-kategorien-und-anwendbarkeits-bewertung)
- [4. Konkreter Vorschlag: erweiterte security.yml für `TwoBreath-app`](#4-konkreter-vorschlag-erweiterte-securityyml-für-twobreath-app)
- [5. Mapping: Werkzeug → erfüllte TR-03161-Anforderungen](#5-mapping-werkzeug--erfüllte-tr-03161-anforderungen)
- [6. Was iOS-spezifisch ist und in der TR-03161 fehlt](#6-was-ios-spezifisch-ist-und-in-der-tr-03161-fehlt)

---

## 1. Was im CI/CD heute aktiv ist

### 1.1 Privat-Repo `ma3u/TwoBreath-app` (iOS / watchOS)

| Workflow / Job | Werkzeug | Klasse | Trigger | Bewertung |
| --- | --- | --- | --- | --- |
| `security.yml` › *secrets* | [`gitleaks`](https://github.com/gitleaks/gitleaks) | Secret-Scan | push + PR + cron Mo 06:00 UTC | ✅ scharf konfiguriert (Custom-Regeln für ElevenLabs/Apple in `.gitleaks.toml`) |
| `security.yml` › *swiftlint* | [`SwiftLint`](https://github.com/realm/SwiftLint) `--strict` | Linter (kein SAST) | push + PR | ✅ blockierend; opt-in rules erweitert |
| `security.yml` › *eslint* | [`ESLint`](https://eslint.org/) | Linter (JS/Playwright) | push + PR | ✅ aktiv |
| `security.yml` › *dependency-audit* | `npm audit --audit-level=high` | Dependency-CVE | push + PR | 🟡 betrifft nur die Build-/Website-Toolchain (Playwright, ESLint), **nicht** die App selbst |
| `ci.yml` › *iphone-tests* | `xcodebuild test` (Swift Testing) | Funktionstest | push + PR | ✅ |
| `ci.yml` › *watch-tests* | `xcodebuild test` (watchOS) | Funktionstest | push + PR | ✅ |
| `ci.yml` › *website-tests* | Playwright | E2E (Web) | push + PR | ✅ |
| `ci.yml` › *build-release* | `xcodebuild` Release | Build-Gate | push + PR | ✅ |
| Pre-commit | `husky` | Hook-Runner | lokal | ✅ |

**Vorhanden:** Secret-Scan, Linter (SwiftLint, ESLint), Funktionstests, Release-Build. **Nicht vorhanden:** echte SAST/DAST, SBOM-Erzeugung, App-Binary-Scan, App-/TLS-Posture-Scan, Provenienz-Signatur — siehe § 4-Vorschlag.

### 1.2 Öffentliches Repo `ma3u/TwoBreath` (Marketing-Site + DiGA-Dossier) — **NEU mit dieser Pipeline-Erweiterung**

Mit Commit dieser Erweiterung läuft im öffentlichen Repo nun die folgende Pipeline (`.github/workflows/security.yml`):

| Job | Werkzeug | Klasse | Trigger | TR-Bezug |
| --- | --- | --- | --- | --- |
| **secrets** | [`gitleaks`](https://github.com/gitleaks/gitleaks) | Secret-Scan | push + PR + cron Mo 06:00 UTC | O.Cryp_1, O.Source_8 |
| **markdown-lint** | [`markdownlint-cli2`](https://github.com/DavidAnson/markdownlint-cli2) | Doku-Linter | push + PR | Audit-Hygiene |
| **link-check** | [`lychee`](https://github.com/lycheeverse/lychee) | Link-Validierung | push + PR | Audit-Hygiene (Quellenverzeichnisse erreichbar?) |
| **dependency-review** | [`actions/dependency-review-action`](https://github.com/actions/dependency-review-action) | Dependency-CVE bei PR-Diff (skipped auf push/dispatch — by design) | PR | O.TrdP_3 |
| **osv-scan** | [`google/osv-scanner-action`](https://github.com/google/osv-scanner-action) | Manifest-CVE-Scan auf push/PR/cron — Push-/Cron-Variante zu dependency-review; SARIF-Upload in das Code-Scanning-Tab | push + PR + Mo 06:00 UTC | O.TrdP_3 |
| **tls-posture** | [`testssl.sh`](https://github.com/drwetter/testssl.sh) (Docker) | TLS-Konfig-Scan | scheduled + manuell | O.Ntwk_2, O.Ntwk_7 |
| **http-headers** | [Mozilla HTTP Observatory](https://observatory-api.mdn.mozilla.net/) | HTTP-Header-Check | scheduled + manuell | O.Ntwk_2 |

**Konfiguration:**
- `.markdownlint.json` (relaxed default — die zwei real-bedrohlichen Regeln MD026/MD036 bleiben scharf)
- `.markdownlintignore` schließt `diga/regulations/markdown/` aus (eingelesene Drittquellen)
- TLS- und Header-Checks laufen **nicht** bei jedem Push gegen den Server, sondern wöchentlich (Mo 06:00 UTC) bzw. on-demand via `workflow_dispatch`

**Berichte** werden als GitHub-Actions-Artefakte 90 Tage aufbewahrt (`testssl-report`, `observatory-report`).

## 2. Warum „Standard-SAST/DAST" für diese App teilweise nicht greift

Die in vielen DevSecOps-Vorlagen genannte „Standard-Pipeline" ist auf **Backend-Container-Apps** mit großer Drittanbieter-Bibliotheks-Tiefe optimiert. Für die hier untersuchte iOS-Anwendung gilt:

1. **Keine Drittanbieter-Bibliotheken.** TwoBreath verwendet ausschließlich Apple-Frameworks (CLAUDE.md: *"No SPM packages, no CocoaPods, no Carthage"*). Damit liefern Werkzeuge wie `osv-scanner`, `trivy fs`, `snyk` kein Signal für die App-Binärschicht — sie scannen Build-Toolchain, nicht das ausgelieferte Produkt.
2. **Kein Hintergrundsystem.** DAST-Werkzeuge wie OWASP ZAP, `nuclei`, Burp Suite Enterprise zielen auf laufende HTTP-Endpunkte. Die App bietet keine; die Marketing-Website ist statisch (GitHub Pages, kein Auth).
3. **Keine Container.** `trivy image`, `grype`, Docker Scout entfallen.
4. **Keine IaC.** `tfsec`, `checkov`, `kube-bench` entfallen.
5. **iOS-Sandbox.** Klassische OS-Hardening-Checks (CIS, OpenSCAP) werden vom App Store / Apple-Plattform durchgesetzt; sie sind nicht Hersteller-instrumentierbar.

Diese fünf Punkte erklären, warum eine generische DevSecOps-Vorlage hier ohne Anpassung **leerläuft**. Sie heißen aber **nicht**, dass die App keine SAST/DAST-Abdeckung braucht — sie braucht nur die **mobile-spezifischen** Varianten.

## 3. Werkzeug-Kategorien und Anwendbarkeits-Bewertung

Eine vollständige Übersicht. „Anwendbar?" bezieht sich auf TwoBreath in der heutigen Architektur. „TR-Bezug" verlinkt die abgedeckten `O.*`-Anforderungen (siehe [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md)).

### 3.1 SAST — Statische Code-Analyse

| Werkzeug | Sprachen | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- | --- |
| [`SwiftLint`](https://github.com/realm/SwiftLint) | Swift | ✅ | ✅ `--strict` | O.Source_10 | Linter, kein voller SAST — fängt Stilfehler, nicht semantische Schwachstellen |
| [`SwiftLint analyze`](https://github.com/realm/SwiftLint#analyze) | Swift | ✅ | ❌ | O.Source_10 | analyze-Modus benötigt Kompilier-Logs; lohnt für tiefere Inspektion |
| [`semgrep`](https://semgrep.dev) mit Swift-Regelsatz | Swift | ✅ | ❌ | O.Source_1, O.Source_2, O.Source_4, O.Source_8, O.Cryp_1 | strikt empfohlen — pattern-basiert, schnell |
| [CodeQL](https://codeql.github.com/) | Swift (beta) | 🟡 | ❌ | O.Source_* | mächtig, aber Swift-Support eingeschränkt; lohnt prüfen |
| [Periphery](https://github.com/peripheryapp/periphery) | Swift | ✅ | ❌ | O.Source_8 (toter Code) | findet ungenutzten Code → reduziert Angriffsfläche |
| [`bandit`](https://github.com/PyCQA/bandit) | Python | ✅ | ❌ | nur Build-Skripte | nur falls eigene Python-Skripte sicherheitskritisch werden |
| [`gosec`](https://github.com/securego/gosec), `eslint-security` | div. | ➖ | partiell | — | ESLint-Security-Plugin für Playwright-Skripte denkbar |

**Kernfehlend:** ein Swift-fähiger SAST-Schritt jenseits SwiftLint. Empfehlung: `semgrep` mit Apple-Sicherheitsregelsatz.

### 3.2 DAST — Dynamische Anwendungs-Tests

| Werkzeug | Ziel | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- | --- |
| [OWASP ZAP](https://www.zaproxy.org/) | HTTP/HTTPS-Endpunkte | ➖ App, ✅ Website | ❌ | — | App hat keine HTTP-Endpunkte. Website wäre denkbar (statisch, daher minimaler Nutzen) |
| Burp Suite Enterprise | HTTP/HTTPS | ➖ | ❌ | — | wie ZAP |
| [`nuclei`](https://github.com/projectdiscovery/nuclei) | HTTP-Templates | 🟡 Website | ❌ | — | leichtgewichtige Variante für Marketing-Site |
| [`testssl.sh`](https://github.com/drwetter/testssl.sh) | TLS | ✅ Website | ✅ **aktiv** im öffentlichen Repo (scheduled cron Mo + manuell) | O.Ntwk_2, O.Ntwk_7 | wöchentlich gegen `twobreath.com`, JSON-Bericht 90 Tage als Artefakt |
| [Mozilla HTTP Observatory](https://observatory-api.mdn.mozilla.net/) | HTTP-Header (CSP, HSTS) | ✅ Website | ✅ **aktiv** im öffentlichen Repo (scheduled cron Mo + manuell) | O.Ntwk_2 | API-Aufruf, Bericht 90 Tage als Artefakt |

**Status:** TLS- + HTTP-Header-Scan **implementiert** im öffentlichen Repo (siehe § 1.2).

### 3.3 Mobile-spezifische Analyse (das eigentliche „SAST/DAST" hier)

| Werkzeug | Funktion | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- | --- |
| [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) (statisch) | iOS-Binär-Analyse aus `.ipa` | ✅ | ❌ | O.Data_1, O.Data_4, O.Plat_2, O.Plat_3, O.Resi_8 | **dringend empfohlen** — Plist-Audit, Entitlements, Dump-Strings, ATS-Konfig |
| MobSF (dynamisch) | Laufzeitanalyse via Frida | 🟡 | ❌ | O.Data_13, O.Plat_9, O.Resi_8 | benötigt Jailbreak-Gerät; in CI schwierig |
| `objection` / `frida` | Runtime-Manipulation, Pinning-Test | 🟡 | ❌ | O.Ntwk_4, O.Resi_8 | für Cert-Pinning-Verifikation; manuell |
| [`appknox` / `nowsecure`](https://www.appknox.com/) | kommerzielle Mobile-AppSec | 🟡 | ❌ | viele | kostenpflichtig; lohnt für DiGA-Hersteller |
| [`apkid`](https://github.com/rednaga/APKiD) (Android) | Compiler/Packer-Detect | ➖ | — | — | nur Android |
| Apple Privacy Report | Privacy-Manifest-Validierung | ✅ | ❌ | O.Purp_2, O.Purp_7, O.Plat_2 | verfügbar im App-Store-Connect-Workflow |

**Kernfehlend:** **MobSF im CI** — der wichtigste Fehler im aktuellen Stand. MobSF liefert statisch genau das, was eine Prüfstelle ohnehin manuell prüft.

### 3.4 Drittanbieter / Supply Chain

| Werkzeug | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- |
| [`syft`](https://github.com/anchore/syft) → CycloneDX SBOM | ✅ (auch für Build-Tools) | ❌ | O.TrdP_1, O.Source_8 | **empfohlen** — auch wenn Tiefe = 0; signierter Beleg |
| [`osv-scanner`](https://github.com/google/osv-scanner) | ✅ Build, ✅ Website | ❌ | O.TrdP_3 | über `package-lock.json` (Website + Playwright) und `Package.resolved` (App, leer) |
| [`grype`](https://github.com/anchore/grype) | ✅ | ❌ | O.TrdP_3 | Alternative zu `osv-scanner` |
| `npm audit` (Build) | ✅ | ✅ | O.TrdP_3 | bereits aktiv für Build-Toolchain |
| [`scancode-toolkit`](https://github.com/aboutcode-org/scancode-toolkit) | ✅ | ❌ | Lizenz-Compliance | bei Drittanbieter-Code-Erweiterung relevant |

**Kernfehlend:** SBOM + signierter „Empty-Stack"-Beleg pro Release.

### 3.5 Geheimnisse, Konfiguration

| Werkzeug | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- |
| [`gitleaks`](https://github.com/gitleaks/gitleaks) | ✅ | ✅ scharf | O.Cryp_1, O.Source_8 | Custom-Regeln in `.gitleaks.toml` |
| [`trufflehog`](https://github.com/trufflesecurity/trufflehog) | ✅ | ❌ | O.Cryp_1 | komplementär; tiefere Verifizierung |
| [`detect-secrets`](https://github.com/Yelp/detect-secrets) | ✅ | ❌ | O.Cryp_1 | Pre-Commit-fokussiert |
| Privacy-Manifest-Validator | ✅ | ❌ | O.Purp_2, O.Plat_2 | Apple bietet im Build-Pipe-Tool |

### 3.6 Provenienz / Signaturen

| Werkzeug | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- |
| Apple Code-Signing + Notarisation | ✅ | ✅ (App-Store-Pfad) | O.Arch_6, O.Arch_11 | trägt die App selbst |
| [`cosign`](https://github.com/sigstore/cosign) | ✅ für CI-Artefakte | ❌ | O.Arch_6 | für Evidence-Bundle (SARIF/SBOM/Junit), nicht für die App selbst nötig |
| [SLSA Provenance / `slsa-verifier`](https://slsa.dev) | ✅ | ❌ | O.Arch_1 | Build-Provenienz; sinnvoll für Prüfstellen-Einreichung |

### 3.7 PII / Privacy-Lecks

| Werkzeug | Anwendbar? | Heute aktiv? | TR-Bezug | Bemerkung |
| --- | --- | --- | --- | --- |
| [`microsoft/presidio`](https://github.com/microsoft/presidio) | ✅ | ❌ | O.Source_3 | Regex über Log-Stichproben |
| Custom regex-set (`grep -rE` über `os_log`) | ✅ | ❌ | O.Source_3 | leichter Einstieg |

## 4. Konkreter Vorschlag: erweiterte `security.yml` für `TwoBreath-app`

> Die für das **öffentliche Repo** anwendbaren Werkzeuge (gitleaks, markdownlint, lychee, dependency-review, testssl.sh, Mozilla Observatory) sind **bereits implementiert** — siehe § 1.2 + [`.github/workflows/security.yml`](../.github/workflows/security.yml). Der untenstehende Vorschlag betrifft das **private App-Repo** und beschreibt, wie semgrep, syft, osv-scanner, MobSF dort ergänzt werden.

Die folgende Erweiterung ergänzt die heutige Pipeline um **die fünf wichtigsten fehlenden Werkzeuge** (semgrep, MobSF, syft, osv-scanner, testssl.sh) ohne die bestehende Struktur zu brechen:

```yaml
# --- Ergänzungen für TwoBreath-app/.github/workflows/security.yml ---

  # ── 5. SAST: semgrep mit Swift- und allgemeinen Sicherheitsregeln ──
  semgrep:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/swift
            p/security-audit
            p/secrets
        env:
          SEMGREP_TIMEOUT: 300
      - name: Upload SARIF
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: semgrep.sarif

  # ── 6. SBOM: CycloneDX für Build-Toolchain + App-Manifest ──
  sbom:
    name: SBOM (syft)
    runs-on: macos-15
    steps:
      - uses: actions/checkout@v4
      - name: Install syft
        run: brew install syft
      - name: Generate CycloneDX SBOM
        run: |
          syft scan dir:. --output cyclonedx-json=sbom.cdx.json
      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with: { name: sbom, path: sbom.cdx.json }

  # ── 7. Dependency-CVE über alle Manifeste ──
  osv-scan:
    name: OSV Scanner
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run OSV-Scanner
        uses: google/osv-scanner-action/osv-scanner-action@v1
        with:
          scan-args: |-
            --recursive
            --skip-git
            ./
          # erfasst Package.resolved (App, heute leer), package-lock.json (Website)

  # ── 8. iOS-Binär-Analyse mit MobSF ──
  mobsf:
    name: MobSF Static (iOS .ipa)
    runs-on: macos-15
    needs: [build-release]  # benötigt eine geladene .ipa als Artefakt
    steps:
      - uses: actions/checkout@v4
      - name: Download build artefact
        uses: actions/download-artifact@v4
        with: { name: ipa-release }
      - name: Run MobSF (Docker)
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/work \
            opensecurity/mobile-security-framework-mobsf \
            python manage.py runscan /work/TwoBreath.ipa \
              --output /work/mobsf-report.json
      - name: Upload MobSF report
        uses: actions/upload-artifact@v4
        with: { name: mobsf-report, path: mobsf-report.json }

  # ── 9. TLS / HTTP-Header-Scan der Marketing-Site ──
  web-posture:
    name: Web Posture (testssl.sh + Observatory)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: testssl.sh on twobreath.com
        run: |
          docker run --rm drwetter/testssl.sh:latest \
            --jsonfile-pretty - https://www.twobreath.com > testssl.json
      - name: Mozilla HTTP Observatory
        run: |
          npx -y observatory-cli www.twobreath.com -z --format=json > observatory.json
      - uses: actions/upload-artifact@v4
        with: { name: web-posture, path: '*.json' }
```

### Auslöser

Diese Jobs sollten **bei jedem PR + bei jedem Push auf main + wöchentlich per cron** laufen. `mobsf` braucht eine signierte `.ipa` als Eingang und sollte deshalb nach `build-release` (in `ci.yml`) als nachgelagerter Job hängen.

### Speicherort der Artefakte

Alle Berichte werden als GitHub-Actions-Artefakte hochgeladen. Für eine spätere Prüfstelle können sie in ein **signiertes Evidence-Bundle** (SARIF + CycloneDX + JSON-Reports + cosign-Signatur + PROV-O-Manifest) zusammengefasst werden — siehe Empfehlung E2 im [`BSI_BERICHT.md`](BSI_BERICHT.md).

## 5. Mapping: Werkzeug → erfüllte TR-03161-Anforderungen

Nach Aktivierung der Erweiterungen aus § 4 ergibt sich folgender Abdeckungsbeitrag:

| Werkzeug | Schließt / belegt direkt |
| --- | --- |
| `gitleaks` | O.Cryp_1, O.Source_8 (Reste) |
| `swiftlint --strict` | O.Source_10, O.Source_1 (teilweise) |
| `semgrep` (neu) | O.Source_1, O.Source_2, O.Source_4, O.Source_5 (teilweise), O.Source_8, O.Cryp_1 |
| `syft` SBOM (neu) | O.TrdP_1 — beweist „Liste vollständig" auch wenn leer |
| `osv-scanner` (neu) | O.TrdP_3 |
| `MobSF` (neu) | O.Data_1, O.Data_4, O.Plat_2, O.Plat_3, O.Resi_8 (teilweise), O.Source_8 |
| `testssl.sh` (neu) | O.Ntwk_2, O.Ntwk_7 (Marketing-Site) |
| Mozilla Observatory (neu) | O.Ntwk_2 |
| Apple Notarisation | O.Arch_6, O.Arch_11 |
| Apple Privacy Manifest Validator | O.Purp_2, O.Plat_2 |

## 6. Was iOS-spezifisch ist und in der TR-03161 fehlt

Die TR-03161 ist plattformübergreifend formuliert. Für iOS-Apps existieren **plattform-eigene Mechanismen**, die TR-Anforderungen implizit erfüllen, aber im TR-Text nicht namentlich genannt sind. Eine Auswahl:

| iOS-Mechanismus | Erfüllt implizit | Heute aktiv |
| --- | --- | --- |
| App Sandbox | O.Plat_6, O.Data_3, O.Data_4 | ✅ Plattform-default |
| Data Protection Class A | O.Data_2 (teilweise), O.Data_14, O.Data_15 | ✅ Plattform-default |
| App Transport Security | O.Ntwk_2, O.Ntwk_7 | ✅ Info.plist ohne Ausnahmen |
| HealthKit-Autorisierung | O.Purp_3, O.Purp_4 | ✅ deklariert |
| Privacy Manifest (`PrivacyInfo.xcprivacy`) | O.Purp_2, O.Plat_2 | ✅ vorhanden |
| Apple Notarisation + App-Store-Review | O.Arch_6, O.Arch_11 | ✅ |
| App Attest / DeviceCheck | O.Resi_5, O.Resi_7 | ❌ verfügbar, nicht aktiv |
| Code-Signing-Verifizierung beim Start | O.Arch_6 | ✅ Plattform-default |

> **Empfehlung an das BSI (siehe Empfehlung E3 im Bericht):** Ein BSI-publizierter „Plattform-Aussagen-Katalog" je iOS-Major-Version, der diese impliziten Erfüllungen festhält, würde Hersteller und Prüfstellen erheblich entlasten.

---

## Zusammenfassung in einem Satz

**Stand v0.2 (mit dieser Pipeline-Erweiterung):**

- Im **öffentlichen Repo** (`ma3u/TwoBreath`) sind nun **alle anwendbaren Werkzeuge live** — gitleaks (Geheimnis-Scan), markdownlint (Doku-Hygiene), lychee (Link-Validierung), dependency-review (PR-Diff), testssl.sh + Mozilla Observatory (TLS- und Header-Posture wöchentlich gegen `twobreath.com`). Berichte als 90-Tage-Artefakte abrufbar. Konfig: [`.github/workflows/security.yml`](../.github/workflows/security.yml).
- Im **privaten App-Repo** (`ma3u/TwoBreath-app`) bleibt der bisherige Stand (gitleaks, swiftlint, eslint, npm audit, Tests). Die in § 4 vorgeschlagene Ergänzung — **semgrep, syft SBOM, osv-scanner, MobSF** — wartet auf einen separaten PR im App-Repo. Der YAML-Vorschlag dort ist drop-in.
