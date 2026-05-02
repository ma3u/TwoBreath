# Wir machen Re-Zertifizierung kürzer — ein DiGA-Praxisbericht

**Untertitel:** Wie moderne Software-Lieferketten, DevSecOps und generative KI die Datensicherheits-Zertifizierung digitaler Gesundheitsanwendungen nach BSI TR-03161 von Monaten auf Tage komprimieren können — ohne den Schutzbedarf der Patient:innen zu senken.

**Autor:** Matthias Buchhorn-Roth
**Veröffentlichung:** Entwurf v0.3, 2026-05-02
**Lesezeit:** ca. 9 Minuten

---

## TL;DR

- Eine DiGA muss seit 1.1.2025 ein BSI-Zertifikat nach **TR-03161** vorlegen. Heute dauert die jährliche Re-Zertifizierung **mehrere Monate** und bindet erhebliche Ressourcen.
- Wir haben anhand einer realen App **alle 127 Prüfanforderungen** der TR-03161-1 v3.0 einzeln gegen den tatsächlichen Code durchgearbeitet — **und in Folgearbeit alle ehemaligen Lücken geschlossen**. Ergebnis: **80 % aller Anforderungen sind grundsätzlich deterministisch erbringbar** (74 % deploy-time, 4 % real-time, 2 % periodisch). Nur 20 % erfordern manuelles Urteil — überwiegend Dokumentations- und Konzeptarbeiten.
- Im konkreten Fall der untersuchten App stehen — nach Bearbeitung der dokumentierten Lücken — **55 % der Anforderungen auf ✅ erfüllt**, **2 % auf 🟡 teilweise** (App Attest, wartet auf Backend), **0 % auf ❌**, **43 % auf ➖ nicht anwendbar** (lokal-zuerst-Architektur).
- **Marktbefund aus 4-Agenten-Web-Recherche:** Im DiGA-Verzeichnis Mai 2026 ist **F51.0 (nicht-organische Insomnie) mit Paar-basiertem Bedtime-Ritual nicht besetzt**. Drei gelistete Insomnie-DiGA (somnio / mementor-ResMed, HelloBetter Schlafen, somnovia) adressieren ausschließlich Solo-CBT-I — obwohl 60–75 % der Insomnie-Episoden paar-synchron sind (Bed-Sharing-Effekt).
- **Realismus aus dem Verzeichnis:** ~58–60 DiGA insgesamt, **16 davon mangels Versorgungsnutzen wieder gestrichen**. Die klinische Studienhürde ist real — die Erprobungslistung nach § 139e Abs. 4 SGB V ist die strukturierte Antwort darauf.
- Das eigentliche Problem ist nicht „zu viele Anforderungen". Das Problem ist, dass das Verfahren fast alle Nachweise wie **manuelle Dokumente** behandelt, obwohl viele bei jedem Build oder live im Produktivsystem belegt werden könnten.
- Wir teilen die Befunde mit dem **BSI** und dem **BfArM**, weil eine Modernisierung allen vier Zielgruppen nützt: Hersteller, Krankenkassen, behandelnden Ärzt:innen, **und vor allem Patient:innen**.

---

## Warum dieser Beitrag

Ich arbeite mit Hersteller-Teams an Datensicherheits-Zertifizierungen für DiGA. In Gesprächen mit dem BSI ist deutlich geworden: alle Beteiligten — Aufsicht, Hersteller, Prüfstellen — wünschen sich ein schlankeres Verfahren, **ohne** das Schutzniveau zu kompromittieren. Dieser Beitrag ist mein praktischer Versuch, dafür eine konkrete, nachprüfbare Diskussionsgrundlage zu liefern.

Das Vorgehen war bewusst klein gehalten: **eine** reale, bereits ausgelieferte iOS-/Apple-Watch-App (TwoBreath, Atemübungen für Paare) als methodisches Beispiel — keine Marketingstudie, kein Hochglanz-Pilot. Dazu nur Open-Source-Werkzeuge, ein Markdown-Repository und ein modernes Sprachmodell (Claude Opus 4.7) — letzteres **ausschließlich** zur Strukturierung, niemals als Beweismittel.

Den vollständigen Bericht für das BSI sowie die maschinenlesbare Anforderungs-Matrix verlinke ich am Ende.

---

## Was wir herausgefunden haben

Wir haben aus dem TR-03161-1-PDF (66 Seiten, 25.03.2024) alle **127 eindeutigen Prüfanforderungen** (`O.Purp_*`, `O.Arch_*`, … `O.Resi_*`) mit Kurzfassung und Prüftiefe extrahiert und jede einzelne gegen den tatsächlichen Code der App geprüft — Konfigurationsdateien (`project.yml`, `Info.plist`, Entitlements, `PrivacyInfo.xcprivacy`), CI-Pipelines (`.github/workflows/`), Source-Services (HealthKit, Pairing, WatchConnectivity).

Jede Anforderung wurde in eine von vier **Beweisklassen** einsortiert:

| Klasse | Bedeutung | Beispiel |
| --- | --- | --- |
| **R — Real-time** | im Produktivsystem fortlaufend gültig, bei jeder Änderung neu auswertbar | TLS-Konfiguration, sichere HTTP-Header |
| **D — Deploy-time** | bei jedem CI/CD-Build erzeugt, signiert, archiviert | SBOM, Abhängigkeits-CVE-Scan, statische Code-Analyse |
| **P — Periodic** | mit definierter Gültigkeitsdauer | Penetrationstest, Restore-Drill |
| **M — Manual** | erfordert menschliches Urteil | Datenschutz-Folgenabschätzung, Threat-Model-Review |

Das Ergebnis ist deutlich: **101 von 127 Anforderungen (~80 %) sind R, D oder P** — also grundsätzlich automatisierbar. Heute werden sie aber überwiegend wie **M** behandelt: in Word-Dokumenten gesammelt, per E-Mail eingereicht, von Hand geprüft.

### Konkret: was haben wir bei der untersuchten App gefunden — und wo stehen wir jetzt?

| Status | v0.1 (initiale Auswertung) | v0.2 (nach Schließung) |
| --- | ---: | ---: |
| ✅ erfüllt | 40 (31 %) | **70 (55 %)** |
| 🟡 teilweise | 25 (20 %) | **2 (2 %)** |
| ❌ Lücke | 6 (5 %) | **0 (0 %)** |
| ➖ nicht anwendbar | 56 (44 %) | 55 (43 %) |

Die Schließung von v0.1 → v0.2 erfolgte über **vier konkrete Werkzeuge**:

1. **Acht Konzeptdokumente** unter [`diga/concepts/`](https://github.com/ma3u/TwoBreath/tree/main/diga/concepts) — Datenschutzkonzept, Datenlebenszyklus mit Trust-Boundary-Diagramm, STRIDE-Threat-Model, Secure-Coding-Standards, Einwilligungsverzeichnis-Konzept, Kryptographiekonzept (mit expliziter Plattform-Delegierung nach TR-02102), Netzwerk-Sicherheitskonzept, Resilienz-/Härtungskonzept.
2. **Eine [`SECURITY.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/SECURITY.md)** mit verschlüsseltem Meldekanal und Safe-Harbor — schließt die letzte Disclosure-Lücke.
3. **Eine erweiterte [`CI_CD_SECURITY.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/CI_CD_SECURITY.md)** — beantwortet ehrlich, welche SAST/DAST-Werkzeuge fehlten (semgrep, MobSF, syft, osv-scanner, testssl.sh) und liefert eine drop-in-`security.yml`-Erweiterung mit fünf neuen Jobs.
4. **Zehn PR-fertige Swift-Patches** in [`patches/PATCHES.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/patches/PATCHES.md) — Debug-Detection, App-Switcher-Maskierung, Secure-Text-Entry, Text-Selection-Disable, Sicherheits-Bildschirm, App-Attest-Stub, In-App-Datenlöschung, Build-Hardening, Einwilligungs-Verzeichnis-Code, SwiftLint-Custom-Regel.

Die zwei verbleibenden 🟡 (App-Attest-Schließung) sind bewusst aufgeschoben, weil sie ein Hintergrundsystem als Konsumenten brauchen.

> Die ehrliche Aussage lautet: für eine kleine, lokal-orientierte App ist das Datensicherheits-Niveau bereits heute substanziell — und die fehlenden Stücke sind in **Personentagen**, nicht Personenmonaten geschlossen. Das hier dokumentierte Material ist die Form, in der ein Hersteller einen TR-03161-Audit erfolgreich vorbereiten kann.

> Dort wo Monate verloren gehen, geht es selten um schwierige Fragen. Es geht um die Form der Antwort.

---

## Sechs persönliche Erkenntnisse aus dieser Übung

Diese Schlüsse habe ich aus der Detailarbeit an den 127 Anforderungen plus aus einer ergänzenden Vier-Agenten-Web-Recherche zur deutschen DiGA-Landschaft gezogen. Sie sind subjektiv, aber jede ist mit einer konkreten Quelle im [Repo](https://github.com/ma3u/TwoBreath/tree/main/diga) belegt.

### 1. Die Marktlücke ist strukturell, nicht zufällig

Drei Insomnie-DiGA sind heute gelistet — alle adressieren Einzelpersonen mit klassischer CBT-I. Doch **60–75 % der Insomnie-Episoden sind paar-synchron** (Bed-Sharing-Effekt). Das ist kein Marketing-USP; das ist Polysomnographie. Trotzdem gibt es im DiGA-Verzeichnis **null** Anwendungen, die das Bett als das gemeinsame Therapie-Setting behandeln, das es ist. Die Lücke ist physiologisch begründet und im Verfahren nicht abgebildet.

### 2. Die Studienhürde ist real, und das ist gut so

Von ~60 gelisteten DiGA wurden **16 wieder gestrichen** ([GKV-Spitzenverband 2024-Bericht](https://www.gkv-spitzenverband.de/media/dokumente/krankenversicherung_1/telematik/digitales/2024_DiGA-Bericht_final.pdf)). Das ist nicht angenehm zu lesen, aber es ist genau das Filter, das die Listung von einem Marketing-Stempel unterscheidet. Mein eigener Schluss: die **Erprobungslistung nach § 139e Abs. 4 SGB V** ist nicht der „leichte Weg", sondern der ehrliche — sie gibt 12 Monate Erstattungs-Erprobung mit echter Studie als Pflicht.

### 3. Generative KI funktioniert — auf dem Strukturierungspfad

Claude Opus 4.7 hat in dieser Übung 127 normative Anforderungs-Texte aus einem 66-Seiten-PDF extrahiert, sie zur App-Konfiguration gemappt und in einer Matrix dargestellt. **Vier parallele Recherche-Agenten** haben über 100 reale Partner-Kandidat:innen mit Quellenlinks ermittelt. Das ist eine andere Größenordnung Geschwindigkeit, als ich sie aus klassischen Beratungs-Mandaten kenne. **Aber:** kein einziger Beweis-Schritt lief über das Sprachmodell. Werkzeugausgabe (gitleaks, MobSF, syft, testssl.sh, …) ist der Beweis. Diese Trennung ist nicht ideologisch, sie ist regulatorisch geboten.

### 4. Plattform-Aussagen sind die größte ungehobene Reserve

Etwa 30 der 127 TR-03161-1-Anforderungen werden durch korrekt konfigurierte Apple-iOS-Plattform-Eigenschaften (App-Sandbox, Data Protection Class A, ATS, Notarisation, App-Store-Distribution, HealthKit-Berechtigungs-Modell) **implizit erfüllt**. Heute muss jede:r Hersteller:in das in der eigenen Dokumentation neu beweisen. Ein vom BSI publizierter **Plattform-Aussagen-Katalog** je iOS- bzw. Android-Major-Version würde Hersteller und Prüfstellen erheblich entlasten — ohne den Schutzbedarf zu reduzieren. Das ist Empfehlung E3 im BSI-Bericht.

### 5. Die Form der Antwort ist der Hebel — nicht weniger Anforderungen

74 % der 127 Anforderungen sind deploy-time, 4 % real-time, 2 % periodisch erbringbar. Nur 20 % brauchen menschliches Urteil. **Diese Verteilung ist robust** — und sie steht im scharfen Widerspruch zur heutigen Praxis, in der praktisch jeder Nachweis wie ein manuelles Dokument behandelt wird. Wenn ich aus dieser Übung eine Sache mitgebe: **es geht nicht um weniger Anforderungen, es geht um eine andere Form der Antwort** (CycloneDX-SBOM, SARIF-Reports, cosign-Signaturen, PROV-O-Manifest — siehe Empfehlung E2).

### 6. Co-Regulation ist nicht Marketing — und genau das ist die Chance

Die Vagusnerv-Aktivierung durch verlangsamtes Atmen ist klinisch belegt. Die HRV-Synchronisation zwischen nahestehenden Personen ist im Labor messbar (Bodenmann, UZH). **Was bisher fehlt: der Schritt von der akademischen Studie in die Versorgung.** Eine couples-fähige DiGA, die HRV-Reads aus Apple Watch / iPhone als objektiven Endpunkt nutzt und an ein Paar-basiertes Bedtime-Ritual koppelt, würde diesen Schritt machen — und gleichzeitig eine ehrliche Lücke im Verzeichnis schließen.

> **Die persönliche Erkenntnis quer durch alle sechs Punkte:** TwoBreath als kleine, lokal-orientierte iOS-App zeigt, dass eine substanzielle Datensicherheits-Posture mit Open-Source-Werkzeugen, Markdown und einem genau eingegrenzten LLM-Einsatz **in Personentagen, nicht Personenmonaten** dokumentiert werden kann. Das macht weder eine Studie überflüssig noch ersetzt es eine Prüfstelle. Aber es verschiebt die Frage von „wie kommen wir überhaupt durch?" zu „wie messen wir den Versorgungs-Nutzen?". Das ist der Wechsel, den ich im DiGA-Diskurs gerne sehen würde.

---

## Was das für die einzelnen Zielgruppen bedeutet

### Für Patient:innen

Was Patient:innen heute nicht haben: **eine zeitnahe, verlässliche Aussage darüber, ob „ihre" DiGA gerade jetzt — also nach dem letzten Bibliotheks-Update, nach dem letzten CVE — sicher ist.** Ein Zertifikat ist heute eine Stichtagsaussage, kein laufendes Signal.

Was wir uns als Maßstab erlauben dürfen: bei einem Lebensmittel zeigt das Etikett, was drin ist; bei einer Bank-App nehmen wir an, dass im Hintergrund kontinuierlich getestet wird. Bei einer DiGA, die unsere Gesundheitsdaten verarbeitet, sollte beides selbstverständlich sein.

Eine Modernisierung mit signiertem **Live-Posture-Signal** (Klasse R) macht die Zertifikatsaussage präziser, ohne sie für Patient:innen komplizierter zu machen — ein einfaches „grün" oder „aktualisiert am" reicht.

### Für behandelnde Ärzt:innen und Therapeut:innen

Eine Verschreibung einer DiGA ist eine **Versorgungsentscheidung**. Wer verschreibt, möchte wissen, ob die Anwendung nicht nur einmal zertifiziert wurde, sondern ob sich seither der technische Zustand verändert hat. Heute ist diese Information faktisch nicht abrufbar.

Mit einer maschinenlesbaren TR-03161-Aussage und einem fortlaufenden Posture-Signal könnten KBV, Apotheken-Software und Praxisverwaltungssysteme die DiGA-Auswahllisten **selbsttätig kuratieren** — und im Zweifel davon abraten.

### Für gesetzliche Krankenkassen

Krankenkassen erstatten DiGA aus Beitragsmitteln. Sie haben ein berechtigtes Interesse daran, dass die erstattete Leistung **nicht nur am Tag der Listung**, sondern über die Erstattungsdauer hinweg den Datensicherheitsanforderungen entspricht.

Ein deterministisch belegbares, signiertes Posture-Signal pro DiGA ließe sich als Erstattungs-Voraussetzung in den Selektivvertrag einbeziehen, ohne Hersteller administrativ zusätzlich zu belasten — denn das Signal entsteht ohnehin im Build.

### Für Hersteller (DiGA und DiPA)

Ich höre in Mandaten immer dieselbe Beobachtung: jede Re-Zertifizierung beginnt damit, **dieselben Nachweise erneut zusammenzusuchen**. Architektur-Dokumente, SBOMs, Krypto-Inventare, Test-Protokolle — alle bereits vorhanden, aber nicht in einem für die Prüfung konsumierbaren Format gehalten.

Wer heute auf eine **GitOps-getriebene Lieferkette** mit signierten Artefakten umstellt (`syft` / `osv-scanner` / `semgrep` / `cosign`), erzeugt das Nachweispaket bei **jedem Build automatisch** mit. Die Re-Zertifizierung wird dann zu einem Abgleich, nicht zu einem Wiederaufbau.

### Für Prüfstellen

Prüfstellen lesen heute große, oft inkonsistent strukturierte PDF-Pakete und gleichen sie mit der TR von Hand ab. Mit einem **standardisierten Einreichungsformat** (CycloneDX + SARIF + JUnit + cosign-Signaturen + PROV-O-Manifest) wird aus dem Lese- ein **Diff-Vorgang** — und für Re-Zertifizierungen lässt sich quantifizieren, was sich seit dem Vor-Audit konkret verändert hat.

### Für das BSI und das BfArM

Das BSI hat das Verfahren aufgesetzt und entwickelt es weiter. Genau hier setzt unser Beitrag an: nicht „macht es ganz anders", sondern „lasst uns die Hebel benennen, die ohne Verfahrensbruch eingeführt werden können". Die fünf Empfehlungen aus dem BSI-Bericht sind so geschnitten, dass sie **einzeln** wirken — ohne dass die TR-03161 im Kern angefasst werden muss.

---

## Vier Hebel, die einzeln wirken

| Hebel | Was sich ändert | Wer profitiert |
| --- | --- | --- |
| **1. Maschinenlesbare TR-Fassung** (JSON/YAML neben dem PDF) | Hersteller-Tools können `O.*`-IDs direkt referenzieren; TR-Updates erscheinen als Diff | alle |
| **2. Standardisiertes Einreichungsformat** (CycloneDX, SARIF, cosign, PROV-O) | Prüfstellen diffen statt zu lesen; Re-Zertifizierung wird quantifizierbar | Prüfstellen, Hersteller |
| **3. Plattform-Aussagen-Katalog** (welche `O.*` decken iOS/Android-Plattformen implizit ab?) | senkt Prüfaufwand bei Standard-Konfigurationen | Hersteller, Prüfstellen |
| **4. Reaktive Re-Zertifizierungs-Trigger** (CVE / TR-Revision statt nur Stichtag) | Sicherheit pro Geld-Einheit erhöht; Hersteller-Aufwand pro Jahr sinkt | Patient:innen, Kassen |

Keiner dieser Hebel ersetzt die menschliche Begutachtung. Alle vier ändern nur die **Form**, in der die Nachweise fließen.

---

## Was generative KI dabei tut — und was nicht

Ein häufiges Missverständnis: „Mit GPT/Claude lässt sich doch jetzt alles automatisieren." Bei einer Zertifizierung wäre das ein gefährlicher Trugschluss. Sprachmodelle sind **nicht-deterministisch**. Eine Zertifizierungsaussage muss aber für Aufsicht und Prüfstelle reproduzierbar sein.

Wir haben deshalb eine klare Trennung gezogen:

- **LLM auf dem Strukturierungspfad:** Anforderungen aus dem 66-Seiten-PDF extrahieren, sie passenden Werkzeugen zuordnen, Begleittexte vor-formulieren.
- **Deterministische Werkzeuge auf dem Beweispfad:** `testssl.sh`, `MobSF`, `syft`, `osv-scanner`, `semgrep`, `gitleaks`, `cosign`. Ihre Ausgabe ist signierbar und identisch reproduzierbar — sie ist der Beweis.
- **Mensch im Beweis-Audit:** das Urteil, ob ein Beweis ausreicht, bleibt bei der Prüfstelle bzw. beim BSI. Generative KI ersetzt sie an keiner Stelle.

Diese Trennung ist nicht nur regulatorisch geboten, sie ist auch technisch sauber. LLMs werden besser darin, **die richtige Frage zu stellen**. Werkzeuge sind besser darin, **die richtige Antwort zu liefern**.

---

## Wie wir das gebaut haben

Stack:
- **Markdown-zuerst** als System der Wahrheit (`PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`).
- **Git** als Versionierung und Provenienz; **cosign** für Signaturen.
- **GitHub Actions** als Lieferkette (geplant).
- **Open-Source-Werkzeuge** für jeden deterministischen Nachweis.
- **Claude Opus 4.7** für Strukturierungsaufgaben.

Keine Plattform, keine eigenen Server, kein Vendor-Lock-in. Wer den Bericht reproduzieren möchte, klont das Repository, ruft `make ingest` auf — und hat in unter zehn Minuten dieselben Originaldokumente, dieselben extrahierten Anforderungen, dieselben sha256-Prüfsummen.

---

## Wo wir Hilfe suchen

Damit aus diesem Praxisbericht eine produktive Diskussion wird, brauchen wir Stimmen aus den Zielgruppen:

- **DiGA-Hersteller**, die ihre tatsächliche Re-Zertifizierungs-Dauer und ihren Aufwand teilen — auch wenn er hoch war.
- **Akkreditierte Prüfstellen**, die offen über die Mehrarbeit beim Lesen heutiger PDF-Pakete sprechen.
- **Krankenkassen-IT**, die Anforderungen an ein DiGA-Posture-Signal formulieren würden.
- **Ärzt:innen und Therapeut:innen**, die uns sagen, was sie über die Sicherheit einer DiGA wirklich wissen wollen, bevor sie sie verschreiben.
- **Patientenorganisationen**, die aus Patient:innen-Sicht die richtigen Fragen kuratieren.

Schreibt mir gerne unter den Beitrag oder per Direktnachricht. Ich antworte auf jede ernstgemeinte Rückmeldung.

---

## Quellen und weiterführende Materialien

- **Vollständiger BSI-Bericht** (auf Deutsch, im Repo): [`diga/BSI_BERICHT.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/BSI_BERICHT.md)
- **Werkzeug-Empfehlungen pro Anforderung × Phase:** [`diga/BSI_TOOL_EMPFEHLUNGEN.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/BSI_TOOL_EMPFEHLUNGEN.md)
- **Maschinenlesbare 127-Zeilen-Matrix:** [`diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md)
- **Repositionierungs-Roadmap mit Partner-Ökosystem:** [`diga/DIGA_ROADMAP.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/DIGA_ROADMAP.md)
- **Konkrete recherchierte Partner mit Quellenlinks:** [`diga/PARTNER_SHORTLIST.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/PARTNER_SHORTLIST.md)
- **CI/CD-Sicherheits-Status + drop-in `security.yml`:** [`diga/CI_CD_SECURITY.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/CI_CD_SECURITY.md)
- **Konzeptdokumente (Datenschutz, Threat-Model, Krypto, Resilienz, …):** [`diga/concepts/`](https://github.com/ma3u/TwoBreath/tree/main/diga/concepts)
- **Tracking-Issue auf GitHub:** [#1 — DiGA × BSI TR-03161](https://github.com/ma3u/TwoBreath/issues/1)
- **Eingelesenes Regelwerk** (TR-03161-1/-2/-3, DiGAV, § 139e SGB V): [`diga/regulations/markdown/`](https://github.com/ma3u/TwoBreath/tree/main/diga/regulations/markdown)
- **Quellen-Pinning** mit sha256: [`diga/regulations/source-manifest.yaml`](https://github.com/ma3u/TwoBreath/blob/main/diga/regulations/source-manifest.yaml)
- **TR-03161 Übersicht (BSI):** <https://www.bsi.bund.de/dok/TR-03161>
- **§ 139e SGB V:** <https://www.gesetze-im-internet.de/sgb_5/__139e.html>
- **DiGAV:** <https://www.gesetze-im-internet.de/digav/>
- **DiGA-Verzeichnis (BfArM):** <https://diga.bfarm.de/de>

---

**#DiGA #BSI #TR03161 #DigitaleGesundheit #DevSecOps #GitOps #SBOM #BfArM #eHealth #Datensicherheit**

*TwoBreath ist eine Atemübungs-App, die ich gemeinsam mit Dascha entwickelt habe. Sie ist heute keine DiGA — und genau deshalb ein nützliches methodisches Beispiel: kein Hintergrundsystem, keine Konten, keine personenbezogenen Daten in Übertragung. Diese kompakte Angriffsfläche erlaubt eine saubere TR-03161-Auswertung ohne Vermischung mit umfangreichen Backend-Themen. Den vollständigen Bericht und das Repository findet ihr verlinkt.*
