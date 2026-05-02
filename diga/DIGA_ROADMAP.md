# DiGA-Roadmap für TwoBreath — Repositionierung und Partner-Ökosystem

> Wie kommt eine als Wellness-App entwickelte iOS-Anwendung in das DiGA-Verzeichnis? Welche Blocker bestehen, in welcher Reihenfolge sind sie sinnvoll abzuarbeiten, und mit welchen Partner-Kategorien?

**Stand:** 2026-05-02 · Adressaten: TwoBreath-Team, potenzielle klinische Partner, Investor:innen.

---

## Inhaltsverzeichnis

- [1. Heutige Lage: drei Säulen, drei Blocker](#1-heutige-lage-drei-säulen-drei-blocker)
- [2. Klinische Positionierung](#2-klinische-positionierung)
- [3. MDR-Konformität](#3-mdr-konformität)
- [4. Klinischer Wirknachweis](#4-klinischer-wirknachweis)
- [5. Partner-Ökosystem](#5-partner-ökosystem)
- [6. Phasen-Plan mit Meilensteinen](#6-phasen-plan-mit-meilensteinen)
- [7. Finanzierung](#7-finanzierung)
- [8. Risiken und Mitigationen](#8-risiken-und-mitigationen)
- [9. Erste konkrete Schritte (90-Tage-Plan)](#9-erste-konkrete-schritte-90-tage-plan)

---

## 1. Heutige Lage: drei Säulen, drei Blocker

Eine DiGA-Listung verlangt nach [§ 139e Abs. 2 SGB V](https://www.gesetze-im-internet.de/sgb_5/__139e.html) drei kumulative Pillars:

| Säule | Was wird verlangt | TwoBreath heute | Blocker |
| --- | --- | --- | --- |
| **1. Sicherheit & Funktionstauglichkeit** | CE-Kennzeichnung als Medizinprodukt nach MDR (Klasse I oder IIa); ISO 13485 QMS; ISO 14971 Risikomanagement; IEC 62304 Software-Lebenszyklus | keine CE-Kennzeichnung; Wellness-Positionierung | **MDR-Konformität** |
| **2. Datenschutz & Datensicherheit** | BSI-Zertifikat nach TR-03161 (seit 1.1.2025) + GDPR-Art.-42-Zertifikat (seit 1.8.2024) | TR-03161-Vorbereitung weit fortgeschritten (siehe `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`) | **GDPR-Art.-42-Zertifikat fehlt** (kein direkter Blocker, aber notwendig) |
| **3. Positive Versorgungseffekte** | klinischer Nutzen oder patientenrelevante Struktur-/Verfahrensverbesserung; vergleichende Studie (typischerweise RCT-Qualität) | keine | **klinische Positionierung + Wirknachweis** |

Die Reihenfolge der Bearbeitung ergibt sich aus Abhängigkeiten:

```
   ┌──────────────────────┐
   │ klinische Positionierung │  (Säule 3 zuerst — definiert ALLES)
   └─────────────┬────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
 ┌──────────────┐   ┌──────────────────┐
 │ MDR-Klassif. │   │ klinischer Nutzen │
 └───┬──────────┘   └─────────┬─────────┘
     ▼                        ▼
 ┌──────────────┐    ┌─────────────────┐
 │ TR-03161-Cert│    │ Studie / Evaluation │
 │ + GDPR-Art-42│    │ (vorläufig oder    │
 │              │    │  endgültig)        │
 └──────┬───────┘    └────────┬─────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
             BfArM-Antrag
```

## 2. Klinische Positionierung

Diese Entscheidung kommt zuerst, weil sie **alle anderen** Schritte rahmt — von der Studie über die MDR-Klasse bis zur Erstattungs-Logik.

### 2.1 Optionen

| Option | ICD-10 | Kandidaten-Funktion | Stärken | Schwächen |
| --- | --- | --- | --- | --- |
| **A — Schlafstörung (Anxiety-related Insomnia)** | F51.0 / G47.0 | abendliches Atemritual + HRV-Tracking | starke Evidenz für Atemtechniken bei Insomnie; hohe Patient:innen-Zahl; Erstattungswege etabliert | sehr kompetitiv (z. B. somnio, HelloBetter Schlaf) |
| **B — Generalisierte Angststörung** | F41.1 | tägliches Co-Regulation-Atemritual; symptomatisches Tagebuch | Kerntechnik (4-7-8, Box-Breathing) gut belegt; Co-Regulation als Differenzierung | Studie aufwendiger; lange Beobachtungsfenster |
| **C — Akute Belastungsreaktion / Burnout** | F43.0 / Z73.0 | Paar- oder Solo-Atemritual; Workplace-Pilots | gute Marktnachfrage von Krankenkassen + Arbeitgebern (Demand-Side) | F43 ist Akut-Indikation, fragt schnelle Wirkung |
| **D — Depressive Episode mit Beziehungs-/Schlaf-Komponente** | F32.x | begleitend zur Psychotherapie | starker therapeutischer Bezug | F32 ist hoch-sensitiv; Wirkungsnachweis schwierig |
| **E — Bluthochdruck (essentiell, leicht)** | I10 | HRV-orientiertes Slow-Breathing | physiologische Evidenz solide; messbar | Class-IIa-MDR; Studie aufwändig |

### 2.2 Empfehlung

**Beginn mit Option A (F51.0 / G47.0 Insomnie)** und **B (F41.1 GAS)** parallel als Kandidaten-Indikationen. Begründung:

1. **Kerntechnik unverändert nutzbar.** TwoBreath kann Atemrhythmen-Programme bereits — die App-Engine bleibt wesentlich gleich.
2. **Etablierter Studien-Pfad.** Für Insomnie und GAS gibt es validierte Patient-Reported-Outcome-Skalen (PSQI, ISI für Insomnie; GAD-7 für Angst), die digitale Studien einfacher machen.
3. **Klare Erstattungswege.** Die DiGA-Verzeichnisse für G47.0 / F41.1 sind aktiv und Kassen-akzeptiert.
4. **Co-Regulation als USP.** Gegenüber Solo-Apps (Calm, Headspace, somnio) bleibt Paar-Atmung das Differenzierungs-Merkmal.
5. **Wertschöpfung durch HealthKit.** TwoBreath kann HRV-Reads und Schlaf-Daten aus HealthKit als objektive Outcome-Metriken nutzen — Wettbewerbsvorteil gegenüber rein selbstberichteten Apps.

Option C (Workplace-Burnout) bleibt als **B2B-Sekundärspur** parallel verfolgbar (Selektivverträge mit Krankenkassen für Versicherten-Programme), ohne die Haupt-DiGA-Linie zu verwässern.

### 2.3 Minimal Viable DiGA-Indikation (MV-DiGA)

| Element | Konkretion |
| --- | --- |
| Indikation | F51.0 (nichtorganische Insomnie) — Erst-Pilot |
| Zielgruppe | Erwachsene 18–65 mit ISI-Score ≥ 8 |
| Anwendungsfall | tägliches abendliches Atemritual (10–25 min) ± Partner |
| Nachweisbares Outcome | ΔISI über 8 Wochen; Sekundär: PSQI, HRV-Verlauf |
| Vergleichsarm | Wartelisten-Kontrolle (Stufe 1) → Schlafhygiene-PDF (Stufe 2) → ggf. anderer DiGA-Vergleich (Stufe 3) |
| MDR-Klassifikation | sehr wahrscheinlich Klasse I (keine direkte Therapieentscheidung; unterstützender Charakter) |

## 3. MDR-Konformität

### 3.1 Klassifikations-Logik

Nach MDR-Anhang VIII Regel 11 (Software): bestimmte Software ist Class IIa, wenn sie zu Diagnose-/Therapieentscheidungen beiträgt. Für **Insomnie-Begleitung ohne Diagnostik-Anspruch** ist Class I plausibel — vorausgesetzt, die Zweckbestimmung (Intended Use) ist eng formuliert: *„Unterstützung der nicht-pharmakologischen Behandlung von nichtorganischer Insomnie durch geleitete Atemübungen."*

### 3.2 Schritte

| # | Schritt | Aufwand | Schlüssel-Doku |
| --- | --- | --- | --- |
| 1 | **Intended Use** + Zweckbestimmung formal niederlegen | gering | Markdown im Repo, GxP-Format optional |
| 2 | **Risikomanagement nach ISO 14971** | mittel | Risikoakte mit Hazard-Analysis, Risk-Control-Measures, Residual-Risk-Acceptance |
| 3 | **QMS nach ISO 13485** etablieren | hoch | Prozess-Beschreibungen, SOP-Verzeichnis, CAPA-System |
| 4 | **Software-Lebenszyklus nach IEC 62304** dokumentieren | mittel | Anforderungs-Trace, V&V-Plan, Konfigurations-Management |
| 5 | **Klinische Bewertung nach MDR Anhang XIV** | mittel | Literatur-Review zu Atemtechniken bei Insomnie + eigene Studien |
| 6 | **CE-Konformitätserklärung** | gering | nach 1–5 abgeschlossen |
| 7 | **Benannte Stelle** (nur für Class IIa, bei Class I entfällt für Software ohne Mess-/Sterilisations-Funktion) | kein/hoch | TÜV SÜD, TÜV Rheinland, BSI Group, DEKRA |

Für Class I ohne Mess-Funktion ist **keine Benannte Stelle erforderlich** — der Hersteller erklärt CE-Konformität selbst. Das verkürzt den Pfad erheblich.

### 3.3 QMS-Aufbau ohne Overhead

Statt einer großen ISO-13485-Implementierung von Tag 1: **schlankes „MDR-tauglich"-QMS in Markdown** in Repos, mit klaren Prozess-Pfaden, das später ohne Bruch in ein zertifiziertes QMS überführt werden kann. Mehrere Hersteller (z. B. Smart Reporting, Brainami) haben das vorgemacht. Werkzeug-Stack:

- **Greenlight Guru** (kommerzielles eQMS für MedTech) — kostspielig, aber Audit-bereit
- **Matrix Requirements** — günstigere Alternative
- **Open-Source-Light:** Markdown-basierte SOPs in Git mit signierten Commits + Review-Pflicht

## 4. Klinischer Wirknachweis

### 4.1 Studien-Designoptionen für Erst-Listung

| Modell | Zeit | Kosten (grob) | Empfehlung |
| --- | --- | --- | --- |
| **Sofortlistung mit endgültigem Nachweis (§ 139e Abs. 2 SGB V)** | 18–36 Monate | 200–500 k € | Höhere Hürde; nur bei robustem Vor-Wissen |
| **Erprobungslistung (§ 139e Abs. 4 SGB V)** | 12 Monate Erprobung + 12–24 Monate Studie | 100–300 k € | **empfohlen** für Erst-Antrag |
| **Erprobung mit Verlängerung** | + bis zu 12 Monate | + 50 k € | Backup-Plan |

### 4.2 Erprobungs-Pfad — empfohlene Schritte

1. **Plausibilitäts-Begründung** (§ 139e Abs. 4 Satz 2 SGB V): Literatur-Review zur Wirksamkeit kontrollierter Atemübungen bei Insomnie + Argumentation, warum die App-vermittelte Intervention plausibel positive Versorgungseffekte erwarten lässt.
2. **Wissenschaftliches Evaluationskonzept** (von einer **herstellerunabhängigen Institution** zu erstellen — § 139e Abs. 4 Satz 2): typischerweise von einem Universitäts-Institut.
3. **BfArM-Antrag** auf Erprobungslistung — Bescheid binnen 3 Monaten.
4. **Erprobungsstudie** während der 12-Monats-Erprobungsphase: idealerweise RCT mit Wartelisten-Kontrolle, n ≥ 200 pro Arm.
5. **Endgültige Vorlage der Nachweise** an BfArM nach Erprobungs-Ende.

### 4.3 Studien-Mindeststandards (DiGA-Leitfaden)

- **Vergleichende Studie** mit angemessener Statistik (Power ≥ 80 %, α = 0.05).
- **Patientenrelevanter Endpunkt**, z. B. ISI-Reduktion ≥ 4 Punkte.
- **Adäquate Beobachtungsdauer** (8–12 Wochen typisch für Insomnie).
- **Open-Label-Design akzeptabel** (Verblindung schwierig bei App-Interventionen).

### 4.4 Datenmanagement der Studie

| Komponente | Werkzeug |
| --- | --- |
| Studien-Datenbank | REDCap (an einer Universität) oder EDC-Plattform (z. B. Castor EDC) |
| Patient-Reported Outcomes | iOS-Native In-App-Survey (ResearchKit) |
| HRV-/Schlaf-Daten | HealthKit-Reads, exportiert verschlüsselt zur Studien-DB |
| Statistik | R / Python (Statsmodels) — open source |
| Studien-Registrierung | DRKS oder ClinicalTrials.gov |
| Ethikvotum | Ethikkommission der studienführenden Klinik |

## 5. Partner-Ökosystem

Der wichtigste Punkt: **diese Aufgabe ist nicht alleinerledigbar.** Erfolgreiche DiGA-Hersteller arbeiten in Partner-Netzen.

### 5.1 Klinische Partner (Studien-Leitung + Validierung)

| Kategorie | Beispiele Deutschland | Wofür |
| --- | --- | --- |
| **Schlafmedizin** | Universitätsklinikum Frankfurt (Prof. Riemann, Schlafmedizin-Pionier); Charité Berlin (Schlafzentrum); Klinik für Psychiatrie LMU München; SOMNOmedics (Industrie-Forschungspartner) | Schlafmedizinische Studien-Leitung, Insomnie-Endpunkte |
| **Klinische Psychologie / Verhaltens-Therapie** | DGPPN-Mitglieder; HelloBetter / GET.ON-Forschungsteams; Lehrstuhl Berking (FAU Erlangen); Dr. Ebert (FAU Erlangen, Online-Therapie) | Studien-Design für GAS / F41.1 |
| **Allgemeinmedizin / Hausärzt:innen** | DEGAM (Deutsche Gesellschaft für Allgemeinmedizin) | Versorgungs-Realität, Verschreibungs-Pfad |
| **Couples Therapy / Paartherapie-Forschung** | Bildungs- und Forschungsinstitut Paartherapie (Dr. Christian Roesler); EFT (Emotionally-Focused Therapy)-Trainer:innen | Co-Regulations-Hypothese (das USP) |

### 5.2 Regulatorische Partner

| Kategorie | Beispiele | Wofür |
| --- | --- | --- |
| **Regulatory Consultants** | metecon (DiGA-spezialisiert); Health Innovation Hub (BMG-nah); Climedo (eQMS + Studien); Tentamus | DiGA-Antrag, MDR-Klassifikation, BfArM-Pre-Submission |
| **Benannte Stellen** (für Class IIa, falls notwendig) | TÜV SÜD; TÜV Rheinland; BSI Group; DEKRA | nur bei Hochstufung relevant |
| **Akkreditierte Prüfstellen für TR-03161** | mediteq; usd AG; SRC GmbH; secunet (regulierende-Schnittstelle); TÜV-Informationstechnik | BSI-Datensicherheits-Zertifizierung |
| **GDPR-Art.-42-Zertifizierungsstellen** | (Stand 2026 noch wenige akkreditiert; BfDI-Liste) | Datenschutz-Zertifikat |

### 5.3 Technische / Plattform-Partner

| Kategorie | Beispiele | Wofür |
| --- | --- | --- |
| **DiGA-Manager-Plattformen** | medudy (Connect-Plattform); diga.de (Reschke); DiGA-Manager.de | Verschreibungscode-Einlösung, ohne eigenes Backend zu bauen |
| **EHR-Integration** | gematik (TI/ePA-Schnittstelle); Vivy; CompuGroup CGM | wenn Datenrückfluss in die ePA gewünscht |
| **Cloud-Infrastruktur** (sobald Backend) | Open Telekom Cloud; Plusserver; STACKIT (Schwarz Digits); ionos cloud | C5/BSI-konforme deutsche Hyperscaler-Alternativen |
| **Identity / Authentication** | Auth0 (OIDC); Keycloak (self-hosted); KVNR-basierte Authentifizierung über gematik | falls Konten erforderlich |

### 5.4 Kostenträger / Vertriebs-Partner

| Kategorie | Beispiele | Wofür |
| --- | --- | --- |
| **Gesetzliche Krankenversicherung** | Techniker Krankenkasse (TK; früher DiGA-Adopter); BARMER; AOK Bayern; DAK | Selektivverträge, Versicherten-Programme parallel zur DiGA-Listung |
| **Private Krankenversicherung** | Allianz Private; AXA; Debeka | Erstattung auch bei privater Versicherung |
| **Berufsgenossenschaften** | DGUV (Schlaf-/Stress-Programme) | Workplace-Sekundärspur (Option C) |
| **Arbeitgeber-Programme** | Volkswagen (Wolfsburg, BGM-Programme); SAP (Health-Programme); Siemens; Bayer | B2B-Workplace-Track |

### 5.5 Forschungs- / Förder-Partner

| Kategorie | Beispiele | Wofür |
| --- | --- | --- |
| **BMBF / BMG-Förderprogramme** | „Innovative Medizintechnik" (BMG); „eHealth-Innovation" (BMBF); Innovationsfonds des G-BA | Pilot-Studien-Förderung |
| **EU-Förderung** | EIT Health (gefördert von EIT); Horizon Europe Health Cluster | über Konsortien |
| **Inkubatoren** | Flying Health (Berlin); Vision Health Pioneers; SmartHealth Accelerator | DiGA-spezifische Mentoring-Programme |
| **Grants / Stipendien** | MedTech Pioneers (HTGF); High-Tech Gründerfonds; Coparion | Frühphasen-Finanzierung |

### 5.6 Patientenorganisationen

| Kategorie | Beispiele | Wofür |
| --- | --- | --- |
| **Schlafstörungen** | Deutsche Gesellschaft für Schlafforschung und Schlafmedizin (DGSM); Hilfe für Patienten mit Schlafstörungen | Patienten-Stimme, Outcome-Relevanz |
| **Angststörungen** | Deutsche Angst-Hilfe e.V. | Studien-Rekrutierung, Patienten-Beirat |
| **Paarberatung** | EFT Deutschland; Bundeskonferenz für Erziehungsberatung | Co-Regulations-Markt |

## 6. Phasen-Plan mit Meilensteinen

| Phase | Dauer | Hauptaktivitäten | Meilenstein |
| --- | --- | --- | --- |
| **0 — Heute** | erledigt | Wellness-App im App Store; TR-03161-Vorbereitung dokumentiert | TwoBreath v1.5.5 live |
| **1 — Strategie + erste Partner** | 0–3 Monate | klinischen Erstpartner gewinnen; Förder-Antrag stellen; QMS-Light aufsetzen | LOI mit klinischem Lead-Investigator |
| **2 — MDR-Konformität (Class I)** | 3–9 Monate | Intended Use, ISO 14971 Risikoakte, IEC 62304 Trace, klinische Bewertung (Literatur) | CE-Erklärung Class I |
| **3 — TR-03161 + GDPR-Art.-42** | parallel zu Phase 2 | Patches einspielen, Prüfstelle beauftragen, Audit | beide Zertifikate erteilt |
| **4 — BfArM-Pre-Submission** | 9–12 Monate | Antrag auf Erprobungslistung; Evaluationskonzept finalisieren | Erprobungs-Bescheid BfArM |
| **5 — Erprobungsphase + Studie** | 12–24 Monate | RCT mit n ≥ 200/Arm; In-App-PRO-Erfassung; HRV-Endpunkte | Studien-Abschluss + Datenanalyse |
| **6 — Endgültige Listung** | 24–30 Monate | Vorlage Wirknachweise an BfArM | DiGA-Listung endgültig |
| **7 — Marktphase** | ab Monat 24 | Hausärzt:innen-Information, Kassen-Selektivverträge, Re-Zertifizierung jährlich | erste 1.000 Verschreibungen |

Realistisch: **24–30 Monate vom Start bis zur endgültigen DiGA-Listung**, davon 12 Monate Erprobungsphase mit bereits-Erstattung-fähiger App.

## 7. Finanzierung

### 7.1 Indikative Aufwände

| Posten | Niedrig | Mittel | Hoch |
| --- | --- | --- | --- |
| MDR-Konformität (QMS, Risikoakte, IEC-62304-Doku) | 30 k € | 60 k € | 120 k € |
| TR-03161-Audit (Prüfstelle) | 25 k € | 40 k € | 80 k € |
| GDPR-Art.-42-Zertifikat | 10 k € | 20 k € | 40 k € |
| Erprobungsstudie (RCT, n=400, online) | 100 k € | 250 k € | 500 k € |
| Regulatory Consulting (BfArM-Antrag etc.) | 20 k € | 50 k € | 100 k € |
| Personal (Product, Clinical, Reg, Eng) 24 Monate | 250 k € | 500 k € | 1.0 M € |
| **Gesamt** | **435 k €** | **920 k €** | **1.84 M €** |

### 7.2 Finanzierungs-Strategien

1. **BMG/BMBF-Grant + Eigenkapital**: typisch 50–60 % Förderung, Rest Eigenkapital.
2. **Strategische Partnerschaft mit Klinik**: Klinik trägt Studienkosten gegen Co-Authorship + Daten-Rechte.
3. **B2B-Vertrag mit Krankenkasse**: Kasse finanziert Selektivvertrags-Erprobung, was die DiGA-Studie stützt.
4. **Health-VC**: Earlybird Health, Heal Capital, Apollo Health Ventures, MTIP.
5. **Bridge-Modell**: parallele B2C-App-Store-Umsätze (nicht-DiGA-Funktionen), Workplace-B2B-Pilots — finanzieren die DiGA-Linie quer.

## 8. Risiken und Mitigationen

| Risiko | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Studien-Endpunkt nicht erreicht | mittel | hoch | Erprobungslistung gibt 12 Monate Puffer; Verlängerung möglich |
| MDR-Klassifikation steigt auf IIa | niedrig | mittel | Intended Use eng halten; Pre-Submission-Beratung mit Benannter Stelle früh |
| TR-03161-Audit verzögert sich | niedrig | mittel | Vorbereitung weit vor Audit-Termin (siehe `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`) |
| Partner-Klinik springt ab | mittel | hoch | parallele Backup-Partner (mind. zwei Klinik-Optionen) |
| Wettbewerb hat schnellere Listung | mittel | mittel | Co-Regulation als USP differenziert; Workplace-Track als Markteintritt |
| Gesetzeslage ändert sich (DVG-Reform 2026?) | niedrig | hoch | Tracking via diga.bfarm.de + BMG-News; flexibler Studien-Plan |
| Reimbursement-Preis sinkt | mittel | mittel | nicht primär für ROI-Optimierung optimieren; Markenaufbau |

## 9. Erste konkrete Schritte (90-Tage-Plan)

| Tag | Aktion | Verantwortlich | Output |
| --- | --- | --- | --- |
| 1–14 | Kick-off-Memo „TwoBreath als DiGA" intern; Eignungs-Diskussion | Founder | Beschluss go/no-go |
| 14–30 | Outreach an 5 schlafmedizinische / klinische-psychologische Lehrstühle (Frankfurt, Charité, FAU Erlangen, LMU, Lübeck) | Founder | 1–2 LOI |
| 30–45 | DiGA-Antrag-Beratung beim BfArM (kostenlos, § 139e Abs. 8 SGB V) | Founder + Reg-Berater:in | Pre-Submission-Notiz BfArM |
| 30–60 | Förder-Antrag beim Innovationsfonds (G-BA) oder EIT Health vorbereiten | Founder + Klinik-Partner | Antrag eingereicht |
| 30–60 | TR-03161-Prüfstelle anfragen (mediteq, usd AG, SRC) | Founder | Angebot 3 Stellen |
| 45–75 | Intended Use + ISO-14971-Risikoakte (Light-Version) verfassen | Founder + Reg-Berater:in | MDR-Light-Paket |
| 60–90 | Patches aus [`patches/PATCHES.md`](patches/PATCHES.md) in App eingespielt | Founder | TwoBreath v1.6 mit Sicherheits-Härtung |
| 60–90 | CI-Pipeline um Werkzeuge aus [`CI_CD_SECURITY.md`](CI_CD_SECURITY.md) § 4 erweitern | Founder | erstes signiertes Evidence-Bundle |
| 75–90 | Studienprotokoll-Entwurf gemeinsam mit klinischem Lead | Founder + Klinik | DRKS-/Ethik-tauglicher Entwurf |

Nach Tag 90: Entscheidung **Antrag-stellen / weiter Vor-Arbeiten / pivotieren** auf Basis der Klinik-LOIs und der Förder-Antwort.

---

## Anhang — Empfohlene erste Anrufe (Beispielhafte Liste)

> *Das ist ein **Vorschlag**, nicht ein bestätigtes Beziehungs-Bild. Reale Outreach immer mit individueller Vorbereitung pro Person/Institution.*

| Person / Stelle | Rolle | Warum jetzt anrufen |
| --- | --- | --- |
| **Prof. Dieter Riemann** (Universitätsklinikum Frankfurt) | Pionier deutscher Schlafmedizin-Studien | klinische Validierung Insomnie-Indikation |
| **Prof. David Ebert** (FAU Erlangen-Nürnberg) | Online-Therapie + DiGA-Studien | Studien-Methodik für digitale Interventionen |
| **Sven-David Müller** (BfArM, DiGA-Verzeichnis) | DiGA-Antragsverfahren | kostenlose Pre-Submission-Beratung |
| **Heal Capital** (Berlin) | Health-VC mit DiGA-Fokus | Frühphasen-Beteiligung |
| **mediteq** | TR-03161-Prüfstelle | Audit-Vorbereitung & Pilot-Einreichung |
| **HelloBetter / GET.ON-Team** | erfahrene DiGA-Hersteller | informeller Erfahrungs-Austausch |
| **Krankenkassen-DiGA-Stellen TK / BARMER** | Versorgungs-Innovation | Selektivvertrag parallel zur Listung |

---

**Querverweis:** [`PLANNING.md`](PLANNING.md) § 4–5 (Eignungsanalyse), [`BSI_BERICHT.md`](BSI_BERICHT.md) (TR-03161-Säule), [`COMPLIANCE_MATRIX_TR1_OFFICIAL.md`](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) (Datensicherheits-Status), [`BSI_TOOL_EMPFEHLUNGEN.md`](BSI_TOOL_EMPFEHLUNGEN.md) (operative Werkzeuge je Anforderung).
