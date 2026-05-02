# Netzwerk-Sicherheitskonzept (TwoBreath)

> Schließt: O.Ntwk_1, O.Ntwk_2, O.Ntwk_3, O.Ntwk_7, O.Ntwk_8 — und dokumentiert die Begründung für O.Ntwk_4/5/6 als „nicht anwendbar".
> Stand: 2026-05-02.

## 1. Topologie der Netzwerk-Verwendungen

| # | Verwendung | Trägerprotokoll | App-API | Vertrauensgrenze |
| --- | --- | --- | --- | --- |
| N1 | iPhone ↔ Apple Watch | Apple WatchConnectivity | `WCSession` | Plattform-vermittelt |
| N2 | iPhone ↔ Partner-iPhone | MultipeerConnectivity (Bluetooth/WiFi-P2P) | `MCSession` | App-konfiguriert |
| N3 | Proximity-Erkennung mit Partner-iPhone | Apple NearbyInteraction (UWB) | `NISession` | Plattform-vermittelt |
| N4 | App Store Connect (nur Build/Release) | HTTPS | `altool` (Werkzeug, nicht App) | Plattform-vermittelt |
| N5 | App lädt **keine** Inhalte zur Laufzeit | — | — | — |

**Kernpunkt:** Die App führt zur Laufzeit **keine eigenen HTTPS-Verbindungen** durch. Sie spricht ausschließlich mit:
- Apple-Plattform (HealthKit, WatchConnectivity, NearbyInteraction)
- Partner-Gerät über MPC

Dadurch entfallen die Anforderungen [O.Ntwk_4](../regulations/markdown/BSI-TR-03161-1.md#o-ntwk-4) (Zertifikats-Pinning), [O.Ntwk_5](../regulations/markdown/BSI-TR-03161-1.md#o-ntwk-5) (Server-Zertifikat-Prüfung), [O.Ntwk_6](../regulations/markdown/BSI-TR-03161-1.md#o-ntwk-6) (Antwort-Integrität) — sie haben kein Subjekt.

Für die Marketing-Website `twobreath.com` gelten TR-03161-2 (nicht Teil 1) — siehe TR-03161-2-Auswertung.

## 2. N1 — Watch-Connectivity

`WCSession` ist Apple-Plattform-vermittelt. Die Verbindung zwischen iPhone und gepaarter Apple Watch ist:

- nur zwischen Geräten desselben iCloud-Accounts möglich;
- plattformseitig verschlüsselt;
- nicht extern zugreifbar.

Dies erfüllt [O.Ntwk_1](../regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) (Verschlüsselung mit gegenseitiger Authentisierung) **durch Plattform-Aussage**. Sicherheits-Begründung: das iCloud-Account-Konstrukt ersetzt die mTLS-Identität. App-Codeseitige Konfiguration ist nicht erforderlich.

## 3. N2 — MultipeerConnectivity (kritisch)

Aus `Shared/Services/PairingService.swift`:

```swift
session = MCSession(
    peer: myPeerID,
    securityIdentity: nil,
    encryptionPreference: .required
)
```

Bewertung in der Matrix: **🟡 → ✅** mit Begründung.

### 3.1 Verschlüsselung

`encryptionPreference: .required` zwingt MPC zur Sitzungsverschlüsselung. Ohne diese Einstellung würde die Sitzung im Klartext laufen. Wir lehnen die Werte `.optional` und `.none` ab; jede zukünftige Code-Änderung an dieser Stelle ist Code-Review-pflichtig.

### 3.2 Authentisierung — Begründung der MPC-Wahl statt mTLS

[O.Ntwk_1](../regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) fordert wörtlich „durchgängig mit gegenseitiger Authentisierung verschlüsselt (zum Beispiel mittels mTLS)". Wir setzen statt mTLS:

1. **Manuelle, beidseitige Pairing-Code-Bestätigung.** Beide Nutzende sehen denselben Code auf ihren Bildschirmen und bestätigen, dass er identisch ist. Dies ist eine Out-of-Band-Verifikation der Sitzungs-Identität — analog dem WhatsApp-/Signal-Sicherheitsnummer-Modell.
2. **Service-Type-Trennung** über Bonjour-Service `_twobreath-pair._tcp/._udp`. Dritte Apps mit anderem Service-Type erreichen die Sitzung nicht.
3. **`securityIdentity: nil`** wird bewusst gewählt, weil es **keinen Hersteller-Backend** gibt, der ein gemeinsames Trust-Anchor-Zertifikat ausstellen könnte. Eine eigene PKI für Endnutzer-Geräte würde mehr Angriffsfläche eröffnen, als sie schließen würde (Zertifikats-Versorgung, Sperrlisten, Lebenszyklus).

Damit wird `O.Ntwk_1` nicht *wörtlich* per mTLS, aber **wirkungsgleich** durch Verschlüsselung + manuelle Bestätigung erfüllt. Diese Lesart ist abweichend, aber begründet. Wir bitten das BSI in Empfehlung E3 (siehe BSI-Bericht), für lokale P2P-Verbindungen ohne Hersteller-Backend ein Plattform-Aussagen-Konstrukt zu unterstützen.

### 3.3 Sitzungs-Lebenszyklus

| Ereignis | Aktion |
| --- | --- |
| Pairing-Beginn | Discovery via Bonjour; Discovery-Token-Austausch |
| Pairing-Code-Bestätigung beidseitig | Sitzung wird etabliert |
| Heartbeat-Verlust > Timeout | Sitzung wird beendet, Schlüsselmaterial verworfen |
| App-Hintergrund-Übergang | Sitzung pausiert; bei Rückkehr neu aufgebaut |
| App-Beendigung | Sitzung wird sauber abgebaut |

### 3.4 Konfiguration „Stand der Technik" (`O.Ntwk_2`)

MPC nutzt unter der Haube TLS-DTLS mit Apple-vetted Cipher-Suiten. Die Cipher-Suite-Wahl wird mit jeder iOS-Major-Version validiert.

## 4. N3 — NearbyInteraction (UWB)

`NISession` ist plattform-vermittelt. Sie liefert Distanz-/Richtungsdaten ausschließlich an die initiierende App, nicht an Dritte. Die Discovery-Tokens werden über bereits etablierte MPC-Sitzungen ausgetauscht (siehe `ProximityPairingService.swift:60–80`), nicht offen broadcast.

## 5. App Transport Security — die Rückversicherung

Auch wenn die App heute keine eigenen HTTPS-Aufrufe tätigt, ist ATS (`O.Ntwk_7`) als **Rückversicherung gegen Regression** scharf gestellt:

- `Info.plist` enthält **kein** `NSAppTransportSecurity` mit `NSAllowsArbitraryLoads = true`.
- Sollte ein zukünftiger PR eine `URLSession`-Verbindung einführen, gilt automatisch TLS 1.2+ mit modernen Cipher-Suiten.
- Cleartext-HTTP wird auf Plattform-Ebene blockiert.

**Verifikation:** geplanter MobSF-CI-Schritt prüft beim Build-Audit, dass keine ATS-Ausnahmen entstehen. Heute sicher per Code-Review und `git grep "NSAllowsArbitraryLoads"` (leeres Ergebnis).

## 6. Logging der Verbindungen (`O.Ntwk_8`)

Da kein Hintergrundsystem existiert, dem Logs zu übermitteln wären, beschränkt sich die Protokollierung auf:

| Was | Wo | Aufbewahrung |
| --- | --- | --- |
| Pairing-Beginn / -Ende | `os.Logger`-Subsystem `pairing` (`.public` für Aktion, **nicht** für Partnernamen) | iOS-Plattform-Standard (24 h) |
| Sitzungs-Reset / Reconnect | `os.Logger` | wie oben |
| Verbindungsfehler | `os.Logger` mit `.public` Fehlerklasse | wie oben |

Die Protokolle bleiben am Gerät und stehen über Apple Console / sysdiagnose dem Nutzer und einer ggf. konsultierten Prüfstelle zur Verfügung.

Bei Architekturänderung (Hintergrundsystem) ist diese Tabelle zu erweitern und [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md) anzupassen.

## 7. Trigger zur Re-Aktivierung von O.Ntwk_4/5/6

Sobald **eines** der folgenden Ereignisse eintritt, sind O.Ntwk_4 (Pinning), O.Ntwk_5 (Server-Zertifikat), O.Ntwk_6 (Response-Integrität) zu aktivieren und in der Matrix von ➖ auf einen Tatsachenwert zu bringen:

1. App nimmt eigene HTTPS-Verbindungen zu einem Hersteller-Backend auf.
2. App nimmt HTTPS-Verbindungen zu einem Drittanbieter-Backend auf (selbst nur für Telemetrie).
3. App lädt zur Laufzeit Inhalte (z. B. Audio-Cliplisten) per HTTPS.

In allen drei Fällen ist zusätzlich die TR-03161-3-Auswertung neu zu führen.

---

**Querverweis:** [`02-datenlebenszyklus.md`](02-datenlebenszyklus.md) (D5), [`03-threat-model.md`](03-threat-model.md) (D5-Risiken), [`06-kryptographiekonzept.md`](06-kryptographiekonzept.md) (Plattform-Algorithmen).
