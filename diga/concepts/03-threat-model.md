# Bedrohungsmodell (TwoBreath)

> Schließt: O.Arch_1 (Security im SDLC), O.Arch_2 (Designphase), Teile von O.Resi_*.
> Stand: 2026-05-02 · Methode: STRIDE.

## 1. Geltungsbereich

iOS- und watchOS-Anwendung in der heutigen Architektur (siehe [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md)). Die Marketing-Website wird separat behandelt (statisch, GitHub Pages, kein Auth).

## 2. Akteur:innen und Vertrauensgrenzen

| Akteur:in | Vertrauen | Anmerkung |
| --- | --- | --- |
| Eigentümer:in des iPhones | hoch | hat Code-Sperre, ggf. Face/Touch-ID |
| Apple-iOS-Plattform | hoch | Update-, Sandbox-, Verschlüsselungs-Garantien |
| Gepaarte:r Partner:in (anderes iPhone) | hoch | manuell bestätigt |
| Lokales WLAN / nahegelegene Bluetooth-Reichweite | niedrig | unbekannte Mitwirkende möglich |
| Apple App Store | hoch | Distribution + Notarisation |
| Marketing-Website (`twobreath.com`) | mittel | statisch, keine PII |
| Drittanbieter / Werbe-Netzwerke | n/a | kein Datenfluss zu ihnen |

## 3. STRIDE-Analyse je Asset

Assets D1–D7 entsprechen [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md) § 3.

### D1 — Sitzungsmetadaten (`SessionLog`)

| STRIDE | Bedrohung | Wahrscheinlichkeit | Auswirkung | Maßnahme |
| --- | --- | --- | --- | --- |
| S — Spoofing | fremder Prozess fälscht Eintrag | sehr niedrig | gering | iOS-Sandbox |
| T — Tampering | manipulierter Eintrag | niedrig | gering | Data Protection Class A; bei Geräte-Sperre verschlüsselt |
| R — Repudiation | n/a | — | — | — |
| I — Info Disclosure | Backup auf unsicherem Mac | niedrig | gering (keine PII darin) | iCloud-Backup verschlüsselt; iTunes-Backup-Schlüssel optional |
| D — DoS | App-Speicher voll | niedrig | gering | Datenminimierung; SwiftData-Limits |
| E — Privilege Escalation | n/a | — | — | — |

### D2 — Achtsamkeits-Minuten (HealthKit)

| STRIDE | Bedrohung | Maßnahme |
| --- | --- | --- |
| S/T | fremde App schreibt Mindful-Minutes als TwoBreath | nicht möglich — HealthKit verlangt App-Bundle-ID |
| I | Nutzer:in zeigt fremder Person die Apple-Health-App | außerhalb App-Kontrolle; Plattform-vermittelt |

### D3 — HealthKit-Reads (HR, HRV, Schlaf)

| STRIDE | Bedrohung | Maßnahme |
| --- | --- | --- |
| I | App liest mehr Daten als deklariert | iOS HealthKit-Berechtigungs-Granularität pro Datentyp; Code-Review |
| I | Daten gelangen in Logs | „keine PII in Logs"-Regel (Secure-Coding-Standards § Logging) |
| I | Daten erscheinen im App-Switcher-Snapshot | Snapshot-Maskierung (Patch) |

### D4 — Partner-Pairing

| STRIDE | Bedrohung | Maßnahme |
| --- | --- | --- |
| S | fremde App im selben Bonjour-Bereich gibt sich als Partner aus | Pairing-Code; manuelle Bestätigung; einzigartiger Service-Type `_twobreath-pair` |
| T | Manipulation des Pairing-Codes auf dem Draht | MPC `encryptionPreference: .required` schützt nach Sitzungsaufbau |
| I | Discovery-Token sichtbar im Bonjour | Token-Lebensdauer auf Pairing-Vorgang beschränkt |

### D5 — MPC-Sitzungsdaten

| STRIDE | Bedrohung | Maßnahme |
| --- | --- | --- |
| S | Man-in-the-Middle | MPC nutzt session-key-basierte Verschlüsselung; Pairing-Code-Bestätigung beidseitig |
| T | Manipulation der Ritual-Nachrichten | MPC-Verschlüsselung |
| I | Lauschen am WLAN | MPC `encryption=required` |
| D | DoS durch Flooding | Heartbeat + Timeout in PairingService |

### D6 — Watch-Sync-Daten

| STRIDE | Maßnahme |
| --- | --- |
| alle | Apple WatchConnectivity ist plattform-vermittelt + verschlüsselt |

## 4. Globale Bedrohungen

| # | Bedrohung | Maßnahme | TR-Bezug |
| --- | --- | --- | --- |
| G1 | Geräteverlust ohne Code-Sperre | Hinweis im Onboarding (siehe [`patches/PATCHES.md` § 5](../patches/PATCHES.md)) | O.Plat_1 |
| G2 | Geräteverlust mit Code-Sperre | iOS Data Protection (Class A) | O.Data_14, O.Data_15 |
| G3 | Jailbreak / kompromittierte iOS-Installation | Mindest-iOS-Version, Hinweis-UI; App-Attest optional | O.Resi_2, O.Resi_5 |
| G4 | Reverse Engineering der App | Apple-Toolchain-Defaults (Stack-Canary, ASLR, NX); Symbol-Stripping geplant | O.Resi_8 |
| G5 | Fehlerhafte Berechtigungs-Verweigerung | App reagiert kontrolliert, Erstinformation klar | O.Purp_3, O.Purp_5 |
| G6 | Versehentliche Veröffentlichung von Geheimnissen im Repo | `gitleaks` mit Custom-Regeln; weekly cron | O.Cryp_1 |
| G7 | Veraltete Anwendungsversion mit Schwachstelle | App Store erzwingt Updates; künftige Mindest-Build-Prüfung | O.Arch_10 |
| G8 | Sicherheitsmeldung erreicht den Hersteller nicht | [`SECURITY.md`](../SECURITY.md) mit verschlüsseltem Kanal | O.Arch_9 |
| G9 | Drittanbieter-Bibliothek mit CVE | **kein Drittanbieter-Code** — Anforderung trivial erfüllt | O.TrdP_3 |
| G10 | Versehentliche Aktivierung von Debug-Modus in Release | Debug-Detection-Snippet (Patch); Release-Konfig in `project.yml` | O.Resi_3, O.Source_8 |

## 5. Restrisiken

| Risiko | Bewertung | Begründung |
| --- | --- | --- |
| Patientendaten (HealthKit) sichtbar bei Partner-Versendung | mittel | Inhalt: Atemübungs-Erlebnis, kein klinischer Werteversand |
| Geräte mit deaktivierter Code-Sperre | niedrig | Hinweis im Onboarding adressiert; Plattform-Default rät dazu |
| Jailbroken Geräte | niedrig | Mindest-iOS-Version + Hinweis; kein App-Attest aktiv |
| Datenexport in Cloud-Backups | niedrig | iCloud-Backup verschlüsselt; opt-in vom Nutzer |

## 6. Pflege

Dieses Dokument wird bei jeder Architekturänderung aktualisiert (insbesondere: Backend-Anbindung, neue Berechtigungen, neue Datenflüsse, neue Drittanbieter-Bibliotheken). Nächste planmäßige Überprüfung: **2026-11-02** (alle 6 Monate).

---

**Querverweis:** [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md), [`04-secure-coding-standards.md`](04-secure-coding-standards.md), [`08-resilienz-haertungskonzept.md`](08-resilienz-haertungskonzept.md).
