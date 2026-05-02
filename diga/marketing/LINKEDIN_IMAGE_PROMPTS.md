# Bild-Prompts für den LinkedIn-Beitrag

> Prompts für **Gemini Nano Banana 2** (Google Gemini 3 Pro Image), abgestimmt auf den Beitrag [`LINKEDIN_ARTIKEL.md`](../LINKEDIN_ARTIKEL.md) v0.4 („Aus Notwehr eine App gebaut — könnte sie auch DiGA werden?"). Fünf Bilder: ein Titelbild plus vier illustrative Begleitbilder.

**Stand:** 2026-05-02

## Globale Stilvorgaben

Damit alle fünf Bilder als Serie wirken, gelten dieselben Marken- und Stil-Anker. Diese Stil-Klausel kann jedem Einzelprompt vorangestellt werden.

```
Style anchors (apply to every image of this series):
- Editorial / publication aesthetic — Süddeutsche Zeitung Magazin / Zeit Magazin, never stock-photo / iStock / Getty.
- Documentary tone, candid, never staged.
- Warm muted palette: warm white (#F4EFE6), deep ink-navy (#0E1A2B), oxidized teal (#2E6E72), brushed gold (#C29A4B). Avoid neon, avoid corporate-blue gradient.
- Soft natural daylight, slight grain, gentle vignette.
- No screen text, no logos, no readable signs unless explicitly requested.
- No stylised tech-imagery clichés (no glowing circuit boards, no „matrix" greens, no robot hands).
- Diversity of bodies and ages where humans appear; mid-40s European couple as the main protagonist pair.
- LinkedIn safe: tasteful, professional, never sensational.
```

## Aspect-Ratio-Cheatsheet

| Verwendung | Ratio | Pixel (Empfehlung) |
| --- | --- | --- |
| LinkedIn-Artikel-Hero | 1.91 : 1 (≈ 16 : 9) | 1200 × 627 |
| In-Article-Illustration breit | 16 : 9 | 1600 × 900 |
| In-Article-Illustration quadratisch | 1 : 1 | 1080 × 1080 |
| Karussell-Folie (LinkedIn-Post) | 4 : 5 | 1080 × 1350 |

---

## 1. Titelbild — „Aus Notwehr eine App gebaut"

**Funktion:** Hero-Bild oben im LinkedIn-Beitrag. Soll auf den ersten Blick die Kernbotschaft transportieren — *zwei Menschen, gemeinsames Atemritual, alltäglich, deutsch, leise statt laut*.

**Aspect ratio:** **16 : 9** (LinkedIn-Hero, copy-Space rechts)

```
[Style anchors above]

Editorial photography, soft morning light through tall windows of a Berlin Altbau apartment.
A man in his late 40s and a woman in her early 40s sit cross-legged on a low cream-coloured
sofa, foreheads almost touching, eyes closed, breathing in synchrony. They wear comfortable
linen home clothes, no logos. Between them on a low oak coffee table: a thin iPhone showing
an abstract circular breathing animation in muted teal (no readable UI text). On his wrist, an
Apple Watch with a calm dial. Two ceramic mugs with tea, slight steam. Plants in clay pots in
the background, slightly out of focus. Subtle dust motes in the slanting light. Composition:
ultra-wide, the couple anchored in the left two-thirds, the right third left as gentle copy-space
(empty wall with picture rail). Documentary, candid, not posed. No screen text, no brand marks.

Aspect ratio: 16:9. Resolution target: 1600 × 900. Editorial photography, slight grain, no
filter look.
```

**Negative-Prompt-Hilfe** (falls separat unterstützt): `stock photography, smiling at camera,
glossy, oversaturated, neon, corporate blue gradient, glowing circuits, robot hand, posed
yoga studio, beach sunset, brand logos, readable text on screen.`

---

## 2. „Termin in sechs Monaten" — Patchwork-Alltag und Therapeut:innen-Mangel

**Funktion:** Begleitbild zum persönlichen Kontext-Abschnitt. Soll die Realität greifbar machen, ohne ins Stigmatisieren zu kippen — *Müdigkeit nach einem langen Tag, eine Wartezeit-Marke im Kalender, kein Drama, sondern Alltag*.

**Aspect ratio:** **4 : 3** oder **16 : 9** je nach Layout

```
[Style anchors above]

Editorial photograph, late evening light from a single warm pendant lamp over a worn oak
kitchen table in a German Altbau apartment. A mid-40s couple sit side by side, not facing each
other, both leaning slightly forward over the table. He is reading a paper bill with a furrowed
brow; she is looking thoughtfully at a wall-mounted school calendar where one date roughly
six months ahead is circled with a red felt-tip pen. The wider context — without making it
the centerpiece: a teenage child's pencil drawing of a smiling sun lies among scattered
school papers, two cold cups of coffee, an open laptop with the screen dimmed. The mood
is tender, slightly tired, real — not staged, not melancholic. No faces in sharp focus,
intentional shallow depth of field, faces partly cut by frame edges so the image stays about
the situation, not the individuals. Warm muted palette, late evening, no screen text.

Aspect ratio: 4:3. Resolution target: 1440 × 1080. Editorial documentary photography.
```

---

## 3. „Co-Regulation ist nicht Marketing" — synchronisierende HRV-Wellen

**Funktion:** Illustration für die Wissenschafts-Sektion (Vagusnerv, HRV-Synchronisation, Bodenmann). Abstrakt, **keine Menschenfiguren mit erkennbaren Gesichtern**, keine Krankenhausoptik. Soll den physiologischen Mechanismus visualisieren, ohne ihn zu medikalisieren.

**Aspect ratio:** **16 : 9**

```
[Style anchors above]

Editorial illustration in a vector-meets-screenprint aesthetic. Two flowing wave lines fill the
frame from left to right. The left wave is in deep oxidized teal, the right one in brushed gold.
On the left side of the frame, the two waves are clearly out of phase — different rhythms,
different amplitudes, gently chaotic. Toward the right side they progressively converge into
near-perfect synchrony. At the rightmost convergence point, a subtle paired silhouette
(two minimalist gestural figures in line-only style, almost calligraphic, no faces) is
suggested as a watermark behind the waves. Background: warm-white paper texture with
slight printing irregularities. No grid, no axes, no numbers, no readable text. Style references:
Saul Bass meets contemporary medical illustration in Lancet Digital Health. Limited palette:
warm white, ink-navy, oxidized teal, brushed gold.

Aspect ratio: 16:9. Resolution target: 1600 × 900. Vector-illustration aesthetic, NOT a photo,
NOT a 3D render.
```

---

## 4. „Die Form der Antwort" — strukturiertes Nachweispaket-Bündel

**Funktion:** Illustration für die Empfehlung E2 (CycloneDX + SARIF + cosign + PROV-O als Einreichungsformat). Soll **„Audit by Diff statt Audit by PDF-Reading"** vermitteln. Editorial-Infografik-Look, nicht Tech-Marketing.

**Aspect ratio:** **1 : 1** (gut für eingebettete Karussells und Quote-Cards)

```
[Style anchors above]

Editorial information-design illustration, isometric line-art, slightly printed paper texture in
warm white. A clean vertical pipeline of five stylized objects connected by thin signed-stamp
arrows downward:

1. At top: a sheet of paper with a Swift-style code snippet outline (no readable text, just
   indentation pattern).
2. A document tile labelled with the abbreviation „SBOM" in a small subtle stamp (this label
   is the only typography in the image and may appear).
3. A document tile with a tabular layout suggesting a CycloneDX bill-of-materials.
4. A signature seal — circular, embossed, suggesting cosign / sigstore aesthetics, with a
   small green checkmark.
5. At bottom: a closed folder labeled „Nachweispaket TR-03161" in a small stamp font.

Background: clean off-white with slight aged paper texture. Sparse green check-mark accents
to the right of each step. NO realistic human figures, NO laptops, NO desktop interface.
Style: Wired magazine info-graphic / Bauhaus poster, slightly print-graphical. Limited palette:
warm white, ink-navy, oxidized teal, single bright accent green only on the checkmarks.

Aspect ratio: 1:1. Resolution target: 1080 × 1080. Editorial illustration, NOT photographic.
```

> Hinweis: Wenn das Modell echte Buchstaben in „SBOM" oder „Nachweispaket TR-03161"
> nicht sauber rendert, **diese Bezeichnungen ggf. nachträglich in einem Vektor-Editor**
> ergänzen — Nano Banana 2 ist gut, aber nicht perfekt bei kleiner Typografie.

---

## 5. „Die Lücke im DiGA-Verzeichnis" — eine fehlende Kachel

**Funktion:** Illustration für den Markt-Befund (F51.0 mit Paar-Bedtime-Ritual ist nicht besetzt). Visualisiert das Verzeichnis als Raster, in dem **eine Kachel fehlt** — und genau dort eine Andeutung von zwei Personen.

**Aspect ratio:** **16 : 9** oder **4 : 5** (Karussell)

```
[Style anchors above]

Editorial information-design poster. A regular 6 × 4 grid of small abstract app-icon tiles
across the frame, each tile minimal: a single rounded square with a subtle line-figure of one
person inside (no faces, gestural only). Each tile carries a tiny stamp-letter in the corner —
suggesting an ICD-10 code (the only readable text allowed: short codes like „F41.1" „G47.0"
„F43.0" „F32" — keep them small and partial, NOT the central element).

In the lower-right quadrant of the grid, ONE tile is conspicuously empty — only a soft glow
from within, and at its threshold a paired silhouette (two abstract line figures holding hands).
This empty / glowing tile draws the eye. The composition reads as „all tiles solo, one tile
paired and waiting".

Background: warm-white paper. Aesthetic references: neue-Sachlichkeit / Bauhaus
information design / Otl Aicher Olympic pictograms. Limited palette: warm white, ink-navy,
soft gold for the glow, oxidized teal for the paired silhouette only.

Aspect ratio: 16:9 (1600 × 900) preferred; deliver also 4:5 (1080 × 1350) crop suggestion if
possible.
```

---

## Verwendung & Bildrechte

- Die hier erzeugten Bilder ersetzen **keine echten Patient:innen-Fotos** und sind nicht
  als medizinische Visualisierungen zu verwenden.
- Auf LinkedIn jeweils mit `Bild: KI-generiert mit Gemini Nano Banana 2 (2026)` als
  Bildnachweis kennzeichnen.
- Generierungs-Datum, Modell-Snapshot und Prompt-Hash in [`MEMORY.md`](../MEMORY.md)
  protokollieren, sobald die Bilder finalisiert sind — analog der Determinismus-Regeln
  des Repo.
- Wenn diese Bilder direkt für offizielle DiGA-Antrags- oder Marketing-Materialien
  verwendet werden, vorher mit dem regulatorischen Berater die Vorgaben zu
  „Werbung mit Heilversprechen" (HWG) gegenchecken — bei einer als DiGA gelisteten
  App gelten dann zusätzliche Restriktionen.

## Konsistenz-Check über alle fünf Bilder

| # | Bild | Format-Empfehlung | Hauptmotiv | Mood |
| --- | --- | --- | --- | --- |
| 1 | Titelbild | 16:9 Hero | Paar atmet synchron, Apple Watch, leise | warm, ehrlich, alltäglich |
| 2 | Patchwork-Alltag | 4:3 | Küchentisch, Kalender, Wartezeit | tender, müde, real |
| 3 | HRV-Synchronisation | 16:9 | abstrakte Wellen, sich treffend | wissenschaftlich, ruhig |
| 4 | Nachweispaket-Pipeline | 1:1 | Iso-Infografik, Stempel | Audit-Klarheit |
| 5 | DiGA-Verzeichnis-Lücke | 16:9 / 4:5 | Raster mit Leerstelle | Markt-Befund, Hoffnung |

Wenn alle fünf nach denselben Stil-Ankern erzeugt werden, lesen sie sich als **eine
Bildserie** — Wiedererkennungswert auf LinkedIn höher als Einzelbilder.
