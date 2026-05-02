# NOTICE — Drittquellen und Urheberrechte

Dieses Verzeichnis enthält neben eigenen Inhalten auch Auszüge aus offiziellen Drittquellen. Die jeweils kanonische Fassung verbleibt bei der Quelle; bei Abweichung gilt die Originalfassung.

## Eigene Inhalte (MIT-Lizenz, siehe [`LICENSE`](LICENSE))

- `PLANNING.md`, `MEMORY.md`, `COMPLIANCE_MATRIX.md`, `COMPLIANCE_MATRIX_TR1_OFFICIAL.md`,
  `BSI_BERICHT.md`, `LINKEDIN_ARTIKEL.md`, `GITHUB_ISSUE*.md`, `README.md`
- `scripts/*.py`, `scripts/*.sh`, `Makefile`
- `evidence/tr1-twobreath-status.yaml`
- `regulations/source-manifest.yaml`

Copyright © 2026 Matthias Buchhorn-Roth.

## Drittquellen

### Bundesamt für Sicherheit in der Informationstechnik (BSI)

**Werke:**

- BSI TR-03161-1 *„Anforderungen an Anwendungen im Gesundheitswesen — Teil 1: Mobile Anwendungen"*, Version 3.0 vom 25.03.2024.
- BSI TR-03161-2 *„… Teil 2: Web-Anwendungen"*.
- BSI TR-03161-3 *„… Teil 3: Hintergrundsysteme"*.
- BSI TR-02102 *„Kryptographische Verfahren: Empfehlungen und Schlüssellängen"* (referenziert).

**Quelle / kanonische Fassung:** <https://www.bsi.bund.de/dok/TR-03161>

**Urheberrecht:** © Bundesamt für Sicherheit in der Informationstechnik. Die Verwendung in diesem Verzeichnis erfolgt zur Kommentierung und Diskussion im Sinne des regulatorischen Dialogs mit BSI-Referat DI 24. Auszüge sind als zitierte Stellen gekennzeichnet; verarbeitete Markdown-Fassungen unter `regulations/markdown/BSI-TR-03161-*.md` werden mit URL und sha256 in `regulations/source-manifest.yaml` referenziert.

Es wird auf die kanonische BSI-Fassung verwiesen. Bei Abweichungen gilt die offizielle PDF-Veröffentlichung des BSI.

### Bundesministerium der Justiz / Bundesamt für Justiz (gesetze-im-internet.de)

**Werke:**

- *Verordnung über das Verfahren und die Anforderungen zur Prüfung der Erstattungsfähigkeit digitaler Gesundheitsanwendungen in der gesetzlichen Krankenversicherung* (Digitale-Gesundheitsanwendungen-Verordnung — **DiGAV**), §§ 1–43 inkl. lit. a/b sowie 23a–23e.
- § 139e *Sozialgesetzbuch (SGB) Fünftes Buch (V) — Verzeichnis für digitale Gesundheitsanwendungen*.

**Quelle:** <https://www.gesetze-im-internet.de/digav/> · <https://www.gesetze-im-internet.de/sgb_5/__139e.html>

**Urheberrecht:** Amtliche Werke gemäß **§ 5 UrhG** sind nicht urheberrechtlich geschützt; Reproduktion ist zulässig. Es wird auf die kanonische Fassung verwiesen.

### Verwendete Open-Source-Werkzeuge

Die im Methodik-Abschnitt genannten Werkzeuge bleiben unter ihren jeweiligen Lizenzen — `pdftotext`/poppler, `pandoc`, `gitleaks`, `swiftlint`, `osv-scanner`, `syft`, `cosign`, `testssl.sh`, `MobSF`, `semgrep`, `presidio`, `BeautifulSoup4`, `pyyaml` u. a. Im Repo selbst werden diese Werkzeuge nicht mitgeliefert, sondern lediglich aufgerufen.

## Änderungsverfahren

Sollte eine Drittquelle eine Entfernung oder Anpassung des hier verwendeten Auszugs wünschen, erreichen Sie den Autor über das verlinkte LinkedIn-Profil oder per GitHub-Issue. Wir reagieren zeitnah.
