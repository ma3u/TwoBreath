# Secure-Coding-Standards (TwoBreath / Swift 6)

> Schließt: O.Arch_1 (Security im SDLC), O.Source_1, O.Source_2, O.Source_3, O.Source_5, O.Source_8, O.Source_9.
> Stand: 2026-05-02 · Geltung: alle Swift- und SwiftUI-Quelldateien in `TwoBreath-app/`.

Diese Standards präzisieren die in `TwoBreath-app/.claude/rules/code-style.md` definierten allgemeinen Konventionen um sicherheitskritische Punkte. Sie sind durchsetzbar via SwiftLint (vorhanden), `semgrep` (geplant) und Code-Review.

## 1. Eingabeprüfung (`O.Source_1`, `O.Source_2`)

- **Externe Inputs** (JSON-Dateien aus `Resources/`, MPC-Nachrichten, HealthKit-Werte) werden ausschließlich über `Codable`-Strukturen entgegengenommen.
- `JSONDecoder()` darf nicht ohne Fehlerbehandlung verwendet werden — `try?` macht silente Fehler. Bevorzugte Form:
  ```swift
  do {
      let value = try decoder.decode(Type.self, from: data)
  } catch {
      Logger.app.error("Decoding failed: \(error.localizedDescription, privacy: .public)")
      return fallback
  }
  ```
- Numerische Werte aus externen Quellen werden vor Verwendung auf erwartete Wertebereiche geprüft (z. B. `phase.duration > 0 && phase.duration <= 60 * 60`).
- **Pairing-Code-Eingabe:** Ziffernfilter + Längenprüfung vor jedem Vergleich.

## 2. Ausgabe / Logging (`O.Source_3`)

- **Verwendete Bibliothek:** `os.Logger` (Apple Unified Logging).
- **Privacy-Marker** sind verpflichtend bei jeder String-Interpolation:
  ```swift
  // korrekt
  Logger.session.info("Session started, program=\(programID, privacy: .public)")
  Logger.session.info("Heart rate baseline=\(hr, privacy: .private)")
  ```
- **Liste sensibler Größen** (immer `.private` oder gar nicht protokollieren):
  - Herzfrequenz, HRV, Ruhepuls, Schlafdaten (HealthKit-Reads)
  - Partner-Anzeigename
  - Pairing-Code
- **`print(...)` ist verboten** in Produktiv-Pfaden. SwiftLint-Regel: `force_print` (custom) — siehe Patch.

## 3. Fehlerbehandlung und Ausnahmen (`O.Source_4`, `O.Source_5`)

- Verwendung von `Result<Success, Failure>` oder `throws`/`try/catch`. Keine implizit-entpackten Optionals (`!`) in Produktiv-Pfaden — SwiftLint `force_unwrapping` ist scharf.
- **Stack-Traces** dürfen nicht in der UI erscheinen. Fehler-Mappings sind über `LocalizedError`-Konformität zu produzieren.
- Bei Fehler in einem sensitiven Pfad (HealthKit-Read fehlgeschlagen) wird die zugehörige UI-Anzeige geleert; Memory-Variablen werden über Swift-ARC freigegeben.

## 4. Speichersicherheit (`O.Source_5`, `O.Source_6`)

- Swift mit ARC: keine manuelle Speicherverwaltung. `unsafeBitCast`, `withUnsafePointer`, `Data.bytes` sind in App-Code untersagt; Ausnahmen mit Code-Review-Begründung in `// MARK: - SECURITY` markiert.
- Sensible String-Inhalte (Pairing-Code-Eingabe) werden nach Verwendung explizit geleert: `code.removeAll(keepingCapacity: false)`.

## 5. Debug-Hygiene (`O.Source_8`)

- **Verboten in Produktivkonfiguration:**
  - Debug-URLs / Test-Endpunkte (Regex: `localhost|staging|dev\.|test\.`)
  - `print`, `dump`, `Mirror(reflecting:)` außerhalb von Tests
  - `// TODO: remove before release` ohne Issue-Verweis
  - Hardcoded API-Keys (siehe `.gitleaks.toml`)
- **`#if DEBUG`-Blöcke:**
  ```swift
  #if DEBUG
  Logger.app.debug("development-only diagnostic")
  #endif
  ```
  Niemals sicherheitsrelevante Logik in `#if DEBUG` einbauen, die in Release fehlt.

## 6. Build-Hardening (`O.Source_9`, `O.Resi_8`)

- Apple-Toolchain-Defaults aktiv: Stack-Canaries, ASLR, NX-Bit, Pointer-Authentication. Diese Flags sind in `project.yml` nicht zu deaktivieren.
- **Strip-Symbols-Konfiguration** in Release-Konfiguration:
  ```yaml
  STRIP_INSTALLED_PRODUCT: YES
  DEPLOYMENT_POSTPROCESSING: YES
  STRIP_SWIFT_SYMBOLS: YES
  ```
  → siehe Patch in [`../patches/PATCHES.md` § 8](../patches/PATCHES.md).
- Bitcode entfällt mit Xcode 14+; nicht relevant.

## 7. Geheimnisse

- **Niemals** Schlüsselmaterial im Quellcode oder in `Info.plist`. SwiftLint-Regel: `force_unwrapping` + benutzerdefinierte regex via `.gitleaks.toml`.
- API-Keys (z. B. ElevenLabs für Build-Zeit-Voiceover) gehören in `.env` (gitignored) und werden ausschließlich von Skripten in `scripts/` gelesen, nie zur Laufzeit der App.
- ITSAppUsesNonExemptEncryption ist auf `false` zu halten, solange keine eigene Krypto in der App stattfindet.

## 8. Drittanbieter-Bibliotheken

- **Verboten** ohne Architekt:innen-Freigabe und Aktualisierung von [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md), [`03-threat-model.md`](03-threat-model.md), `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`. Aktueller Stand: keine Drittanbieter-Bibliotheken (CLAUDE.md).
- Bei Aufnahme einer Bibliothek: SBOM-Eintrag, OSV-Scan, Lizenz-Bewertung, Verweis im SDLC.

## 9. Werkzeug-Durchsetzung

| Standard | Werkzeug | Heute aktiv |
| --- | --- | --- |
| § 1, § 3, § 4 | SwiftLint mit opt-in rules (`force_unwrapping`, `implicitly_unwrapped_optional`, `fatal_error_message`) | ✅ in `security.yml` |
| § 2 | benutzerdefinierte SwiftLint-Regel `os_log_privacy_marker` | ❌ — siehe Patch |
| § 5 | gitleaks + benutzerdefinierte regex-Regel `debug-url` | 🟡 — Custom-Regel ergänzen |
| § 6 | xcodebuild-Konfiguration | 🟡 — siehe Patch |
| § 7 | gitleaks; `.gitignore` für `.env` | ✅ |
| § 8 | Code-Review-Pflicht; jährliche Re-Validierung | ✅ Konvention |

## 10. Schulung und Aufnahme

Neue Mitwirkende lesen diese Datei vor dem ersten PR. PR-Vorlage bekommt eine Checkbox „Secure-Coding-Standards eingehalten".

---

**Querverweis:** [`../CI_CD_SECURITY.md`](../CI_CD_SECURITY.md), [`../patches/PATCHES.md`](../patches/PATCHES.md), [`08-resilienz-haertungskonzept.md`](08-resilienz-haertungskonzept.md).
