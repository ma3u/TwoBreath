#!/usr/bin/env python3
"""
Fetch German law sections from gesetze-im-internet.de and convert to clean
markdown with TOC + per-§ deep-link anchors.

Targets:
  - DiGAV (full ordinance, multi-section)
  - § 139e SGB V (single section)

Sources are recorded with sha256 in regulations/source-manifest.yaml.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup, Tag

UA = "TwoBreath-DiGA-fetch/1.0"
DIGA_ROOT = Path(__file__).resolve().parent.parent
REG_DIR = DIGA_ROOT / "regulations"
HTML_DIR = REG_DIR / "html"
MD_DIR = REG_DIR / "markdown"
MANIFEST = REG_DIR / "source-manifest.yaml"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310
        return resp.read()


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[§]", "p", text)
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text.strip())
    return text


def html_to_md_block(node: Tag) -> str:
    """Convert a small HTML subtree to markdown.

    Handles the structures observed on gesetze-im-internet.de:
      - <div class="jurAbsatz">  → paragraph
      - <dl><dt>1.</dt><dd>...</dd></dl>  → numbered list
      - <br/>  → newline
    """
    out_parts: list[str] = []
    for child in node.children:
        if isinstance(child, str):
            text = child.strip()
            if text:
                out_parts.append(text)
            continue
        if not isinstance(child, Tag):
            continue
        cls = child.get("class") or []
        if child.name == "div" and "jurAbsatz" in cls:
            out_parts.append(_render_paragraph(child))
        elif child.name == "dl":
            out_parts.append(_render_dl(child))
        elif child.name == "br":
            out_parts.append("")
        elif child.name in {"div", "span", "p"}:
            inner = html_to_md_block(child)
            if inner:
                out_parts.append(inner)
    return "\n\n".join(p for p in out_parts if p.strip())


def _render_paragraph(node: Tag) -> str:
    # Replace <dl> blocks inline since paragraphs may contain numbered lists.
    parts: list[str] = []
    for child in node.children:
        if isinstance(child, str):
            parts.append(child)
            continue
        if not isinstance(child, Tag):
            continue
        if child.name == "dl":
            parts.append("\n\n" + _render_dl(child) + "\n")
        else:
            parts.append(child.get_text(" ", strip=False))
    text = "".join(parts)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _render_dl(node: Tag) -> str:
    items: list[str] = []
    current_term = ""
    for child in node.children:
        if isinstance(child, Tag) and child.name == "dt":
            current_term = child.get_text(" ", strip=True).rstrip(".") + "."
        elif isinstance(child, Tag) and child.name == "dd":
            body = child.get_text(" ", strip=True)
            body = re.sub(r"\s+", " ", body)
            items.append(f"{current_term} {body}")
    return "\n".join(items)


def parse_section(html_bytes: bytes) -> tuple[str, str]:
    """Return (title, markdown_body) for a single section page.

    Prefers the §-specific spans (jnenbez + jnentitel) over the full H1 which
    on gesetze-im-internet.de drags the entire ordinance preamble along.
    """
    soup = BeautifulSoup(html_bytes, "html.parser")
    bez = soup.find(class_="jnenbez")
    titel = soup.find(class_="jnentitel")
    if bez and titel:
        title = f"{bez.get_text(' ', strip=True)} {titel.get_text(' ', strip=True)}"
    else:
        h1 = soup.find("h1")
        title = h1.get_text(" ", strip=True) if h1 else "(untitled)"
    body_div = soup.find("div", class_="jnhtml")
    if body_div is None:
        return title, ""
    md = html_to_md_block(body_div)
    return title, md


def section_anchor(title: str) -> str:
    # Title is like "Sozialgesetzbuch ... § 139e Verzeichnis ..."
    m = re.search(r"§\s*([\w]+)", title)
    if m:
        return f"p{m.group(1)}".lower()
    return slugify(title)[:60]


def collect_section_urls(index_url: str) -> list[str]:
    soup = BeautifulSoup(fetch(index_url), "html.parser")
    urls: list[str] = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if re.match(r"^__[a-zA-Z0-9_]+\.html$", href):
            urls.append(href)
    # Preserve order of first appearance in the index
    seen: set[str] = set()
    out: list[str] = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def write_combined(name: str, intro: str, sections: list[tuple[str, str, str]], out_path: Path) -> None:
    """sections: list of (anchor, title, md_body)."""
    lines: list[str] = []
    lines.append(f"# {name}")
    lines.append("")
    lines.append(intro)
    lines.append("")
    lines.append("## Table of Contents")
    lines.append("")
    for anchor, title, _ in sections:
        lines.append(f"- [{title}](#{anchor})")
    lines.append("")
    lines.append("---")
    lines.append("")
    for anchor, title, body in sections:
        lines.append(f'<a id="{anchor}"></a>')
        lines.append(f"## {title}")
        lines.append("")
        lines.append(body)
        lines.append("")
        lines.append("---")
        lines.append("")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")


def append_manifest_entries(entries: list[dict]) -> None:
    """Append YAML-shaped entries to source-manifest.yaml without disturbing
    existing ones. Re-run is idempotent per id."""
    existing = MANIFEST.read_text(encoding="utf-8") if MANIFEST.exists() else ""
    # naive idempotency: if an id already appears, skip it
    new_blocks: list[str] = []
    for e in entries:
        if f"id: {e['id']}" in existing:
            continue
        block = [
            f"  - id: {e['id']}",
            f"    title: \"{e['title']}\"",
            f"    url: \"{e['url']}\"",
            f"    html_path: \"{e['html_path']}\"",
            f"    markdown_path: \"{e['markdown_path']}\"",
            f"    sha256: {e['sha256']}",
            f"    bytes: {e['bytes']}",
            f"    downloaded_at: \"{e['downloaded_at']}\"",
        ]
        new_blocks.append("\n".join(block))
    if new_blocks:
        with MANIFEST.open("a", encoding="utf-8") as f:
            f.write("\n".join(new_blocks) + "\n")


def fetch_digav() -> dict:
    base = "https://www.gesetze-im-internet.de/digav/"
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    section_files = collect_section_urls(base + "index.html")
    print(f"  → {len(section_files)} section pages", flush=True)
    sections: list[tuple[str, str, str]] = []
    combined_html = bytearray()
    for fname in section_files:
        url = base + fname
        html = fetch(url)
        combined_html.extend(html)
        local_html = HTML_DIR / "digav" / fname
        local_html.parent.mkdir(parents=True, exist_ok=True)
        local_html.write_bytes(html)
        title, md = parse_section(html)
        anchor = section_anchor(title)
        sections.append((anchor, title, md))
    out_md = MD_DIR / "DiGAV.md"
    intro = (
        f"> Auto-generated from {len(section_files)} section pages under "
        f"<{base}> by `scripts/fetch-laws.py`.\n"
        f"> Last fetched: {datetime.now(timezone.utc).isoformat(timespec='seconds')}."
    )
    write_combined("DiGAV — Digitale-Gesundheitsanwendungen-Verordnung", intro, sections, out_md)
    sha = hashlib.sha256(bytes(combined_html)).hexdigest()
    return {
        "id": "digav",
        "title": "DiGAV — Digitale-Gesundheitsanwendungen-Verordnung",
        "url": base,
        "html_path": "regulations/html/digav/",
        "markdown_path": "regulations/markdown/DiGAV.md",
        "sha256": sha,
        "bytes": len(combined_html),
        "downloaded_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def fetch_sgb5_139e() -> dict:
    url = "https://www.gesetze-im-internet.de/sgb_5/__139e.html"
    html = fetch(url)
    local_html = HTML_DIR / "sgb_5" / "__139e.html"
    local_html.parent.mkdir(parents=True, exist_ok=True)
    local_html.write_bytes(html)
    title, md = parse_section(html)
    anchor = section_anchor(title)
    out_md = MD_DIR / "SGB-V-139e.md"
    intro = (
        f"> Auto-generated from <{url}> by `scripts/fetch-laws.py`.\n"
        f"> Last fetched: {datetime.now(timezone.utc).isoformat(timespec='seconds')}."
    )
    write_combined("SGB V § 139e — Verzeichnis für digitale Gesundheitsanwendungen", intro, [(anchor, title, md)], out_md)
    sha = hashlib.sha256(html).hexdigest()
    return {
        "id": "sgb5-139e",
        "title": "SGB V § 139e — Verzeichnis für digitale Gesundheitsanwendungen",
        "url": url,
        "html_path": "regulations/html/sgb_5/__139e.html",
        "markdown_path": "regulations/markdown/SGB-V-139e.md",
        "sha256": sha,
        "bytes": len(html),
        "downloaded_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only",
        choices=["digav", "sgb5-139e", "all"],
        default="all",
    )
    args = parser.parse_args()

    entries: list[dict] = []
    if args.only in ("digav", "all"):
        print(">>> DiGAV")
        entries.append(fetch_digav())
    if args.only in ("sgb5-139e", "all"):
        print(">>> § 139e SGB V")
        entries.append(fetch_sgb5_139e())

    append_manifest_entries(entries)
    print(f"Manifest updated: {MANIFEST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
