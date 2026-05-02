# Resilienz- und Härtungskonzept (TwoBreath)

> Schließt: O.Arch_10, O.Plat_1, O.Plat_9, O.Plat_13, O.Resi_1, O.Resi_2, O.Resi_3, O.Resi_5, O.Resi_7, O.Resi_8.
> Stand: 2026-05-02.

## 1. Ziel

Die Anwendung soll in mehreren Stufen gegen Manipulationen, ungewöhnliche Laufzeit-Umgebungen und Reverse-Engineering robust sein, ohne durch übertriebene Härtung den legitimen Nutzen zu beeinträchtigen.

## 2. Stufenmodell

| Stufe | Maßnahme | Plattform-Eigenleistung | Hersteller-Eigenleistung |
| --- | --- | --- | --- |
| 1 | App-Sandbox | ✅ iOS-Default | nutzt sie |
| 2 | Code-Signatur + Notarisation | ✅ App Store-Pfad | hält Pfad ein |
| 3 | Compiler-Hardening (Stack-Canary, ASLR, NX, PAC) | ✅ Apple-Toolchain-Default | Konfiguration nicht überschreiben |
| 4 | Symbol-Stripping in Release | 🟡 abschaltbar | scharf stellen — siehe Patch |
| 5 | Mindest-iOS-Version | — | `deploymentTarget: iOS: '17.0'` |
| 6 | Erkennung Debug-Umgebung beim Start | — | ist umgesetzt — siehe Patch |
| 7 | App Attest (Geräteintegrität) | ✅ verfügbar | optional, kommentierter Pfad |
| 8 | Anti-Debugging (`PT_DENY_ATTACH`) | — | optional; abgewogen |
| 9 | Jailbreak-Heuristiken | — | optional; abgewogen |

Stufen 1–6 sind **harte Anforderungen**, Stufen 7–9 sind **abwägbare Ergänzungen**.

## 3. Stufe 5 — Mindest-iOS-Version (`O.Resi_2`)

`project.yml` erzwingt `deploymentTarget: iOS: '17.0'`. iOS 17 hat:

- Lockdown-Mode-Unterstützung,
- aktualisierte ATS-Cipher-Suite-Politik,
- aktualisiertes Privacy-Manifest-Modell.

Bei jeder iOS-Major-Version wird im Rahmen einer **halbjährlichen Sicherheits-Review** geprüft, ob die Mindestversion angehoben werden muss. Anlässe für eine außerordentliche Anhebung: kritische CVE in der Plattform, Apple-Withdrawal älterer iOS-Versionen aus dem Sicherheits-Update-Pfad.

## 4. Stufe 6 — Debug-Umgebungs-Erkennung (`O.Resi_3`)

In Release-Builds prüft die App beim Start via `sysctl(KERN_PROC, PID, …)` das `P_TRACED`-Flag. Ist es gesetzt, wird die App **sofort beendet**. Code-Patch in [`../patches/PATCHES.md` § 1](../patches/PATCHES.md). Die Prüfung läuft nur in Release; im Debug-Build ist sie abgeschaltet, damit Entwicklung möglich bleibt.

Alternative Erkennung über `getppid()` (parent process != `launchd`) ist nicht zuverlässig auf modernem iOS und wird nicht eingesetzt.

## 5. Stufen 7–9 — abwägbare Ergänzungen

### 5.1 App Attest / DeviceCheck (`O.Resi_5`, `O.Resi_7`)

Apple bietet `DCAppAttestService` für Hersteller-Backends, die die Authentizität der App-Instanz auf einem konkreten Gerät verifizieren wollen. Da TwoBreath kein Hintergrundsystem hat, gibt es heute keinen Konsumenten der Attestation — sie würde produziert, aber nicht verifiziert.

**Entscheidung:** App Attest ist **vorbereitet**, aber nicht aktiv. Code-Stub liegt unter [`../patches/PATCHES.md` § 6](../patches/PATCHES.md). Aktivierung mit Hinzufügen eines Hintergrundsystems.

### 5.2 Anti-Debugging via `PT_DENY_ATTACH`

Klassisch: `ptrace(PT_DENY_ATTACH, …)` verhindert das Anhängen eines Debuggers nach Start. **Bewertung für TwoBreath:**

- Vorteil: erschwert dynamisches Reverse-Engineering einer Release-App.
- Nachteil: Apple sieht `ptrace` aus iOS-Apps mittlerweile unterschiedlich; die Verwendung kann App-Review-Risiken bergen. In der Vergangenheit gab es Fälle abgelehnter Reviews wegen privater APIs.
- Wirksamkeit: durch Frida-Bypässe relativ einfach umgehbar.

**Entscheidung:** **nicht implementieren**. Dokumentiert hier, damit die Begründung in einer Prüfstellen-Sitzung einsehbar ist. Stattdessen verlassen wir uns auf Stufen 4 (Symbol-Stripping) und Apple-Plattform-Schutz.

### 5.3 Jailbreak-Heuristiken (`O.Resi_2`, `O.Resi_4`)

Klassisch: Prüfungen auf `/Applications/Cydia.app`, `/private/var/lib/apt`, `fork()`-Erfolg etc. **Bewertung:**

- Vorteil: schnelle, billige Heuristik.
- Nachteil: fehleranfällig, false positives, durch jeden Jailbreak-Hide-Tweak umgehbar.
- Risiko: Anwender:innen mit Jailbreak (selten, aber existent) werden ohne klaren Nutzen ausgesperrt.

**Entscheidung:** **nicht implementieren**, weil das Schutzziel (Vertraulichkeit der Daten) primär über Data Protection (verschlüsselt bei Geräte-Sperre) und HealthKit-Plattform-Kontrolle erreicht wird. Stattdessen: User-Hinweis zur Geräte-Sicherheit (Stufe 9 unten via Settings-Bildschirm).

## 6. Stufe „User-Hinweis" (`O.Plat_1`, `O.Plat_13`, `O.Resi_1`)

Ein In-App-Bildschirm *Einstellungen → Sicherheits-Empfehlungen* informiert über:

- iOS-Code-Sperre / Face-ID / Touch-ID empfehlung
- iOS-Updates installieren
- Pairing nur mit bekannten Personen
- Keine Jailbreak-Installation auf Geräten, die TwoBreath für Gesundheitsdaten nutzen
- Backup über iCloud (verschlüsselt) statt unverschlüsseltem iTunes-Backup

Der Bildschirm ist Teil von Patch [`../patches/PATCHES.md` § 5](../patches/PATCHES.md). Damit fallen O.Plat_1, O.Plat_13 und O.Resi_1 zusammen.

## 7. App-Switcher-Snapshot-Maskierung (`O.Plat_9`, `O.Data_13`)

Beim Übergang in den Hintergrund wird ein Maskierungs-View über sensible Anzeigen gelegt, sodass der iOS-App-Switcher-Screenshot keine HealthKit-Werte zeigt. Patch in [`../patches/PATCHES.md` § 2](../patches/PATCHES.md).

## 8. Reverse-Engineering-Schutz (`O.Resi_8`)

| Maßnahme | Wirkung | Aktiv |
| --- | --- | --- |
| Stack-Canary, ASLR, NX, PAC | erschwert Speicher-Exploits | ✅ Apple-Default |
| `STRIP_INSTALLED_PRODUCT`, `STRIP_SWIFT_SYMBOLS` | reduziert Reversibilität der Binärdatei | 🟡 wird in Patch scharf gestellt |
| Dead-Code-Elimination (Swift) | reduziert Angriffsfläche | ✅ Default |
| Symbol-Verschleierung | weiterer Schritt | ❌ nicht eingesetzt; Begründung Trade-off |

Wir setzen **keine** kommerziellen Obfuscation-Werkzeuge (z. B. Swift Shield, iXGuard) ein — die Gegenleistung für die zusätzliche Komplexität in Build und Debug ist zu gering, da TwoBreath weder eigene Krypto-Schlüssel noch DRM enthält.

## 9. Robustheit gegen Störungen (`O.Resi_10`)

Die `BreathingEngine` ist als reiner State-Machine-Code testbar (Tests in `Tests/`); Audio-Unterbrechungen (Anrufe, Alarme) werden via `AVAudioSession`-Notifications kontrolliert behandelt. CI testet sowohl iPhone- als auch Watch-Targets bei jedem PR (`ci.yml`).

## 10. Pflege

Halbjährliche Re-Validierung (siehe § 3 zur Mindestversion). Ad-hoc-Re-Validierung bei:

- iOS-Major-Update mit Sicherheitsänderungen
- Neuer CVE in einer genutzten Apple-API
- Apple-Toolchain-Default-Änderungen (z. B. neuer Compiler-Flag)

---

**Querverweis:** [`04-secure-coding-standards.md`](04-secure-coding-standards.md) § 6, [`../patches/PATCHES.md`](../patches/PATCHES.md), [`../CI_CD_SECURITY.md`](../CI_CD_SECURITY.md).
