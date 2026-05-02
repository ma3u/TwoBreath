# Datenschutzkonzept (TwoBreath)

> Schließt: O.Purp_1, O.Purp_2, O.Purp_3, O.Purp_4, O.Purp_5, O.Data_5, O.Data_6.
> Stand: 2026-05-02 · Verantwortlich: Hersteller (Matthias Buchhorn-Roth, ma3u GitHub).

## 1. Verantwortlicher und Kontakt

Verantwortlich gemäß [Art. 4 Nr. 7 DSGVO](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e1488-1-1): Matthias Buchhorn-Roth. Für Sicherheits- und Datenschutz-Anliegen: siehe [`SECURITY.md`](../SECURITY.md).

## 2. Zwecke der Verarbeitung

| Zweck | Datenkategorien | Rechtsgrundlage |
| --- | --- | --- |
| Durchführung gemeinsamer Atemübungen (Paar-Co-Regulation) | Sitzungs-Metadaten (Programm-ID, Dauer, Phasen-Zeiten, Comfort-Rating) | Art. 6 (1) b — Vertrag/Nutzung der App |
| Wellness-Insight (eigener Verlauf) | HealthKit-Lesezugriffe: Herzfrequenz, HRV, Ruhepuls, Schlaf | Art. 9 (2) a — ausdrückliche Einwilligung (HealthKit-Dialog) |
| „Achtsame Minuten" in Apple Health zurückschreiben | Sitzungs-Dauer | Art. 9 (2) a — ausdrückliche Einwilligung |
| Partner-Pairing (lokal, P2P) | Geräte-Anzeigename, NI-Discovery-Token, Pairing-Code | Art. 6 (1) b |
| Synchronisation Smartphone ↔ Apple Watch | Sitzungsstatus, Heartbeat | Art. 6 (1) b (Apple-Plattform-vermittelt) |

**Keine** Erhebung für: Werbung, Marketing-Tracking, Profilbildung, Drittanbieter-Datenmonetarisierung.

## 3. Datenkategorien und Speicherorte

| Kategorie | Speicherort | Schutz |
| --- | --- | --- |
| `SessionLog` (SwiftData) | iOS App-Sandbox, Application Support | Data Protection Class A |
| HealthKit-Reads | Apple HealthKit-Store (außerhalb der App-Sandbox) | Apple-Plattform-vermittelt |
| HealthKit-Writes (Mindful-Minutes) | Apple HealthKit-Store | Apple-Plattform-vermittelt |
| `PartnerPairing` (gekoppelter Partner-Name + Token) | iOS App-Sandbox | Data Protection Class A |
| MPC-Sitzungsschlüssel | flüchtig (Arbeitsspeicher) | plattform-verwaltet, `MCSession.encryptionPreference: .required` |

**Es gibt kein Hintergrundsystem** — sämtliche Daten verbleiben auf Geräten des Nutzers oder im Partner-Gerät nach manuell bestätigtem Pairing.

## 4. Erstinformation und Einwilligung (O.Purp_1, O.Purp_3)

### 4.1 Vor der Installation

- App-Store-Beschreibung deklariert Zweck (Atemübung für Paare) und Plattform-Anforderungen.
- `PrivacyInfo.xcprivacy` deklariert maschinenlesbar `Health` + `Fitness` als Datenkategorien, ausschließlich für `AppFunctionality`, ohne Tracking.

### 4.2 Beim ersten Start

Reihenfolge der Erstinformation (siehe Code-Patch [`patches/PATCHES.md` § 5](../patches/PATCHES.md)):

1. Begrüßungsbildschirm mit Klartext-Zwecken (1 Bildschirm).
2. **Vor** dem ersten HealthKit-Lese- oder Schreibzugriff: HealthKit-System-Dialog (iOS-vermittelt).
3. **Vor** dem ersten Pairing-Versuch: LocalNetwork- + NearbyInteraction-Berechtigungs-Dialoge.
4. Hinweis: alle Berechtigungen lassen sich jederzeit über *iOS Einstellungen → Datenschutz* widerrufen.

Erst nach Abschluss dieser Sequenz beginnt die Datenverarbeitung.

### 4.3 Aktive und eindeutige Einwilligung

Über die iOS-System-Dialoge hinaus zeigt die App **eigene Erstinformations-Texte** je Berechtigung mit Erklärung der Konsequenzen einer Verweigerung — siehe [`erstinformation.md`](#anlage-erstinformations-texte) und Patch.

## 5. Widerruf (O.Purp_5)

| Widerruf via | Wirkung |
| --- | --- |
| iOS Einstellungen → Datenschutz → HealthKit / TwoBreath | App verliert Lese-/Schreibzugriff; eigene Daten bleiben in HealthKit |
| iOS Einstellungen → Datenschutz → Lokales Netzwerk | Pairing nicht mehr möglich |
| In-App: *Einstellungen → Pairing aufheben* | bestehende `PartnerPairing` wird gelöscht |
| In-App: *Einstellungen → Alle Daten löschen* (siehe Patch) | `SessionLog` wird gelöscht |
| App-Deinstallation | App-Sandbox wird vollständig entfernt |

In jedem Widerrufsfall zeigt die App **vor** dem endgültigen Schritt einen Hinweis auf die Konsequenzen (Verlust von Streak-Statistik, Pairing-Verlust etc.).

## 6. Datenminimierung (O.Data_6)

- `SessionLog` enthält **nur** programID, Dauer, Phasen-Zeiten, Comfort-Rating. Keine Klartext-Notizen, keine Fotos, keine Audio-Aufnahmen.
- HealthKit-Reads beschränkt auf die deklarierten Typen (HR, HRV, Ruhepuls, Schlaf).
- HealthKit-Writes beschränkt auf `HKWorkoutType` mit Achtsamkeitsminuten.
- Partner-Pairing speichert nur Anzeigename + Token, keine biometrischen Daten.

## 7. Speicherdauer und Löschkonzept (O.Data_5, O.Source_7)

| Datum | Aufbewahrung | Begründung |
| --- | --- | --- |
| `SessionLog` | unbegrenzt — bis Nutzer-Löschung oder Deinstallation | Streak-/Insights-Funktion benötigt vollständige Historie |
| HealthKit-Reads | nicht persistiert; nur in-Memory zur Anzeige | Datenminimierung |
| HealthKit-Writes (Mindful-Minutes) | persistiert in HealthKit | Apple-Plattform-vermittelt; Nutzerin steuert |
| `PartnerPairing` | bis Nutzer-Löschung | Pairing-Persistenz erforderlich |
| MPC-Sitzungsschlüssel | flüchtig | nicht persistiert |
| Logs (`os_log`) | 24 h Standard-iOS-Verhalten | Plattform-Standard, kein PII |

Die unbegrenzte Aufbewahrung von `SessionLog` ist **mit dem Zweck (Streak-Funktion) gerechtfertigt** und durch *In-App-Löschung* (siehe Patch) sowie Deinstallation jederzeit beendbar — mithin DSGVO-konform.

## 8. Datenweitergabe an Dritte

**Keine.** Es findet keine Weitergabe an Drittanbieter, Werbe-Netzwerke, Analytik-Dienste oder Cloud-Backends statt. Apple-iCloud-Backup ist plattform-vermittelt und steht unter Kontrolle des Nutzers.

## 9. Internationale Übermittlung

Keine eigene grenzüberschreitende Übermittlung. Apple-Plattform-Funktionen (iCloud, App Store) folgen Apples Datenschutz-Bestimmungen.

## 10. Rechte der betroffenen Person

Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch — adressierbar an `privacy@twobreath.com`. Da keine personenbezogenen Daten beim Verantwortlichen gehalten werden (lokal-zuerst-Architektur), erfolgt die Auskunft im Wesentlichen über die im Gerät vorhandenen Funktionen (Settings, In-App-Löschung).

## 11. Datenschutz-Folgenabschätzung (DSFA)

[Art. 35 DSGVO](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679#d1e3546-1-1) — bei Verarbeitung von Gesundheitsdaten (Art. 9 Abs. 1 — *Daten über die Gesundheit*) erforderlich. Trotz lokal-zuerst-Architektur und freiwilliger Nutzung wird eine **DSFA-Light** geführt (siehe [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md) für die zugrundeliegende Datenfluss-Analyse). Eine vollständige DSFA wird vor einer eventuellen DiGA-Listung erstellt.

## 12. Anlage: Erstinformations-Texte (Vorschlag)

```
Atemübung
─────────
TwoBreath ist eine Atemübungs-App für Paare. Wir sammeln keine Daten 
auf Servern. Alles bleibt auf deinem iPhone.

Apple Health-Zugriff
────────────────────
Mit deiner Erlaubnis lesen wir aus Apple Health deine Herzfrequenz und 
Schlafqualität — ausschließlich, um dir deinen eigenen Verlauf zu zeigen. 
Wir senden nichts. Du kannst den Zugriff jederzeit in den iOS-Einstellungen 
widerrufen; dann zeigen wir keine Insights mehr.

Partner-Pairing
───────────────
Mit deiner Erlaubnis findet TwoBreath das iPhone deiner/deines Partners 
in der Nähe und tauscht euer Atemritual aus. Die Verbindung ist 
verschlüsselt und endet, wenn ihr die App schließt.
```

(Lokalisiert in DE, EN, JA — bereits Sprachen der App.)

---

**Querverweise:**

- [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md) — Datenfluss-Diagramm
- [`05-einwilligungsverzeichnis.md`](05-einwilligungsverzeichnis.md) — formales Hersteller-Verzeichnis (O.Purp_6)
- [`../patches/PATCHES.md`](../patches/PATCHES.md) — Code-Snippets für Erst-Info und In-App-Löschung
