# Security Policy — TwoBreath / DiGA-Dossier

**Geltungsbereich:** dieses Verzeichnis (`diga/`) sowie die Anwendung TwoBreath in den Repositories `ma3u/TwoBreath` (Marketing-Website) und `ma3u/TwoBreath-app` (iOS / watchOS).

**TR-Anforderung:** schließt [O.Arch_9](COMPLIANCE_MATRIX_TR1_OFFICIAL.md) (BSI TR-03161-1) — *„Der Hersteller MUSS dem Nutzer eine barrierearme Möglichkeit bereitstellen, um Sicherheitsprobleme zu melden. Die Kommunikation SOLL über einen verschlüsselten Kanal stattfinden."*

---

## Wie melde ich eine Sicherheitslücke?

### Schnellpfad

- **E-Mail (verschlüsselt empfohlen):** `security@twobreath.com`
- **GitHub Private Vulnerability Reporting:** <https://github.com/ma3u/TwoBreath/security/advisories/new>
- **Signal-Nummer auf Anfrage:** über LinkedIn-Direktnachricht an [Matthias Buchhorn-Roth](https://www.linkedin.com/in/ma3u/) erfragen.

> **Bitte verzichten Sie auf öffentliche GitHub-Issues für Sicherheitsmeldungen.** Anonyme Meldungen sind willkommen.

### Was Sie uns mitteilen sollten (sofern Ihnen bekannt)

1. **Beschreibung** der Schwachstelle in 2–5 Sätzen.
2. **Reproduktions-Schritte** — Plattform / Gerät / iOS-Version / App-Version (`Einstellungen → Über TwoBreath`).
3. **Impact** — was kann eine angreifende Partei tun?
4. **Vorgeschlagener Fix** (optional).
5. Ihre **bevorzugte Antwortform** (anonym, namentlich, Acknowledgements ja/nein).

## Verschlüsselter Kanal (PGP)

Wenn Sie verschlüsselt schreiben möchten, fordern Sie den aktuellen PGP-Schlüssel-Fingerprint per Klartext-E-Mail an `security@twobreath.com` an. Wir antworten mit dem aktuellen Public-Key + Fingerprint, den Sie über Out-of-Band-Kanal (z. B. LinkedIn-Profil) verifizieren können. Der Schlüssel wird mindestens jährlich rotiert; Roll-over wird über das Repository und LinkedIn angekündigt.

Alternative: Veröffentlicht via [keyoxide.org](https://keyoxide.org) (Identitätsbeweis verlinkt vom LinkedIn-Profil).

## Geltungsbereich

| Im Geltungsbereich (in scope) | Außerhalb (out of scope) |
| --- | --- |
| TwoBreath iOS-App (Bundle-ID `com.ma3u.twobreath`) | Drittanbieter-Dienste (App Store Connect, GitHub) — bitte direkt melden |
| TwoBreath watchOS-App | Apple-Plattform-Schwachstellen — direkt an Apple |
| Marketing-Website `twobreath.com` | physischer Zugang zum Gerät / Jailbreak-Setups |
| diga/-Dossier (Inhalte, Skripte, Auswertungen) | Social-Engineering / Spoofing |
| Sicherheits-Empfehlungen aus dem Dossier (Prozess-Vorschläge an BSI / BfArM) | Marketing-Inhalt / SEO |

## Reaktionszeit-Ziele

| Severity (CVSS-Indikation) | Erstantwort | Stellungnahme | Behebung |
| --- | --- | --- | --- |
| Kritisch (≥ 9.0) | binnen 24 h | binnen 72 h | so zeitnah wie möglich; Hot-Fix-Pfad |
| Hoch (7.0–8.9) | binnen 72 h | binnen 7 Tagen | Folge-Release |
| Mittel (4.0–6.9) | binnen 7 Tagen | binnen 14 Tagen | nächstes reguläres Release |
| Niedrig / Informativ | binnen 14 Tagen | nach Triage | bei Gelegenheit |

Diese Ziele sind ein Versprechen für ehrliche Mühe, kein juristischer Vertrag.

## Anerkennung (Hall of Fame)

Wenn gewünscht, listen wir Meldende mit Name (oder Pseudonym), Datum, kurzer Beschreibung der Klasse und einem Dank — sobald die Lücke behoben ist. Bei nicht-koordinierter Veröffentlichung bleibt der Eintrag unbenannt.

## Safe Harbor

Wir betrachten gutgläubige Sicherheits­forschung als Beitrag zur Patient:innen­sicherheit. Solange Sie

- nur **unbedingt notwendige** Daten einsehen,
- **keine** persönlichen Daten Dritter gefährden, exfiltrieren oder veröffentlichen,
- **keine** Dienste-Verfügbarkeit (DoS) absichtlich beeinträchtigen,
- bei der ersten Antwort eine **angemessene Frist** zur Behebung gewähren, bevor Sie veröffentlichen,

werden wir keine zivil- oder strafrechtlichen Schritte gegen Sie als Forschende einleiten und uns für andere Marken-/Plattform-Eigentümer einsetzen, dasselbe zu tun. Einzelne BfArM-/SGB-V-Pflichten der Hersteller können unabhängig davon bestehen.

## Hinweise zur Re-Zertifizierung

Sicherheitsmeldungen, die im Sinne von [§ 18 DiGAV](regulations/markdown/DiGAV.md#p18) als wesentliche Veränderung der Anwendung zu bewerten sind, lösen — sobald TwoBreath als DiGA gelistet wäre — die entsprechende Anzeigepflicht beim BfArM aus. Dieser Pfad ist hier dokumentiert, weil er für jede DiGA gelten würde, die ein eigenes [`SECURITY.md`](SECURITY.md) führt.

---

*Stand: 2026-05-02. Aktuelle Fassung: <https://github.com/ma3u/TwoBreath/blob/main/diga/SECURITY.md>.*
