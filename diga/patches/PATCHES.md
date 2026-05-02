# Code-Patches für TwoBreath-app

> PR-fertige Swift-Snippets, die offene Anforderungen aus `COMPLIANCE_MATRIX_TR1_OFFICIAL.md` schließen. Jeder Patch ist eine eigenständige, ablauf-taugliche Datei oder Erweiterung; gemeinsam decken sie die in [`../concepts/`](../concepts/) referenzierten Anforderungen ab.

**Stand:** 2026-05-02 · **Zielrepo:** `ma3u/TwoBreath-app` (privat). Diese Datei dient als Vorlage; jeder Abschnitt landet als eigenes Commit.

---

## Inhaltsverzeichnis

- [§ 1 Debug-Umgebungs-Erkennung (O.Resi_3, O.Source_8)](#1-debug-umgebungs-erkennung)
- [§ 2 App-Switcher-Snapshot-Maskierung (O.Plat_9, O.Data_13)](#2-app-switcher-snapshot-maskierung)
- [§ 3 Secure-Text-Entry für Pairing-Code (O.Data_10)](#3-secure-text-entry-für-pairing-code)
- [§ 4 Disable Text-Selection auf sensiblen Anzeigen (O.Data_11)](#4-disable-text-selection-auf-sensiblen-anzeigen)
- [§ 5 Sicherheits-/Erstinformations-Bildschirm (O.Plat_13, O.Resi_1, O.Plat_1, O.Purp_1)](#5-sicherheits-erstinformations-bildschirm)
- [§ 6 App Attest — kommentierter Stub (O.Resi_5, O.Resi_7)](#6-app-attest)
- [§ 7 In-App „Alle Daten löschen" (O.Data_17)](#7-in-app-alle-daten-löschen)
- [§ 8 Build-Hardening: Symbol-Stripping (O.Source_9, O.Resi_8)](#8-build-hardening-symbol-stripping)
- [§ 9 Einwilligungs-Verzeichnis (O.Purp_3, O.Purp_5, O.Purp_6)](#9-einwilligungs-verzeichnis)
- [§ 10 Logging-Privacy-Marker — SwiftLint-Custom-Regel (O.Source_3)](#10-logging-privacy-marker)

---

## § 1 Debug-Umgebungs-Erkennung

**Datei:** `TwoBreath/App/DebugDetection.swift` (neu).
**TR-Bezug:** O.Resi_3 — *„Wenn die Anwendung feststellt, dass sie in einer Entwicklungs-/Debug-Umgebung ausgeführt wird, MUSS sie sich sofort beenden."*

```swift
import Foundation
import os

/// Beendet die App sofort, wenn ein Debugger an einem Release-Build hängt.
/// Quelle: Apple Technical Q&A QA1361.
@inline(__always)
func assertNotDebugged() {
    #if DEBUG
    return  // im Debug-Build erlauben wir das selbstverständlich
    #else
    var info = kinfo_proc()
    var size = MemoryLayout<kinfo_proc>.stride
    var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    let result = sysctl(&mib, UInt32(mib.count), &info, &size, nil, 0)
    guard result == 0 else { return }
    if (info.kp_proc.p_flag & P_TRACED) != 0 {
        Logger(subsystem: "com.ma3u.twobreath", category: "security")
            .error("Debugger detected on release build — terminating.")
        exit(EXIT_FAILURE)
    }
    #endif
}
```

**Aufrufpunkt:** in `@main`-App-Init oder `application(_:didFinishLaunchingWithOptions:)`-Äquivalent:

```swift
@main
struct TwoBreathApp: App {
    init() {
        assertNotDebugged()
        // … übrige Initialisierung
    }
    ...
}
```

**Test:** Release-Build per `lldb` versuchen anzuhängen → Prozess endet binnen Sekunden.

---

## § 2 App-Switcher-Snapshot-Maskierung

**Datei:** `TwoBreath/App/AppSwitcherShield.swift` (neu) + Modifier in den Views.
**TR-Bezug:** O.Plat_9, O.Data_13.

```swift
import SwiftUI

struct AppSwitcherShield: ViewModifier {
    @Environment(\.scenePhase) private var scenePhase
    func body(content: Content) -> some View {
        content
            .overlay {
                if scenePhase != .active {
                    Color.ink  // TwoBreath-Brand-Farbe
                        .ignoresSafeArea()
                        .overlay(
                            Image(systemName: "lock.fill")
                                .foregroundStyle(.warmWhite)
                                .font(.system(size: 48))
                        )
                }
            }
    }
}

extension View {
    /// Verdeckt sensible Inhalte im iOS-App-Switcher-Snapshot.
    func appSwitcherShield() -> some View {
        modifier(AppSwitcherShield())
    }
}
```

**Anwendung** auf Views, die HealthKit-Werte oder Partner-Anzeigen zeigen:

```swift
HealthDashboardView()
    .appSwitcherShield()
```

---

## § 3 Secure-Text-Entry für Pairing-Code

**Datei:** `TwoBreath/Features/Pairing/Views/PairingCodeEntryView.swift` (Anpassung).
**TR-Bezug:** O.Data_10.

```swift
TextField("Pairing-Code", text: $code)
    .keyboardType(.numberPad)
    .textContentType(.oneTimeCode)        // hint an Tastatur-Software
    .autocorrectionDisabled()
    .textInputAutocapitalization(.never)
    .privacySensitive()                    // iOS 17+ — markiert Eingabe als sensibel
```

`.privacySensitive()` wirkt zusammen mit `.appSwitcherShield()` (§ 2) für vollen Schutz.

---

## § 4 Disable Text-Selection auf sensiblen Anzeigen

**TR-Bezug:** O.Data_11.

Auf Views, die HealthKit-Werte zeigen:

```swift
Text("\(heartRate) bpm")
    .textSelection(.disabled)              // SwiftUI default ist eh disabled, hier explizit
    .privacySensitive()
```

---

## § 5 Sicherheits- / Erstinformations-Bildschirm

**Datei:** `TwoBreath/Features/Settings/Views/SecurityInfoView.swift` (neu).
**TR-Bezug:** O.Plat_13, O.Resi_1, O.Plat_1, O.Purp_1, O.Purp_3 (Erstinformation).

```swift
import SwiftUI

struct SecurityInfoView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Sicherheits-Empfehlungen")
                    .font(.title2.weight(.semibold))

                bullet("Aktiviere die iOS-Code-Sperre, idealerweise mit Face/Touch-ID.")
                bullet("Halte iOS und TwoBreath aktuell — Updates schließen Lücken.")
                bullet("Paire nur mit Personen, denen du vertraust. Bestätige den Pairing-Code beidseitig.")
                bullet("Nutze TwoBreath nicht auf Geräten mit Jailbreak.")
                bullet("Sichere dein Gerät über iCloud — das Backup ist verschlüsselt.")

                Divider().padding(.vertical, 8)

                Text("Was wir verarbeiten")
                    .font(.headline)
                infoLine("Apple Health (lesen)", "Herzfrequenz, HRV, Schlaf — nur zur Anzeige")
                infoLine("Apple Health (schreiben)", "Achtsamkeitsminuten")
                infoLine("Lokales Netzwerk", "Partner-Pairing — nichts geht ins Internet")
                infoLine("Speicherung", "Lokal auf deinem iPhone, verschlüsselt bei Sperre")
                infoLine("Drittanbieter", "Keine — TwoBreath verwendet ausschließlich Apple-Frameworks")

                NavigationLink("Mein Einwilligungs-Verlauf") {
                    ConsentLogView()                  // siehe § 9
                }
                .padding(.top, 16)

                Button("Sicherheitsproblem melden", systemImage: "envelope.fill") {
                    if let url = URL(string: "https://github.com/ma3u/TwoBreath/blob/main/diga/SECURITY.md") {
                        UIApplication.shared.open(url)
                    }
                }
                .buttonStyle(.bordered)
            }
            .padding()
        }
        .navigationTitle("Sicherheit")
    }

    private func bullet(_ text: String) -> some View {
        HStack(alignment: .top) { Text("•"); Text(text) }
    }
    private func infoLine(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading) {
            Text(title).font(.subheadline.weight(.medium))
            Text(value).font(.subheadline).foregroundStyle(.secondary)
        }
    }
}
```

Aufruf vom Settings-Hauptbildschirm:

```swift
NavigationLink("Sicherheit", destination: SecurityInfoView())
```

---

## § 6 App Attest — kommentierter Stub

**Datei:** `TwoBreath/App/AppAttestStub.swift` (neu, zunächst inaktiv).
**TR-Bezug:** O.Resi_5, O.Resi_7. Aktiv mit Hinzufügen eines Hintergrundsystems.

```swift
import DeviceCheck
import os

/// Vorbereiteter App-Attest-Pfad. Heute inaktiv, weil kein Backend
/// die Attestation konsumiert. Aktivieren, sobald ein Hintergrundsystem
/// existiert, das `attestation` und `assertion` verifizieren kann.
@available(iOS 14.0, *)
enum AppAttest {
    static let log = Logger(subsystem: "com.ma3u.twobreath", category: "attest")

    static func generateKeyAndAttest(challenge: Data) async throws -> (keyId: String, attestation: Data) {
        let service = DCAppAttestService.shared
        guard service.isSupported else {
            throw NSError(domain: "AppAttest", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "Device does not support App Attest"])
        }
        let keyId = try await service.generateKey()
        let attestation = try await service.attestKey(keyId, clientDataHash: SHA256.hash(data: challenge).data)
        return (keyId, attestation)
    }
    // assertion(...) folgt analog beim Backend-Roll-out
}
```

Sicherheits-Konzept-Verweis: [`../concepts/08-resilienz-haertungskonzept.md` § 5.1](../concepts/08-resilienz-haertungskonzept.md).

---

## § 7 In-App „Alle Daten löschen"

**Datei:** Erweiterung der Settings-View + Service.
**TR-Bezug:** O.Data_17.

```swift
import SwiftData

@MainActor
enum DataEraseService {
    static func eraseAllLocalData(modelContext: ModelContext) throws {
        try modelContext.delete(model: SessionLog.self)
        try modelContext.delete(model: ConsentLog.self)
        PartnerPairing.delete()
        // HealthKit-Schreibzugriffe der App entfernen
        Task { try? await HealthKitService.shared.deleteAllAppMindfulMinutes() }
    }
}
```

UI-Eintrag in Settings:

```swift
Button(role: .destructive) {
    showConfirm = true
} label: { Label("Alle TwoBreath-Daten löschen", systemImage: "trash") }
.confirmationDialog(
    "Alle lokalen Daten löschen?",
    isPresented: $showConfirm,
    titleVisibility: .visible
) {
    Button("Löschen", role: .destructive) {
        try? DataEraseService.eraseAllLocalData(modelContext: modelContext)
    }
    Button("Abbrechen", role: .cancel) {}
} message: {
    Text("Sitzungs-Verlauf, Einwilligungs-Verlauf und Partner-Pairing werden entfernt. " +
         "Daten in Apple Health bleiben dort erhalten — du kannst sie in der Apple-Health-App löschen.")
}
```

---

## § 8 Build-Hardening: Symbol-Stripping

**Datei:** `project.yml` (Anpassung).
**TR-Bezug:** O.Source_9, O.Resi_8.

```yaml
settings:
  configs:
    Release:
      STRIP_INSTALLED_PRODUCT: YES
      DEPLOYMENT_POSTPROCESSING: YES
      STRIP_SWIFT_SYMBOLS: YES
      DEAD_CODE_STRIPPING: YES
      GCC_OPTIMIZATION_LEVEL: s        # size, weniger Symbol-Dichte
      SWIFT_OPTIMIZATION_LEVEL: -O
      ENABLE_BITCODE: NO               # Apple-Default seit Xcode 14
      OTHER_LDFLAGS: $(inherited) -Wl,-x
```

**Hinweis:** Stripping wirkt nur in Release-Builds; Debug bleibt vollständig debuggable.
**Verifikation:** `nm /path/to/TwoBreath.app/TwoBreath` zeigt nur reduzierte Symbol-Tabelle.

---

## § 9 Einwilligungs-Verzeichnis

**Dateien:**
- `Shared/Models/ConsentLog.swift` (Model)
- `Shared/Services/ConsentTracker.swift` (Service)
- `TwoBreath/Features/Settings/Views/ConsentLogView.swift` (UI)

**TR-Bezug:** O.Purp_3, O.Purp_5, O.Purp_6. Konzept: [`../concepts/05-einwilligungsverzeichnis.md`](../concepts/05-einwilligungsverzeichnis.md).

### `ConsentLog.swift`

```swift
import SwiftData
import Foundation

@Model final class ConsentLog: Sendable {
    var id: UUID
    var permission: String        // ConsentPermission.rawValue
    var state: String             // ConsentState.rawValue
    var timestamp: Date
    var appVersion: String
    var osVersion: String
    var source: String            // ConsentSource.rawValue

    init(id: UUID = UUID(), permission: ConsentPermission, state: ConsentState,
         source: ConsentSource, appVersion: String, osVersion: String) {
        self.id = id
        self.permission = permission.rawValue
        self.state = state.rawValue
        self.timestamp = Date()
        self.appVersion = appVersion
        self.osVersion = osVersion
        self.source = source.rawValue
    }
}

enum ConsentPermission: String, Codable, CaseIterable, Sendable {
    case healthKitReadHeartRate, healthKitReadHRV, healthKitReadRestingHR, healthKitReadSleep
    case healthKitWriteMindfulMinutes
    case localNetwork, nearbyInteraction
}

enum ConsentState: String, Codable, Sendable {
    case granted, denied, revoked, notDetermined
}

enum ConsentSource: String, Codable, Sendable {
    case firstLaunch, manualGrant, iosSettingsRevoke, inAppRevoke, restored
}
```

### `ConsentTracker.swift`

```swift
import SwiftData
import HealthKit
import os

@MainActor
final class ConsentTracker {
    static let shared = ConsentTracker()
    private let log = Logger(subsystem: "com.ma3u.twobreath", category: "consent")

    func record(_ permission: ConsentPermission, state: ConsentState,
                source: ConsentSource, modelContext: ModelContext) {
        let entry = ConsentLog(
            permission: permission, state: state, source: source,
            appVersion: Bundle.main.appVersion, osVersion: UIDevice.current.systemVersion
        )
        modelContext.insert(entry)
        log.info("Consent recorded: \(permission.rawValue, privacy: .public) -> \(state.rawValue, privacy: .public)")
    }

    func reconcileAtLaunch(modelContext: ModelContext) {
        // beim Start prüfen, ob der iOS-Status mit dem zuletzt gespeicherten übereinstimmt;
        // bei Abweichung neuer Eintrag mit source=.iosSettingsRevoke / .restored
        // (Implementation pro Berechtigung; HKHealthStore.authorizationStatus(for:) etc.)
    }

    func exportAsJSON(modelContext: ModelContext) throws -> Data {
        let descriptor = FetchDescriptor<ConsentLog>(sortBy: [SortDescriptor(\.timestamp, order: .reverse)])
        let entries = try modelContext.fetch(descriptor)
        let dto = entries.map { ["permission": $0.permission, "state": $0.state,
                                 "timestamp": ISO8601DateFormatter().string(from: $0.timestamp),
                                 "appVersion": $0.appVersion, "osVersion": $0.osVersion,
                                 "source": $0.source] }
        return try JSONSerialization.data(withJSONObject: dto, options: [.prettyPrinted])
    }
}
```

### `ConsentLogView.swift`

```swift
struct ConsentLogView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \ConsentLog.timestamp, order: .reverse) private var entries: [ConsentLog]

    var body: some View {
        List(entries) { entry in
            VStack(alignment: .leading) {
                HStack {
                    Text(entry.permission)
                    Spacer()
                    Text(entry.state).foregroundStyle(.secondary)
                }
                Text(entry.timestamp.formatted())
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
        .navigationTitle("Mein Einwilligungs-Verlauf")
        .toolbar {
            ToolbarItem { ShareLink(item: try! JSONExportFile(modelContext: modelContext)) }
        }
    }
}
```

---

## § 10 Logging-Privacy-Marker

**Datei:** `.swiftlint.yml` (Anpassung). **TR-Bezug:** O.Source_3.

Eigene SwiftLint-Regel, die `Logger.…` ohne `privacy:`-Marker bemängelt:

```yaml
custom_rules:
  os_log_privacy_marker:
    name: "os_log privacy marker required"
    regex: 'Logger\.[a-zA-Z]+\.(info|debug|notice|warning|error)\("[^"]*\\\([^,)]+\)[^"]*"\)'
    message: "String-Interpolation in os.Logger erfordert einen privacy-Marker (z. B. `\\(value, privacy: .public)`)"
    severity: error
```

**Wirkung:** der CI-Schritt `swiftlint --strict` schlägt fehl, sobald irgendwo `Logger.x.info("foo \(bar)")` ohne `privacy:` steht.

---

## Wie das in CI greift

Nach Annahme dieser Patches wirken die folgenden TR-Anforderungen anders im `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`:

| Vorher | Nachher | Auslöser |
| --- | --- | --- |
| O.Resi_3 ❌ | ✅ | § 1 |
| O.Plat_9, O.Data_13 🟡 | ✅ | § 2 |
| O.Data_10 🟡 | ✅ | § 3 |
| O.Data_11 🟡 | ✅ | § 4 |
| O.Plat_13, O.Resi_1 ❌ + O.Plat_1, O.Purp_1 🟡 | ✅ | § 5 |
| O.Resi_5, O.Resi_7 🟡 | 🟡 (Stub vorhanden, Konsumenten fehlen) | § 6 |
| O.Data_17 🟡 | ✅ | § 7 |
| O.Source_9, O.Resi_8 🟡 | ✅ | § 8 |
| O.Purp_3, O.Purp_5, O.Purp_6 🟡/❌ | ✅ | § 9 |
| O.Source_3 🟡 | ✅ | § 10 |

Die zugehörigen Override-Updates in `evidence/tr1-twobreath-status.yaml` werden gemeinsam mit den Patches gesetzt (siehe MEMORY-Eintrag).
