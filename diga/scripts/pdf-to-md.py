#!/usr/bin/env python3
"""
Convert a BSI TR-03161 PDF to markdown with TOC + deep-link anchors.

Strategy:
  1. Use `pdftotext -layout` to preserve column structure.
  2. Detect chapter headers (1, 2, 3, ...), subsections (1.1, 1.2, ..., 4.3.1, ...),
     and requirement IDs of the form `O.<Group>_<N>`.
  3. Emit GitHub-flavoured markdown with explicit `<a id="..."></a>` anchors
     so requirements can be deep-linked from COMPLIANCE_MATRIX.md.
  4. Build a TOC from detected headers.

Limitations (acceptable for v0.1):
  - Tables become indented free text, not GFM tables. Auditors can still grep.
  - Header detection uses regex on patterns observed in TR-03161-1 v3.0.
  - Page-number lines and BSI footer/header repetitions are stripped.

Usage:
  ./pdf-to-md.py <input.pdf> <output.md>
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

CHAPTER_RE = re.compile(r"^(\d{1,2})\s+([A-ZÄÖÜ][^\n]{3,120})$")
MAX_CHAPTER_NUM = 20
SUBSECTION_RE = re.compile(r"^(\d+\.\d+(?:\.\d+)?)\s+([A-ZÄÖÜa-zäöü][^\n]{2,120})$")
REQ_ID_RE = re.compile(r"^\s*(O\.[A-Za-z]+_\d+)\b")
APPENDIX_RE = re.compile(r"^(Anhang\s+[A-Z](?:\s*[:.][^\n]*)?)\s*$")
FOOTER_RE = re.compile(r"^Bundesamt für Sicherheit in der Informationstechnik(\s+.*)?$")
# Page-header layout: "<pagenum>          Bundesamt für Sicherheit ..."
PAGE_HEADER_RE = re.compile(r"^\d+\s{5,}Bundesamt für Sicherheit")
PAGENUM_RE = re.compile(r"^\s*\d+\s*$")


def slugify(text: str) -> str:
    """GitHub-style slug: lowercase, dashes, drop punctuation."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text.strip())
    return text


def extract_text(pdf_path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(pdf_path), "-"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def parse_lines(text: str) -> list[str]:
    """Strip page footers and bare page-number lines."""
    out: list[str] = []
    for raw in text.splitlines():
        line = raw.rstrip()
        if FOOTER_RE.match(line):
            continue
        # Drop the chapter-name-only header lines that pdftotext produces above
        # repeated headers. We keep them when they have an associated body line.
        out.append(line)
    return out


def collapse_blank_runs(lines: list[str]) -> list[str]:
    out: list[str] = []
    blank = 0
    for ln in lines:
        if ln.strip() == "":
            blank += 1
            if blank <= 1:
                out.append("")
            continue
        blank = 0
        out.append(ln)
    return out


def convert(pdf_path: Path, md_path: Path) -> None:
    text = extract_text(pdf_path)
    lines = parse_lines(text)

    title = pdf_path.stem  # e.g. BSI-TR-03161-1
    body: list[str] = []
    toc: list[tuple[int, str, str]] = []  # (level, label, anchor)
    seen_anchors: set[str] = set()

    def make_anchor(base: str) -> str:
        candidate = base
        i = 2
        while candidate in seen_anchors:
            candidate = f"{base}-{i}"
            i += 1
        seen_anchors.add(candidate)
        return candidate

    skip_inhalt = False
    seen_chapter_nums: set[int] = set()
    forbidden_chapter_titles = (
        "bundesamt für sicherheit",
    )

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip the document's own "Inhalt" / "Tabellenverzeichnis" sections —
        # we generate our own TOC.
        if stripped in ("Inhalt", "Tabellenverzeichnis"):
            skip_inhalt = True
            i += 1
            continue
        if skip_inhalt:
            # Heuristic: the document's TOC ends when we hit the first numbered
            # chapter heading at column 0 with no dot-leader.
            if CHAPTER_RE.match(line) and "..." not in line:
                skip_inhalt = False
            else:
                i += 1
                continue

        # Bare page numbers and page-header rows ("5    Bundesamt ...")
        if PAGENUM_RE.match(line) or PAGE_HEADER_RE.match(line):
            i += 1
            continue
        if FOOTER_RE.match(line):
            i += 1
            continue

        # Chapter header: "1 Einleitung" — must be at column 0, num <= MAX_CHAPTER_NUM
        m = CHAPTER_RE.match(line)
        if (
            m
            and not line.startswith(" ")
            and int(m.group(1)) <= MAX_CHAPTER_NUM
            and not any(fc in m.group(2).lower() for fc in forbidden_chapter_titles)
            and int(m.group(1)) not in seen_chapter_nums
        ):
            num, label = m.group(1), m.group(2).strip()
            # Look-ahead: chapter title may continue on the next non-blank line
            # if that line is plain text (no number prefix, no all-caps shouting).
            j = i + 1
            while j < len(lines) and lines[j].strip() == "":
                j += 1
            if j < len(lines):
                cont = lines[j].rstrip()
                cont_stripped = cont.strip()
                # Continuation may be indented (chapter title wraps under the
                # number column) — accept short, plain text only.
                # Heuristic: a real continuation has no internal whitespace gap
                # (count gaps in the *stripped* text). Table rows have several.
                big_gaps = len(re.findall(r"\s{4,}", cont_stripped))
                if (
                    cont_stripped
                    and not CHAPTER_RE.match(cont)
                    and not SUBSECTION_RE.match(cont)
                    and not REQ_ID_RE.match(cont)
                    and not APPENDIX_RE.match(cont_stripped)
                    and not FOOTER_RE.match(cont)
                    and not PAGE_HEADER_RE.match(cont)
                    and not PAGENUM_RE.match(cont)
                    and len(cont_stripped) < 80
                    and cont_stripped[:1].isalpha()
                    and big_gaps == 0
                ):
                    label = f"{label} {cont_stripped}"
                    i = j  # consumed the continuation line
            anchor = make_anchor(slugify(f"{num}-{label}"))
            body.append("")
            body.append(f'<a id="{anchor}"></a>')
            body.append(f"## {num}. {label}")
            body.append("")
            toc.append((1, f"{num}. {label}", anchor))
            seen_chapter_nums.add(int(num))
            i += 1
            continue

        # Subsection: "1.1 Foo" or "4.3.1 Bar"
        m = SUBSECTION_RE.match(line)
        if m and not line.startswith("    "):
            num, label = m.group(1), m.group(2).strip()
            depth = num.count(".") + 1
            md_level = "#" * (depth + 1)  # 1.1 → ###, 1.1.1 → ####
            anchor = make_anchor(slugify(f"{num}-{label}"))
            body.append("")
            body.append(f'<a id="{anchor}"></a>')
            body.append(f"{md_level} {num} {label}")
            body.append("")
            toc.append((depth, f"{num} {label}", anchor))
            i += 1
            continue

        # Appendix
        m = APPENDIX_RE.match(stripped)
        if m and not line.startswith("    "):
            label = m.group(1).strip()
            anchor = make_anchor(slugify(label))
            body.append("")
            body.append(f'<a id="{anchor}"></a>')
            body.append(f"## {label}")
            body.append("")
            toc.append((1, label, anchor))
            i += 1
            continue

        # Requirement ID — emit as bold + anchor, then capture the row.
        m = REQ_ID_RE.match(line)
        if m:
            req_id = m.group(1)
            anchor = make_anchor(req_id.lower().replace(".", "-").replace("_", "-"))
            # Capture the rest of the row's content. Heuristic: collect lines
            # that are indented further than the current line until we hit a
            # blank-blank or another requirement / heading.
            buf = [line]
            j = i + 1
            while j < len(lines):
                nxt = lines[j]
                if REQ_ID_RE.match(nxt):
                    break
                if CHAPTER_RE.match(nxt) and not nxt.startswith(" "):
                    break
                if SUBSECTION_RE.match(nxt) and not nxt.startswith("    "):
                    break
                if PAGENUM_RE.match(nxt):
                    j += 1
                    continue
                if FOOTER_RE.match(nxt):
                    j += 1
                    continue
                buf.append(nxt)
                # Stop after two consecutive blanks
                if (
                    nxt.strip() == ""
                    and j + 1 < len(lines)
                    and lines[j + 1].strip() == ""
                ):
                    j += 1
                    break
                j += 1
            block = "\n".join(buf).strip("\n")
            body.append("")
            body.append(f'<a id="{anchor}"></a>')
            body.append(f"**{req_id}**")
            body.append("")
            body.append("```")
            body.append(block)
            body.append("```")
            body.append("")
            i = j
            continue

        # Default: pass through
        body.append(line)
        i += 1

    body = collapse_blank_runs(body)

    # Build markdown with TOC.
    out: list[str] = []
    out.append(f"# {title}")
    out.append("")
    out.append(f"> Auto-generated from `regulations/pdf/{pdf_path.name}` by `scripts/pdf-to-md.py`.")
    out.append("> Layout-preserving extraction; tables are rendered as fenced code blocks.")
    out.append("> See `regulations/source-manifest.yaml` for the source URL and sha256.")
    out.append("")
    out.append("## Table of Contents")
    out.append("")
    for level, label, anchor in toc:
        indent = "  " * (level - 1)
        out.append(f"{indent}- [{label}](#{anchor})")
    out.append("")
    out.append("---")
    out.append("")
    out.extend(body)

    md_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text("\n".join(out) + "\n", encoding="utf-8")


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: pdf-to-md.py <input.pdf> <output.md>", file=sys.stderr)
        return 2
    convert(Path(argv[1]), Path(argv[2]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
