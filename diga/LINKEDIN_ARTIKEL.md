# Aus Notwehr eine App gebaut — könnte sie auch DiGA werden?

**Autor:** Matthias Buchhorn-Roth
**Veröffentlichung:** Entwurf v0.4, persönliche Fassung, 2026-05-02
**Lesezeit:** ca. 8 Minuten

---

## Wie das angefangen hat

Dascha und ich haben irgendwann aufgehört, Subscriptions für Apps zu bezahlen, die uns nicht das gegeben haben, was wir gebraucht haben.

Atemübungen-Apps, Meditation, Schlaf-Tools — dreistellige Eurobeträge im Jahr für Software, die entweder nicht funktioniert hat, ihre wichtigsten Funktionen hinter einem nächsten Tier versteckt, oder uns als Einzelpersonen behandelt hat, obwohl wir die Übungen **gemeinsam** machen wollten. Und immer dieselbe Pop-up-Architektur: dreimal weggeklickt, einmal versehentlich verlängert.

Also haben wir aufgehört zu zahlen — und angefangen zu bauen.

[**TwoBreath**](https://www.twobreath.com) ist ein iOS-/Apple-Watch-Atemritual für **Paare**. Drei Jahre lang gemeinsam ausprobiert, jeden Morgen 15–25 Minuten: synchronisiertes Atmen, eine kurze Lesung, bewusster Augenkontakt. Was als Privatprojekt anfing — buchstäblich zwei Menschen, die ein Problem gelöst haben, das eine 10-Mrd-Dollar-Wellness-Industrie nicht für uns lösen wollte — ist heute eine App im App Store.

Und jetzt sitzen wir vor einer ehrlichen Frage:

> **Könnte TwoBreath eine DiGA sein?**

Ich kenne die Antwort noch nicht. Ich schreibe diesen Beitrag, um sie zu finden.

---

## Was eine DiGA überhaupt ist

Für die, die nicht täglich damit zu tun haben:

**DiGA** steht für **„Digitale Gesundheitsanwendung"** — Apps, die in Deutschland von Ärzt:innen verschrieben und von der gesetzlichen Krankenversicherung **erstattet** werden können. Seit 2020 gibt es das DiGA-Verzeichnis beim [BfArM](https://diga.bfarm.de/de). Aktuell sind dort etwa 60 Apps gelistet — gegen Insomnie, Angststörungen, Depressionen, Tinnitus, Rückenschmerzen.

Drei Hürden muss eine App nehmen, um darauf zu landen ([§ 139e SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html)):

1. **Sicherheit & Funktionstauglichkeit** — CE-Kennzeichnung als Medizinprodukt nach MDR.
2. **Datenschutz & Datensicherheit** — BSI-Zertifikat nach **TR-03161** (verpflichtend seit 1.1.2025) plus GDPR-Art.-42-Zertifikat.
3. **Positiver Versorgungseffekt** — klinischer Nutzen, belegt mit einer vergleichenden Studie. Üblicherweise ein RCT.

Klingt machbar, oder? Ich war auch optimistisch. Bis ich anfing, durch die Anforderungen zu lesen.

---

## Warum die Frage „kann das DiGA werden?" für uns nicht akademisch ist

Ich sage das offen: **wir sind selbst die Zielgruppe.**

Dascha und ich sind eine Patchwork-Familie. Wir bringen aus zwei vorigen Leben Kinder, Verantwortungen, Verluste, Vergangenheiten mit. Eines unserer Kinder ist Autist. ADHS taucht in unserem näheren Umfeld in mehreren Generationen auf. Eltern werden älter, Krisen kommen unangekündigt, Stress sammelt sich im Schlaf ab, der dann nicht mehr richtig wird. Wer in einer Patchwork-Familie lebt, kennt die Variante: man fällt nicht aus dem Funktionsmodus heraus — man **stürzt** heraus, irgendwann in einer Augustnacht um 3 Uhr.

Wir hätten gerne einen Therapeuten, der uns beim Sortieren hilft. **Termin: in sechs Monaten.** Falls überhaupt. In Großstädten ist die Lage ein bisschen besser, in Brandenburg deutlich schlechter, im Schnitt warten Patient:innen in Deutschland für eine kassenfinanzierte Verhaltenstherapie laut [Bundespsychotherapeutenkammer](https://www.bptk.de/) **fünf bis sieben Monate**. Wer kann, zahlt selbst, geht zu Heilpraktiker:innen oder ins Coaching. Wer nicht, wartet.

Und ehrlich gesagt: selbst mit Therapeut:in **bleibt** ein Stück Arbeit am Alltag bei einem selbst. Beziehungs-Co-Regulation, Stress-Runter-Atmen, Schlaf-Anstoßen — das kann ein Therapeut nicht für euch tun. Das müsst ihr **gemeinsam** üben, jeden Tag, in der Küche, bevor ihr ins Bett geht.

Genau dort ist TwoBreath gelandet: als kleines, tägliches **Paar-Werkzeug** zwischen den Therapie-Terminen.

---

## Warum eine Atem-App medizinisch überhaupt etwas zu suchen hat

Damit hier kein Wellness-Beipackzettel entsteht: die zugrundeliegende Physiologie ist relativ gut belegt.

- **Verlangsamtes Atmen aktiviert den Vagusnerv.** Das ist messbar in der Herzraten-Variabilität (HRV). Die Mechanismus-Beschreibung ist Standardstoff in der Schlafmedizin.
- **Right-Hemisphere-Aktivitäten** — gemeinsamer Augenkontakt, Atem-Synchronisation, leiser Lesung — verschieben Aktivität in die rechte Hirnhemisphäre. Arthur Brooks fasst die Forschungslage in *„Build the Life You Want"* (2023) zusammen. Das ist nicht „Esoterik", das ist neuro-funktionale Bildgebung.
- **Co-Regulation in Paaren ist im Labor reproduzierbar.** Guy Bodenmann (Universität Zürich, [paarlife.ch](https://www.paarlife.ch/)) hat über zwanzig Jahre Studien dazu publiziert. HRV synchronisiert sich zwischen vertrauten Personen. Stress-Crossover ist real — Stress-Down-Crossover auch.
- **Schlafprobleme sind in 60–75 % der Fälle paar-synchron.** Das ist der „Bed-Sharing-Effekt". Wer schlecht schläft, schläft selten allein schlecht.

Was bei dieser Forschungslage auffällt: **es gibt Studien. Es gibt eine Mechanismus-Erzählung. Es gibt sogar ein anerkanntes Versorgungsproblem (Therapeut:innen-Mangel, Wartezeiten).** Was fehlt, ist der Schritt von der akademischen Studie in die Versorgung.

---

## Was ich beim Lesen der DiGA-Anforderungen herausgefunden habe

Ich komme aus der **IT-Sicherheit / DevSecOps**. Mein Tagesgeschäft sind automatisierte CI/CD-Pipelines, Software-Lieferketten, Compliance-Prozesse. Wenn jemand einen 66-seitigen technischen Anforderungskatalog vor mich legt, dann ist das mein Heimspiel — andere lesen Krimis.

Also habe ich das mit **TwoBreath als Versuchsobjekt** gemacht: alle 127 Prüfanforderungen der **BSI TR-03161-1 v3.0** einzeln gegen den real existierenden iOS-/Apple-Watch-Code der App geprüft. Keine Marketing-Studie, keine Hochglanz-Slide. Eine Markdown-Datei, ein paar Open-Source-Werkzeuge, das Sprachmodell Claude Opus 4.7 als Strukturierungs-Helfer (niemals als Beweismittel — das wäre regulatorisch ein Problem). Vollständige Auswertung im Repo: [diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md](https://github.com/ma3u/TwoBreath/blob/main/diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md).

Das Ergebnis hat mich überrascht.

| Status | Anzahl | Anteil |
| --- | ---: | ---: |
| ✅ erfüllt | 70 | 55 % |
| 🟡 teilweise (App Attest, wartet auf Backend) | 2 | 2 % |
| ❌ Lücke | **0** | **0 %** |
| ➖ nicht anwendbar (z. B. keine Konten, kein Backend) | 55 | 43 % |

**Keine einzige offene Lücke.** Das war nach 8 Konzeptdokumenten, einer `SECURITY.md`, einer `CI_CD_SECURITY.md` und 10 PR-fertigen Code-Patches der Stand. Aufwand: gefühlte 20 Personentage, weil die Werkzeuge da sind und die App keine fremden Bibliotheken benutzt.

Auf der **Datensicherheits-Säule** könnte TwoBreath morgen den Audit gehen.

Nun, jedenfalls fast. Es gibt da noch zwei andere Säulen.

---

## Wo die DiGA-Hürden tatsächlich liegen — und das ist nicht die Datensicherheit

Der **Sicherheitsteil ist der einfachste Teil**, wenn man aus IT-Sicherheit kommt. Das, was wirklich schwierig wird, ist die **klinische Säule**.

**Hürde 1 — Klinische Positionierung.** Eine DiGA muss eine **konkrete Indikation** adressieren — eine ICD-10-Diagnose. „Wellness für Paare" ist keine Indikation. Wir müssten TwoBreath als Anwendung **gegen** etwas positionieren — Insomnie (F51.0 / G47.0), generalisierte Angst (F41.1), akute Belastung (F43.0). Aus der Markt-Recherche ist das klar: **F51.0 mit Paar-basiertem Bedtime-Ritual ist im DiGA-Verzeichnis nicht besetzt.** Drei Insomnie-DiGA sind heute gelistet (somnio, HelloBetter Schlafen, somnovia) — alle Solo-CBT-I. Niemand adressiert das gemeinsame Bett, in dem 60–75 % der Insomnie passiert.

**Hürde 2 — MDR-Konformität.** Eine DiGA ist ein Medizinprodukt. Wir bräuchten ein **CE-Zertifikat nach MDR**, eine ISO-14971-Risikoakte, IEC-62304-Software-Lebenszyklus-Dokumentation, ISO-13485-QMS. Die gute Nachricht: TwoBreath wäre vermutlich **MDR-Klasse-I** (keine Diagnose-Funktion, eng formulierter „Intended Use") — keine Benannte Stelle nötig, Selbsterklärung möglich. Das verkürzt den Pfad erheblich. Trotzdem ist das Doku-Arbeit, die wir bisher nicht hatten.

**Hürde 3 — Klinischer Wirknachweis.** Hier liegt das eigentliche Problem. Ich muss in einer **vergleichenden Studie** zeigen, dass TwoBreath einen **patientenrelevanten Effekt** hat. Üblich ist ein RCT mit 200 Patient:innen pro Studienarm, 8–12 Wochen Beobachtung, Endpunkt zum Beispiel ISI-Reduktion (Insomnia Severity Index). Diese Studie kostet **100.000 bis 500.000 Euro** und dauert **12 bis 24 Monate**.

Das ist ein Sprung. Und genau hier suchen wir Mitstreiter:innen.

---

## Realismus: was bei DiGA bisher nicht klappt

Nach dem Optimismus eine ehrliche Einordnung. Vom rund 60 in der Vergangenheit gelisteten DiGA wurden inzwischen **16 wieder gestrichen** ([GKV-Spitzenverband 2024-Bericht](https://www.gkv-spitzenverband.de/media/dokumente/krankenversicherung_1/telematik/digitales/2024_DiGA-Bericht_final.pdf)) — überwiegend, weil der Versorgungsnutzen am Ende der Erprobungs-Studien nicht ausreichend belegt werden konnte. Das ist nicht angenehm zu lesen, aber es ist exakt der Filter, der die Listung von einem Marketing-Stempel unterscheidet.

Mein Schluss: die **Erprobungslistung nach § 139e Abs. 4 SGB V** — 12 Monate Erstattung mit der Studie als Pflicht-Auftrag — ist nicht der „leichte Weg", sondern der **ehrliche**. Sie zwingt, vor und nach der Listung sauber zu evaluieren.

Was im DiGA-System aktuell zusätzlich knirscht:

- Der **Re-Zertifizierungs-Aufwand** ist hoch. Hersteller berichten von mehrmonatiger Bindung jährlich, fast komplett papierbasiert.
- Es gibt **noch keine DAkkS-akkreditierte GDPR-Art.-42-Zertifizierungsstelle** mit Geltungsbereich „DiGA / Gesundheits-App" — bis dahin gilt der DiGAV-§-4-Nachweis plus TR-03161 als de-facto-Pflicht.
- **Plattform-Aussagen** (etwa „dieser TR-Anforderungs-Aspekt wird durch iOS-Sandbox + Data Protection erfüllt") werden heute nicht zentral kuratiert. Jede:r Hersteller:in beweist das neu.

---

## Was ich aus der IT-Sicherheits-Brille beitragen kann — und wo ich Hilfe brauche

Ich kann sagen, was ich kann:

- **CI/CD-Pipelines mit Sicherheitswerkzeugen** wirken hier. Eine `security.yml`, die bei jedem Build SBOM (CycloneDX), CVE-Scan (osv-scanner), Mobile-Binär-Analyse (MobSF), Statik-Analyse (semgrep), Geheimnis-Scan (gitleaks) ausführt und **signierte Berichte** als Artefakt ablegt — das ist ein Tag Arbeit für jemanden mit DevSecOps-Hintergrund. Ich habe das für TwoBreath als drop-in-fertige Datei in [`CI_CD_SECURITY.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/CI_CD_SECURITY.md) hinterlegt.
- **Markdown als System der Wahrheit + signierte Artefakte als Beweis** ist eine valide Alternative zu großen QMS-Plattformen für eine Phase-1-DiGA. Ich glaube, das ist auch für andere Hersteller interessant.
- **Generative KI auf dem Strukturierungspfad** — Anforderungen extrahieren, Werkzeuge zuordnen, Begleittexte vorformulieren — funktioniert. Auf dem **Beweispfad** ist sie tabu, weil regulatorisch nicht reproduzierbar. Diese Trennung kann ich klar halten.

Ich kann **nicht**, was die anderen zwei Säulen brauchen:

- Ich bin **kein Schlafmediziner und kein klinischer Psychologe.** Den Wirknachweis muss ein Universitäts-Institut führen.
- Ich bin **kein Regulatory-Affairs-Experte.** Der MDR-Pfad und der BfArM-Antrag wollen Erfahrung, die ich nicht habe.
- Ich kann **keine RCT** finanzieren. 200.000 Euro sind ein anderer Ordnung als die App selbst.

Hier kommt der Aufruf.

---

## Wir suchen Mitstreiter:innen

Ich habe in den letzten Tagen 100+ konkrete Partner-Kandidat:innen mit Quellenlinks recherchiert ([`PARTNER_SHORTLIST.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/PARTNER_SHORTLIST.md)). Hier sind die Profile, mit denen wir gerne ins Gespräch kommen würden:

### Klinik / Forschung

- **Schlafmediziner:innen** mit CBT-I-Track-Record, idealerweise Anschluss an die [DGSM-AG Insomnie](https://www.dgsm.de/) (Riemann/Spiegelhalder-Tandem in Freiburg ist die Goldreferenz).
- **Klinische Psycholog:innen** mit DiGA-Studienerfahrung — zum Beispiel das Team um **Prof. Dr. David Daniel Ebert** an der TU München (sechs zugelassene DiGA, Co-Founder HelloBetter, [Protect Lab](https://www.protectlab.org/en/)).
- **Paartherapie-Forschende** wie **Prof. Dr. Guy Bodenmann** (UZH) — der einzige in DACH, der Co-Regulation als physiologischen Mechanismus methodisch sauber misst.
- **Universitäts-Institute** für die unabhängige Erprobungs-Evaluation. Charité Berlin, UK Freiburg, FAU Erlangen-Nürnberg, FU Berlin sind die plausiblen Optionen.

### Therapeut:innen-Praxis

- **Psychotherapeut:innen** in Niederlassung, die TwoBreath gerne **zwischen den Sitzungen** verschreiben würden. Wir möchten verstehen: was bräuchte eine App, damit ihr sie ohne schlechtes Gewissen empfehlen könnt? Was würde eure Arbeit erleichtern?
- **Paartherapeut:innen** und **EFT-Coaches** — die App ergänzt das Setting, sie ersetzt es nicht.

### Krankenkassen

- Die **TK** ist DiGA-Vorreiter; die **BARMER** hat mit dem [BIfG](https://www.bifg.de/projekte) ein eigenes Forschungsinstitut; **AOK Bayern** ist bei digitalen Selektivverträgen vorne. Wir würden gerne **parallel zur Erprobungslistung** Selektivvertrags-Optionen besprechen — gerade weil der Patchwork-Familien-Markt (couples + parenting + stress) für Kassen ein hoch relevantes Segment ist.
- Der Gedanke „**Familienpaket**": wenn Burnout-Risiko in beiden Eltern-Köpfen abgefedert wird, ist das mit hoher Wahrscheinlichkeit auch eine Investition in das Kind. Ich weiß noch nicht, wie man das versorgungsökonomisch fasst — aber ich glaube, jemand bei einer Kasse weiß es.

### Regulatorik

- **Eine BSI-anerkannte Prüfstelle für TR-03161** (secuvera, TÜV Informationstechnik, SRC sind unsere Top-Drei nach Recherche).
- **Das BfArM-Innovationsbüro** (`innovation@bfarm.de`) — die kostenlose Pre-Submission-Beratung nehmen wir auf jeden Fall in Anspruch.
- **Eine DiGA-erfahrene Regulatory-Beratung** für den MDR-Klasse-I-Pfad (metecon, Johner Institut, fbeta, QuickBird Medical).

### Finanzierung

- **Heal Capital**, **Earlybird Health**, **HTGF** als Investor:innen mit DiGA-Track-Record.
- **G-BA Innovationsfonds** — Bekanntmachung 19.06.2026, ideal für die F51.0-Erprobungsstudie.

---

## Vier offene Fragen, die ich nicht alleine beantworten kann

Wenn Sie Antworten oder Hinweise haben, freue ich mich über Kommentare oder eine Direktnachricht.

1. **Wo passt TwoBreath am besten ins DiGA-Verzeichnis?** Mein heutiger Tipp ist F51.0 (nicht-organische Insomnie) als Primär-Indikation und F41.1 (generalisierte Angst) als Sekundär-Indikation, weil die Markt-Lücke bei F51.0 paar-synchron strukturell ist und die Mechanismus-Erzählung über Vagus + HRV solide. Ist das aus klinischer Sicht plausibel?

2. **Wie melden wir am besten an?** Direkter Antrag oder Erprobungslistung nach § 139e Abs. 4? Mit oder ohne BfArM-Innovationsbüro-Sitzung vorab? Wer hat das durchexerziert und kann eine Stunde reden?

3. **Mit welchen Partnern starten wir?** Ein klinisches Tandem (Spiegelhalder/Riemann?) plus eine DiGA-Beratung (metecon? Johner?) plus eine Prüfstelle (secuvera?) plus eine Kasse (TK?) — wäre das die Formation? Übersehen wir etwas?

4. **Wie organisieren wir die Auflagen so, dass sie nicht das Produkt erdrücken?** Regelmäßige Security-Checks für das BSI-Zertifikat sind technisch lösbar (siehe `CI_CD_SECURITY.md`). Wirknachweis und Re-Zertifizierung jährlich — wie macht ihr das, ohne dass es das Team ein Quartal lahmlegt?

---

## Was wir nicht versprechen

- TwoBreath ist **nicht** eine Behandlung von Autismus oder ADHS. Es ist ein gemeinsames Atemritual. Es löst nicht die strukturellen Probleme — Therapeut:innen-Mangel, Versorgungslücken, gesellschaftliche Stress-Spirale. Aber es gibt zwei erwachsenen Menschen, die zusammen leben, ein **tägliches Werkzeug** zwischen den Therapie-Terminen.
- Wir sind **nicht** der nächste Headspace-Konkurrent. Wir bauen kein Imperium. Wir bauen ein Werkzeug, das wir selbst gerne hätten und teilen es.
- Die DiGA-Frage ist **echt offen**. Vielleicht ist das beste Ergebnis dieses Beitrags, dass jemand mit klinischer Erfahrung uns sagt: „Vergesst die DiGA, geht direkt zu den Kassen über § 140a und macht einen Selektivvertrag." Auch das wäre ein Erfolg.

---

## Repository (alles offen, alles reproduzierbar)

Wer technisch tiefer einsteigen will:

- 📋 **Komplettes DiGA-Dossier:** [github.com/ma3u/TwoBreath/tree/main/diga](https://github.com/ma3u/TwoBreath/tree/main/diga)
- 🩺 **Strategische Roadmap mit Partner-Ökosystem:** [`DIGA_ROADMAP.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/DIGA_ROADMAP.md)
- 🤝 **Recherchierte Partner-Liste mit Quellenlinks:** [`PARTNER_SHORTLIST.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/PARTNER_SHORTLIST.md)
- 📊 **127-Zeilen-TR-03161-Matrix mit Status:** [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/COMPLIANCE_MATRIX_TR1_OFFICIAL.md)
- 🛠 **CI/CD-Sicherheit (`security.yml`-Vorlage):** [`CI_CD_SECURITY.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/CI_CD_SECURITY.md)
- 📝 **BSI-Bericht (Behördendeutsch):** [`BSI_BERICHT.md`](https://github.com/ma3u/TwoBreath/blob/main/diga/BSI_BERICHT.md)
- 💬 **Tracking-Issue (öffentliche Diskussion):** [#1](https://github.com/ma3u/TwoBreath/issues/1)
- 🌐 **Die App selbst:** [twobreath.com](https://www.twobreath.com)

---

## Kontakt

Per Direktnachricht hier auf LinkedIn oder per E-Mail über [twobreath.com/contact](https://www.twobreath.com/contact.html).

Wer einen 30-Minuten-Slot für einen Kennenlern-Call erbittet — gerne. Ich antworte auf jede ernstgemeinte Rückmeldung.

— Matthias

---

*TwoBreath ist eine Atemübungs-App, die ich gemeinsam mit Dascha entwickelt habe. Wir sind keine Mediziner und keine Psychotherapeut:innen. Wir sind ein Paar, das ein Problem für sich selbst gelöst hat und sich jetzt fragt, ob das Werkzeug auch anderen Patchwork-Familien helfen könnte — und wenn ja, wie es im deutschen Versorgungssystem ankommt.*

## Hashtags

\#DiGA \#BSI \#TR03161 \#DigitaleGesundheit \#BfArM \#Krankenkassen \#Patchworkfamilie \#Schlafmedizin \#Paartherapie \#EHealth
