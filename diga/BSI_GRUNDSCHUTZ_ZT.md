# Eignet sich das TwoBreath-Assessment als Beispiel für Grundschutz++ und das BSI-Zero-Trust-Eckpunktepapier?

> **Kurzantwort:** Ja — als **methodisches Beispiel** für die maschinenlesbare, evidenzbasierte Auswertung eines Sicherheitskatalogs. **Nein** — als **technische Bauteil-Vorlage**, weil TwoBreath bewusst **kein Hintergrundsystem** und damit kaum klassische Zero-Trust-Sichtbarkeit hat. Die methodische Wiederverwendbarkeit ist hoch, die strukturelle Übertragbarkeit ist niedrig.

**Stand:** 2026-05-04 · v0.1
**Bezug:** [`BSI_ASSESSMENT.md`](BSI_ASSESSMENT.md) (Hersteller-Selbstdeklaration TR-03161-1) · [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) (alle 127 `O.*`)

---

## 1. Drei Regelwerke, drei Schichten

| Regelwerk | Adressat:in | Granularität | Stand |
| --- | --- | --- | --- |
| **BSI TR-03161-1** | Hersteller einer Mobile-App | 127 Anforderungen `O.*`, sehr produktnah | v3.0 vom 25.03.2024 |
| **IT-Grundschutz++** | Organisation mit Informationsverbund | 67 Bausteine, organisations- und prozessnah | Edition 1.1.2026 (Übergang bis 2029) |
| **ZT-Eckpunktepapier** | Architektur-Verantwortliche | 4 Kernprinzipien, kein Bauteil-Katalog | Positionspapier 04.07.2023, in Weiterentwicklung |

Die drei Regelwerke schauen aus drei verschiedenen Höhen auf dasselbe System:
- **TR-03161** schaut **in das Produkt** (eine App, ein Backend).
- **Grundschutz++** schaut **auf die Organisation** (Personal, Räume, Lieferanten, Notfallmanagement).
- **ZT-Eckpunktepapier** schaut **auf die Architektur-Haltung** (Niemals vertrauen, immer verifizieren).

TwoBreath ist eine App ohne Backend ohne Organisation und ist damit:

- **TR-03161-1**: voll im Anwendungsbereich → 127 Reihen ausgewertet (siehe [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md)).
- **Grundschutz++**: nur am Rand betroffen → ~5–8 von 67 Bausteinen anwendbar (s. § 3).
- **ZT-Eckpunktepapier**: konzeptionell deckungsgleich → die Architektur ist „assume breach by design", aber **nicht weil ZT umgesetzt wurde**, sondern weil **kein Backend existiert** (s. § 4).

---

## 2. Was ist Grundschutz++ (kurz)

[BSI: Zero Trust und IT-Grundschutz](https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Zero-Trust/zero-trust_node.html) · [BSI-Leitfaden Methodik Grundschutz++ (Mai 2026)](https://www.datenschutzticker.de/2026/04/bsi-leitfaden-zur-methodik-grundschutz/) · [Maconia: Funktionsweise und Methodik](https://maconia.de/bsi/grundschutz-funktionsweise-aktueller-stand-und-methodik-im-detail/) · [ISMS-Ratgeber Wiki](https://wiki.isms-ratgeber.info/wiki/Grundschutz++_Einf%C3%BChrung_und_Aufbau)

Wesentliche Änderungen gegenüber dem klassischen IT-Grundschutz-Kompendium:

| Aspekt | klassisch (Edition 2024) | **Grundschutz++ (Edition 1.1.2026)** |
| --- | --- | --- |
| Bauteile | 111 Bausteine | **67 Bausteine** |
| Anforderungen | textbasiert, Begleittexte | **maschinenlesbar** + objektorientiert |
| Verschlankung | — | **bis zu 80 %** weniger Anforderungstext |
| Schutzziel-Bewertung | Reife-Skala je Anforderung | **neues Punktesystem** |
| Übergangsfrist | — | bis **2029** |

Die methodische Verwandtschaft zur TR-03161 ist hier **stark**: beide Regelwerke gehen den Weg „weniger, präziser, maschinenlesbar". Genau das ist die These des TwoBreath-Beispiels (siehe [`BSI_BERICHT.md` § 8 — Empfehlung E1](BSI_BERICHT.md#empfehlung-e1)).

---

## 3. Was ist das BSI-Zero-Trust-Eckpunktepapier (kurz)

[BSI Positionspapier Zero Trust (PDF, 04.07.2023)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeLeitlinien/Zero-Trust/Zero-Trust_04072023.pdf?__blob=publicationFile&v=4) · [BSI Themenseite Zero Trust](https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Zero-Trust/zero-trust.html)

Das BSI verkürzt Zero Trust auf vier operative Kernprinzipien:

1. **Niemals vertrauen, immer verifizieren** — jeder Zugriff wird wie ein potenziell feindlicher Zugriff behandelt; Authentisierung jedes Mal, nicht nur beim Login.
2. **Assume Breach** — Architektur und Betrieb gehen davon aus, dass eine Komponente bereits kompromittiert ist.
3. **Least Privilege** — minimale Rechte je Akteur:in, je Aufgabe, je Zeitfenster.
4. **Mikrosegmentierung / Ressourcen-zentriertes Schutzmodell** — Schutz wandert von der Netzwerk-Perimeter-Grenze zur Ressource selbst.

Das Eckpunktepapier ist **kein** Baustein-Katalog. Es definiert eine Haltung, die in andere Regelwerke (Grundschutz++) progressiv eingewoben wird.

---

## 4. Mapping: TR-03161-1 `O.*` ↔ Grundschutz++ ↔ ZT-Prinzip

Acht repräsentative Reihen aus den elf Prüfaspekten — vollständige 127 Reihen siehe [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md).

| TR-03161-1 `O.*` | Bedeutung | Grundschutz++-Bezug | ZT-Prinzip-Bezug | TwoBreath-Status |
| --- | --- | --- | --- | --- |
| [`O.Purp_3`](regulations/markdown/BSI-TR-03161-1.md#o-purp-3) | Einwilligung in Datenverarbeitungs-Zweck | `CON.2 Datenschutz`, `ORP.5 Compliance` | „assume breach": Einwilligung dokumentiert, falls Streitfall | ✅ `ConsentLog`-Verzeichnis |
| [`O.Arch_9`](regulations/markdown/BSI-TR-03161-1.md#o-arch-9) | Sicherheits-Kontaktstelle für CVD | `OPS.1.1.5 Patch- und Änderungsmanagement` | Voraussetzung für „assume breach" | ✅ [`SECURITY.md`](SECURITY.md) |
| [`O.Source_8`](regulations/markdown/BSI-TR-03161-1.md#o-source-8) | Keine Debug-/Test-Pfade in Produktion | `CON.8 Software-Entwicklung` | Least Privilege auf Build-Pfad-Ebene | ✅ `assertNotDebugged()` (Patch §1) |
| [`O.Cryp_1`](regulations/markdown/BSI-TR-03161-1.md#o-cryp-1) | Konformität zu BSI TR-02102 | `CON.1 Krypto-Konzept` | Verschlüsselung at-rest und in-transit als ZT-Pflicht | ✅ Plattform-Delegierung ([Konzept §6](concepts/06-kryptographiekonzept.md)) |
| [`O.Auth_1`](regulations/markdown/BSI-TR-03161-1.md#o-auth-1) | Authentisierungs-Konzept | `ORP.4 Identitäts-/Berechtigungsmanagement` | „Niemals vertrauen, immer verifizieren" — **Kernprinzip** | ➖ n/a (keine Konten) |
| [`O.Data_14`](regulations/markdown/BSI-TR-03161-1.md#o-data-14) | Verschlüsselung lokaler Daten | `SYS.3.1 Laptops`, `SYS.3.2.1 Smartphones` | Ressourcen-zentriert | ✅ iOS Data Protection Class A |
| [`O.Ntwk_1`](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) | Sichere Netzwerk-Kanäle | `NET.3.3 VPN`, `CON.10 ZT-Architektur` (in Vorbereitung) | **Kernprinzip-Beispiel**: jeder Kanal verschlüsselt | ✅ MPC `encryptionPreference: .required` |
| [`O.Plat_1`](regulations/markdown/BSI-TR-03161-1.md#o-plat-1) | Sicherer Bezug aus offiziellem App-Store | `OPS.1.1.6 Software-Tests und -Freigaben` | Lieferketten-Integrität als ZT-Voraussetzung | ✅ Apple App Store + Notarisation |
| [`O.Resi_1`](regulations/markdown/BSI-TR-03161-1.md#o-resi-1) | Anwender-Sicherheits-Hinweise | `ORP.3 Sensibilisierung` | Bewusstsein als komplementäre Schicht | ✅ `SecurityInfoView` (Patch §5) |
| [`O.Resi_5`](regulations/markdown/BSI-TR-03161-1.md#o-resi-5) | Geräteintegrität / App Attest | `SYS.3.2.1 Smartphones` | „Niemals vertrauen": Gerät vor Backend-Kontakt verifizieren | 🟡 Stub vorhanden (Patch §6, wartet auf Backend) |

> **Lese-Anleitung:** Jeder `O.*`-Bezeichner ist ein Deep-Link in das ingestierte BSI-TR-03161-1-PDF unter [`regulations/markdown/`](regulations/markdown/). Die Anker-Konvention ist `o-<gruppe>-<n>`. Beispiel: [O.Ntwk_1](regulations/markdown/BSI-TR-03161-1.md#o-ntwk-1) → § 3 Anforderung an verschlüsselte Netzwerk-Kanäle. Die Quelle wird per `make ingest` reproduzierbar erzeugt (sha256-gepinnt in `regulations/source-manifest.yaml`).

---

## 5. Wo TwoBreath als Beispiel **taugt**

### 5.1 Methodisch — beide Regelwerke

**Grundschutz++ und TR-03161 gehen in dieselbe Richtung: weniger Text, mehr Maschinenlesbarkeit.** Das TwoBreath-Repo zeigt in voller Länge wie das aussieht:

| Methodisches Element | Im Repo zu sehen unter |
| --- | --- |
| Maschinenlesbare Anforderungs-Datenstruktur | [`evidence/tr1-twobreath-status.yaml`](evidence/tr1-twobreath-status.yaml) — 127 Reihen mit `id`, `status`, `class`, `default_class`, `sources` |
| Auto-generierte Compliance-Tabelle | [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) — durch `scripts/build-official-matrix.py` aus YAML + ingestiertem TR-Markdown |
| Deterministische 4-Klassen-Beweistypologie | `R/D/P/M` ([Real-time/Deploy/Periodic/Manual](PLANNING.md#7-the-four-class-evidence-taxonomy)) |
| sha256-Pinning der Original-Quellen | `regulations/source-manifest.yaml` |
| Reproduzierbarkeit | `make ingest` und `make official-matrix` |

**Eigentliche These:** wenn Grundschutz++ seine 67 Bausteine ebenfalls maschinenlesbar bereitstellt (Edition 1.1.2026 enthält genau diesen Schritt), dann ist die hier demonstrierte Pipeline 1:1 übertragbar. Die TR-Bezeichner werden durch Bausteine-IDs ersetzt — der Rest der Pipeline bleibt.

### 5.2 Architektonisch — Zero Trust

TwoBreath erfüllt die ZT-Kernprinzipien als **Nebenprodukt der lokal-zuerst-Architektur**:

| ZT-Prinzip | TwoBreath-Erfüllung |
| --- | --- |
| Niemals vertrauen | App vertraut **keinem** externen System; jeder MPC-Kanal wird per `encryptionPreference: .required` verschlüsselt; Pairing erfordert manuellen Code |
| Assume Breach | kein Hersteller-Backend → keine Backend-Komponente kann gebrochen werden; Geräteverlust mit Code-Sperre wird durch Data Protection Class A aufgefangen |
| Least Privilege | iOS App-Sandbox (Plattform), Entitlements minimal, HealthKit-Reads nur on-demand, keine Drittanbieter-SDKs |
| Ressourcen-zentriert | Schutz auf der Datei-Ebene (`NSFileProtectionComplete`), nicht auf Netzwerk-Perimeter |

→ TwoBreath ist also ein Beispiel für **„Zero Trust durch radikale Architektur-Reduktion"**: das ZT-Niveau wird nicht durch Werkzeugauswahl erreicht, sondern durch Verzicht auf Komponenten, die ZT überhaupt schützen müsste.

---

## 6. Wo TwoBreath als Beispiel **nicht taugt**

| Bereich | Grund | Was fehlt für Übertragbarkeit |
| --- | --- | --- |
| **Grundschutz++ Organisations-Bausteine** (`ORP.*`, `OPS.*`, `INF.*`, `CON.4–6`) | TwoBreath hat keine Organisation, keine Räume, keine Mitarbeiter:innen, kein Notfallmanagement. | Ein realer Hersteller mit Büro, Personal, Auftragsverarbeitern und Backup-Plänen ist nötig. TwoBreath kann maximal die produktnahen Bausteine `CON.1 Krypto-Konzept`, `CON.8 Software-Entwicklung`, `SYS.3.2.1 Smartphones` exemplifizieren. |
| **Zero Trust Identitäts- und Sitzungs-Schicht** | Kein Konto, keine Tokens, keine Refresh-Pfade. Der `O.Auth_*`- und `O.Pass_*`-Block (20 Anforderungen) ist durchgängig **➖ nicht anwendbar** ([Matrix](COMPLIANCE_MATRIX_TR1_OFFICIAL.md#prufaspekt-6-authentisierung)). | Damit fehlt das **Hauptarbeitsfeld** von Zero Trust komplett. Eine ZT-Demonstration braucht ein Backend mit Konten, OIDC, Step-up-Authentisierung, kontextueller Risiko-Bewertung. |
| **Mikrosegmentierung / Policy Engine / Policy Enforcement Point** | Eine eigenständige App auf einem Gerät ist nicht segmentierbar — die Apple-Plattform ist die Segmentierungs-Grenze. | Ein klassisches ZT-Lab braucht mehrere Dienste (Identity Provider, Resource Server, Policy Engine wie OPA/Cedar, sidecar-Proxies wie Envoy) — nichts davon ist hier zu sehen. |
| **Logging, SIEM, Anomalie-Erkennung** | Logs verlassen das Gerät niemals; es gibt keinen Log-Aggregator, kein SIEM, keinen UEBA-Datenstrom. | ZT braucht kontinuierliche Telemetrie. Hier nicht vorhanden — und für die Privacy-These auch nicht gewünscht. |
| **Lieferketten-Komplexität** | Keine Drittanbieter, keine SBOM (trivial), kein CVE-Stream auf der App-Seite. | Realistische Grundschutz-Auswertungen müssen 50–500 Pakete tracken. |

→ Wer Grundschutz++ und ZT vollständig demonstrieren will, braucht ein **anderes Beispiel** mit Backend, Konten, mehreren Diensten und einem realen Hersteller-Betrieb. TwoBreath taugt für die **methodische** Übertragung (siehe § 5.1), nicht für die **strukturelle**.

---

## 7. Empfehlung in einem Satz

Das TwoBreath-Assessment kann gegenüber **Grundschutz++ und dem Zero-Trust-Eckpunktepapier in zwei Rollen** eingebracht werden:

1. **Methodisches Vorbild** für die maschinenlesbare, evidenz-klassifizierte Auswertung eines BSI-Katalogs (TR oder Grundschutz++) — vollständig, reproduzierbar, sha256-gepinnt.
2. **Architektur-Vignette** für Zero Trust als Konsequenz radikaler Komponenten-Reduktion (kein Backend = keine Angriffsfläche fürs Backend) — als Diskussionsbeitrag für ZT-Designprinzipien in lokal-zuerst-DiGAs.

**Nicht als** vollständiges Grundschutz++-Beispiel und nicht als ZT-Lab — dafür fehlen die organisatorischen und identitätszentrierten Schichten gewollt.

---

## Quellen

- BSI TR-03161-1 v3.0, 25.03.2024 (im Repo: [`regulations/markdown/BSI-TR-03161-1.md`](regulations/markdown/BSI-TR-03161-1.md))
- BSI TR-02102 (Krypto-Empfehlungen) — referenziert in [`concepts/06-kryptographiekonzept.md`](concepts/06-kryptographiekonzept.md)
- [BSI Themenseite Zero Trust](https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Zero-Trust/zero-trust_node.html)
- [BSI Positionspapier Zero Trust (04.07.2023, PDF)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeLeitlinien/Zero-Trust/Zero-Trust_04072023.pdf?__blob=publicationFile&v=4)
- [Datenschutzticker: BSI-Leitfaden zur Methodik Grundschutz++ (April 2026)](https://www.datenschutzticker.de/2026/04/bsi-leitfaden-zur-methodik-grundschutz/)
- [Maconia: Grundschutz++ Funktionsweise, Stand und Methodik](https://maconia.de/bsi/grundschutz-funktionsweise-aktueller-stand-und-methodik-im-detail/)
- [ISMS-Ratgeber Wiki: Grundschutz++ Einführung und Aufbau](https://wiki.isms-ratgeber.info/wiki/Grundschutz++_Einf%C3%BChrung_und_Aufbau)
- [Trustspace: BSI Grundschutz Kompendium 2026](https://trustspace.io/blog/bsi-grundschutz-kompendium-2026-guide)

---

**Autor:** Matthias Buchhorn-Roth
**Letzte Änderung:** 2026-05-04
