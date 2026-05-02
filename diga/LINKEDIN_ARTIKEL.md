# Wir machen Re-Zertifizierung kürzer — ein DiGA-Praxisbericht

**Untertitel:** Wie moderne Software-Lieferketten, DevSecOps und generative KI die Datensicherheits-Zertifizierung digitaler Gesundheitsanwendungen nach BSI TR-03161 von Monaten auf Tage komprimieren können — ohne den Schutzbedarf der Patient:innen zu senken.

**Autor:** Matthias Buchhorn-Roth
**Veröffentlichung:** Entwurf v0.1, 2026-05-02
**Lesezeit:** ca. 7 Minuten

---

## TL;DR

- Eine DiGA muss seit 1.1.2025 ein BSI-Zertifikat nach **TR-03161** vorlegen. Heute dauert die jährliche Re-Zertifizierung **mehrere Monate** und bindet erhebliche Ressourcen.
- Wir haben anhand einer realen App **alle 127 Prüfanforderungen** der TR-03161-1 v3.0 einzeln gegen den tatsächlichen Code durchgearbeitet. Ergebnis: **80 % aller Anforderungen sind grundsätzlich deterministisch erbringbar** (74 % deploy-time, 4 % real-time, 2 % periodisch). Nur 20 % erfordern manuelles Urteil — überwiegend Dokumentations- und Konzeptarbeiten.
- Im konkreten Fall der untersuchten App stehen **31 % der Anforderungen auf ✅ erfüllt**, **20 % auf 🟡 teilweise**, **44 % auf ➖ nicht anwendbar** (lokal-zuerst-Architektur). Es bleiben **6 konkrete Lücken** — fünf reine Dokumentationen, eine 20-zeilige Code-Stelle.
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

### Konkret: was haben wir bei der untersuchten App gefunden?

| Status | Anforderungen | Anteil |
| --- | ---: | ---: |
| ✅ erfüllt | 40 | 31 % |
| 🟡 teilweise / Dokumentationslücke | 25 | 20 % |
| ❌ Lücke (konkret behebbar) | 6 | 5 % |
| ➖ nicht anwendbar (z. B. kein Backend, keine Konten) | 56 | 44 % |

Die sechs ❌-Lücken sind allesamt überschaubar:
- 1× verschlüsselter Vulnerability-Disclosure-Pfad (`SECURITY.md`)
- 1× Datenlebenszyklus-Designdokument
- 1× Hersteller-Verzeichnis der Nutzereinwilligungen
- 2× User-facing Sicherheits-Hinweise (ein Settings-Bildschirm)
- 1× Debug-Umgebungs-Erkennung beim Start (~20 Zeilen Swift)

> Die ehrliche Aussage lautet: für eine kleine, lokal-orientierte App ist das Datensicherheits-Niveau bereits heute substanziell — und die fehlenden Stücke sind in **Personentagen**, nicht Personenmonaten zu schließen. Was fehlt, ist primär die **strukturierte, signierte Verpackung**, die ein Auditor schnell konsumieren kann.

> Dort wo Monate verloren gehen, geht es selten um schwierige Fragen. Es geht um die Form der Antwort.

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

- **Vollständiger BSI-Bericht** (auf Deutsch, im Repo): `diga/BSI_BERICHT.md`
- **Maschinenlesbare 127-Zeilen-Matrix:** `diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md`
- **Eingelesenes Regelwerk** (TR-03161-1/-2/-3, DiGAV, § 139e SGB V): `diga/regulations/markdown/`
- **Quellen-Pinning** mit sha256: `diga/regulations/source-manifest.yaml`
- **TR-03161 Übersicht (BSI):** <https://www.bsi.bund.de/dok/TR-03161>
- **§ 139e SGB V:** <https://www.gesetze-im-internet.de/sgb_5/__139e.html>
- **DiGAV:** <https://www.gesetze-im-internet.de/digav/>
- **DiGA-Verzeichnis (BfArM):** <https://diga.bfarm.de/de>

---

**#DiGA #BSI #TR03161 #DigitaleGesundheit #DevSecOps #GitOps #SBOM #BfArM #eHealth #Datensicherheit**

*TwoBreath ist eine Atemübungs-App, die ich gemeinsam mit Dascha entwickelt habe. Sie ist heute keine DiGA — und genau deshalb ein nützliches methodisches Beispiel: kein Hintergrundsystem, keine Konten, keine personenbezogenen Daten in Übertragung. Diese kompakte Angriffsfläche erlaubt eine saubere TR-03161-Auswertung ohne Vermischung mit umfangreichen Backend-Themen. Den vollständigen Bericht und das Repository findet ihr verlinkt.*
