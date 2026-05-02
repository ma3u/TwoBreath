# Einwilligungsverzeichnis (TwoBreath)

> Schließt: O.Purp_3, O.Purp_4, O.Purp_5, O.Purp_6.
> Stand: 2026-05-02.

## 1. Anforderung

[O.Purp_6](../regulations/markdown/BSI-TR-03161-1.md#o-purp-6) verlangt vom Hersteller, ein Verzeichnis zu führen, „welches erkennen lässt, welche Nutzereinwilligungen vorliegen. Der nutzerspezifische Teil des Verzeichnisses MUSS für den Nutzer automatisiert einsehbar sein. Es SOLL eine Historie dieses Verzeichnisses angefordert werden können."

Da TwoBreath kein Hintergrundsystem betreibt, liegt das Verzeichnis **lokal auf dem Gerät** und ist über die App einsehbar — was die TR ausdrücklich zulässt.

## 2. Was wird verzeichnet

Pro **Berechtigungs-Vorgang** ein Eintrag mit:

| Feld | Datentyp | Beispiel |
| --- | --- | --- |
| `permission` | enum | `healthKitRead.heartRate`, `localNetwork`, `nearbyInteraction`, `healthKitWrite.mindfulMinutes` |
| `state` | enum | `granted`, `denied`, `revoked`, `notDetermined` |
| `timestamp` | ISO 8601 | `2026-05-02T14:32:11+02:00` |
| `appVersion` | semver | `1.5.5 (24)` |
| `osVersion` | string | `iOS 17.4.1` |
| `source` | enum | `firstLaunch`, `manualGrant`, `iosSettingsRevoke`, `inAppRevoke` |

**Nicht verzeichnet:** der konkrete Inhalt der Datenverarbeitung (das ist Aufgabe von HealthKit selbst), nur die Einwilligungs-*Tatsache*.

## 3. Speicherung

`SwiftData`-Modell `ConsentLog` in der App-Sandbox, unter iOS Data Protection Class A (gleicher Schutz wie `SessionLog`).

```swift
@Model final class ConsentLog: Sendable {
    var id: UUID
    var permission: String       // enum-RawValue
    var state: String            // enum-RawValue
    var timestamp: Date
    var appVersion: String
    var osVersion: String
    var source: String           // enum-RawValue
}
```

→ Vollständiger Code-Patch in [`../patches/PATCHES.md` § 9](../patches/PATCHES.md).

## 4. Anlage- und Aktualisierungs-Logik

| Auslöser | Aktion |
| --- | --- |
| iOS-Berechtigungs-Dialog antwortet | neuer `ConsentLog`-Eintrag mit `source = manualGrant` oder `denied` |
| App-Start: Berechtigung jetzt anders als zuletzt gespeichert | neuer Eintrag mit `source = iosSettingsRevoke` (oder `restored`) |
| In-App-Pairing-Aufhebung | Eintrag mit `source = inAppRevoke` für `localNetwork` |
| Nutzer:in fragt Verlauf an | Liste aller Einträge, sortiert absteigend, exportierbar als JSON |

Status-Polling beim App-Start ist die Quelle für Erkennung externer Widerrufe (Plattform-API: `HKHealthStore.authorizationStatus(for:)`, `LocalNetwork.LNNetworkPrivilegedAccess.permissionStatus`).

## 5. Einsehbarkeit für Nutzer:in

In-App-Bildschirm *Einstellungen → Datenschutz → Mein Einwilligungs-Verlauf*:

```
─── Mein Einwilligungs-Verlauf ──────────
✓ HealthKit (Herzfrequenz)         erteilt   2026-04-12 18:03
✓ HealthKit (HRV)                  erteilt   2026-04-12 18:03
✓ HealthKit (Mindful-Minutes-Schreibzugriff) erteilt   2026-04-12 18:03
✓ Lokales Netzwerk                 erteilt   2026-04-15 09:22
✗ Lokales Netzwerk                 widerrufen 2026-04-22 21:14
                                   (in iOS-Einstellungen)

[ Verlauf als JSON exportieren ]
```

Beim Export-Tap wird ein JSON-Dokument generiert und über das System-Share-Sheet bereitgestellt.

## 6. Historie und Aufbewahrung

- Historie wird **nicht automatisch gekürzt**. Bei begründetem Speicher-Anliegen kann ein Roll-up nach 24 Monaten auf einen pro-Berechtigung-Snapshot pro Tag implementiert werden — heute nicht aktiv.
- Beim *In-App: Alle Daten löschen*-Tap wird das Verzeichnis gemeinsam mit `SessionLog` gelöscht.

## 7. Verhältnis zu iOS-eigenen Einstellungen

Das App-eigene Verzeichnis ergänzt — ersetzt nicht — die iOS-Einstellungen. iOS bleibt die maßgebliche Stelle für Berechtigungs-Erteilung und -Widerruf. Das App-Verzeichnis ist **passiv**: es spiegelt, was iOS meldet.

Damit ist sowohl O.Purp_4 (keine Verarbeitung ohne Einwilligung — iOS verweigert die API ohnehin) als auch O.Purp_5 (Widerruf ermöglicht — iOS-Einstellungen, plus In-App) und O.Purp_6 (Verzeichnis automatisiert einsehbar) bedient.

## 8. Privacy-by-Default

Das Verzeichnis selbst sammelt **keine** über die obigen Felder hinausgehenden Daten. Es verlässt das Gerät niemals, außer durch eine vom Nutzer ausgelöste JSON-Export-Aktion.

---

**Querverweis:** [`01-datenschutzkonzept.md`](01-datenschutzkonzept.md) § 4–5, [`../patches/PATCHES.md` § 9](../patches/PATCHES.md).
