# Datenlebenszyklus (TwoBreath)

> Schließt: O.Arch_2, O.Source_7, O.Data_5.
> Stand: 2026-05-02.

## 1. Zweck dieses Dokuments

TR-03161-1 § O.Arch_2 fordert, dass **bereits in der Designphase** die Verarbeitung sensibler Daten in einem Datenlebenszyklus berücksichtigt wird. Dieses Dokument erfüllt das, indem es alle Datenkategorien der Anwendung in den vier Lebenszyklus-Phasen **Erhebung → Verarbeitung → Speicherung → Löschung** einzeln behandelt.

## 2. Datenflussdiagramm (Trust-Boundaries)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Apple iOS-Plattform                           │
│  ┌─────────────────┐                          ┌────────────────────┐   │
│  │  HealthKit-     │  read-only / write-only  │     TwoBreath      │   │
│  │  Store          │ ◄─── plattform-API ────► │  iOS-App-Sandbox   │   │
│  │  (HR, HRV,      │                          │                    │   │
│  │   Schlaf)       │                          │  ┌──────────────┐  │   │
│  └─────────────────┘                          │  │  SessionLog  │  │   │
│                                               │  │  (SwiftData) │  │   │
│  ┌─────────────────┐                          │  └──────────────┘  │   │
│  │  iOS Settings   │  Berechtigungs-API       │  ┌──────────────┐  │   │
│  │  (Privacy)      │ ◄────────────────────── │   │ PartnerPair- │  │   │
│  └─────────────────┘                          │  │   ing       │  │   │
│                                               │  └──────────────┘  │   │
│  ┌─────────────────┐                          │                    │   │
│  │ WatchConnectivity│ ─── iPhone ↔ Watch ─── │  AVAudio (read-    │   │
│  └─────────────────┘                          │  only Resources)   │   │
│                                               └─────────┬──────────┘   │
└─────────────────────────────────────────────────────────┼──────────────┘
                                                          │
                       ┌──── MultipeerConnectivity ───────┘
                       │     (verschlüsselt, P2P, lokal)
                       ▼
              ┌──────────────────┐
              │  Partner-iPhone  │
              │  (TwoBreath)     │
              └──────────────────┘

Trust-Boundaries:
  ─── App-Sandbox ↔ HealthKit                 (Apple-Berechtigungs-API)
  ─── App-Sandbox ↔ Lokales Netzwerk + UWB   (Apple-Berechtigungs-API)
  ─── iPhone ↔ Apple Watch                   (Apple WatchConnectivity)
  ─── iPhone ↔ Partner-iPhone                 (MPC, encryption=required)
  ─── Außenwelt: keine                        (kein Backend)
```

## 3. Datenkategorien

| ID | Kategorie | Sensitivität | Inhalt |
| --- | --- | --- | --- |
| D1 | Sitzungsmetadaten | gering | Programm-ID, Start, Dauer, Phasen-Zeiten, Comfort-Rating |
| D2 | Achtsamkeits-Minuten | mittel — Gesundheitsdaten | Sitzungs-Dauer als HKWorkout |
| D3 | HealthKit-Reads (HR, HRV, Schlaf) | hoch — Gesundheitsdaten | nur lesend in-Memory zur Anzeige |
| D4 | Partner-Pairing | mittel — Identifizierungs-Daten | Anzeigename des Partner-Geräts, Pairing-Code, NI-Token |
| D5 | MPC-Sitzungsdaten | mittel | flüchtige Sitzungsdaten zwischen gepaarten Geräten |
| D6 | Watch-Sync-Daten | gering | Sitzungsstatus, Heartbeat |
| D7 | iOS-Logs | gering | `os_log`-Einträge ohne PII |

## 4. Lebenszyklus je Datenkategorie

### D1 — Sitzungsmetadaten

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | App (BreathingEngine) | Arbeitsspeicher | nur in App-Prozess |
| Verarbeitung | App (RitualEngine) | Arbeitsspeicher | Swift-ARC |
| Speicherung | SwiftData (`SessionLog`) | App-Sandbox / Application Support | iOS Data Protection Class A |
| Löschung | App-Deinstallation oder *Einstellungen → Alle Daten löschen* | — | sicher per iOS-Sandbox-Removal |

### D2 — Achtsamkeits-Minuten (HealthKit-Write)

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | App, abgeleitet aus D1 (Dauer) | Arbeitsspeicher | — |
| Verarbeitung | App | Arbeitsspeicher | — |
| Speicherung | Apple HealthKit-Store | außerhalb App-Sandbox | Apple-plattform-verschlüsselt |
| Löschung | Nutzer:in über *Apple Health App → Daten und Zugriff* | — | Apple-vermittelt |

### D3 — HealthKit-Reads (HR, HRV, Schlaf)

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | iPhone-Sensoren / Apple Watch | Apple HealthKit-Store | Apple-vermittelt |
| Verarbeitung | App (`HealthKitService.swift`) | Arbeitsspeicher | nur lesend |
| Speicherung | **nicht persistiert** in App | — | Datenminimierung |
| Löschung | n/a (nur Memory) | — | automatisch beim App-Beenden |

### D4 — Partner-Pairing

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | App (PairingService) bei Pairing-Bestätigung | Arbeitsspeicher | nur in App-Prozess |
| Verarbeitung | App | Arbeitsspeicher | Swift-ARC |
| Speicherung | `PartnerPairing` (UserDefaults oder eigene Store) | App-Sandbox | iOS Data Protection Class A |
| Löschung | *In-App: Pairing aufheben* oder App-Deinstallation | — | überschreiben |

### D5 — MPC-Sitzungsdaten

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | MPC (Plattform-API) | Arbeitsspeicher | Plattform-vermittelt |
| Verarbeitung | App | Arbeitsspeicher | Swift-ARC |
| Speicherung | **nicht persistiert** | — | flüchtig |
| Löschung | automatisch beim Sitzungsende | — | Plattform-vermittelt |

### D6 — Watch-Sync-Daten

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | App (ConnectivityManager, WCSession) | Arbeitsspeicher | Apple-vermittelt |
| Verarbeitung | App | Arbeitsspeicher | Swift-ARC |
| Speicherung | flüchtig + Watch-`SessionLog` (analog D1) | Watch-App-Sandbox | iOS Data Protection |
| Löschung | App-Deinstallation auf Watch | — | sicher |

### D7 — iOS-Logs

| Phase | Wer | Wo | Schutz |
| --- | --- | --- | --- |
| Erhebung | App via `os_log` | Apple Unified Logging | Plattform-vermittelt |
| Verarbeitung | n/a (nur Diagnose) | — | — |
| Speicherung | iOS Plattform — System-Standard-Retention | nicht App-zugreifbar | Apple-vermittelt |
| Löschung | iOS-Standard | — | — |

**Compliance-Pflicht:** keine PII in Log-Strings (siehe [`04-secure-coding-standards.md`](04-secure-coding-standards.md) § Logging).

## 5. Bedrohungsmodell-Einsprungspunkte

Kreuzverweis auf [`03-threat-model.md`](03-threat-model.md):

| Bedrohung | Betrifft | Maßnahme |
| --- | --- | --- |
| Geräte-Verlust ohne Code | D1, D4 | iOS Data Protection (NSFileProtectionComplete) |
| Geräte-Verlust mit kompromittiertem Code | D1, D2 (in HealthKit), D4 | Kill-Switch nicht implementiert (KANN-Anforderung); Hinweis Geräte-PIN (`O.Plat_1`) |
| App-Switcher-Snapshot | UI-Anzeige sensibler Daten | Snapshot-Maskierung (siehe Patch) |
| Hostiles WiFi während Pairing | D5 | MPC `encryptionPreference: .required`; Pairing-Code |
| Drittanwendung mit gleichem Bonjour-Service | D5 | Service-Type `_twobreath-pair`; Bestätigung erforderlich |

## 6. Änderungs-Log

| Datum | Änderung |
| --- | --- |
| 2026-05-02 | Erstfassung |

---

**Querverweis:** [`01-datenschutzkonzept.md`](01-datenschutzkonzept.md) (Zwecke), [`03-threat-model.md`](03-threat-model.md) (Bedrohungen), [`07-netzwerk-sicherheitskonzept.md`](07-netzwerk-sicherheitskonzept.md) (D5).
