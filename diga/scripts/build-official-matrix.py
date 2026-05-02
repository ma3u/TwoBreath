#!/usr/bin/env python3
"""
Generate the per-O.* compliance matrix from the ingested TR-03161-1 markdown.

Reads:  regulations/markdown/BSI-TR-03161-1.md
Writes: COMPLIANCE_MATRIX_TR1_OFFICIAL.md  (full 127-row enumeration grouped by Prüfaspekt)

The TwoBreath default-status heuristic reflects the actual posture of the app:
  - no backend, no accounts, no PHI/PII, App Store + Apple Notarisation only.

This file replaces the working CRY/AUT/STO shorthand in COMPLIANCE_MATRIX.md
for the per-row enumeration. The shorthand stays for narrative grouping.
"""
from __future__ import annotations

import re
from collections import OrderedDict
from pathlib import Path

import yaml

DIGA_ROOT = Path(__file__).resolve().parent.parent
SRC = DIGA_ROOT / "regulations" / "markdown" / "BSI-TR-03161-1.md"
OVERRIDES = DIGA_ROOT / "evidence" / "tr1-twobreath-status.yaml"
OUT = DIGA_ROOT / "COMPLIANCE_MATRIX_TR1_OFFICIAL.md"

# Pretty group names + official Prüfaspekt mapping
GROUPS = OrderedDict([
    ("Purp",   ("Anwendungszweck",                "(1) Anwendungszweck",          "431-testcharakteristik-zu-prüfaspekt-1-anwendungszweck")),
    ("Arch",   ("Architektur",                    "(2) Architektur",              "432-testcharakteristik-zu-prüfaspekt-2-architektur")),
    ("Source", ("Quellcode",                      "(3) Quellcode",                "433-testcharakteristik-zu-prüfaspekt-3-quellcode")),
    ("TrdP",   ("Drittanbieter-Software",         "(4) Drittanbieter-Software",   "434-testcharakteristik-zu-prüfaspekt-4-drittanbieter-software")),
    ("Cryp",   ("Kryptographische Umsetzung",     "(5) Kryptographische Umsetzung","435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung")),
    ("Rand",   ("Zufallswerte (Krypto)",          "(5) Kryptographische Umsetzung","435-testcharakteristik-zu-prüfaspekt-5-kryptographische-umsetzung")),
    ("Auth",   ("Authentisierung",                "(6) Authentisierung und Authentifizierung","436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung")),
    ("Pass",   ("Passwörter",                     "(6) Authentisierung und Authentifizierung","436-testcharakteristik-zu-prüfaspekt-6-authentisierung-und-authentifizierung")),
    ("Data",   ("Datensicherheit",                "(7) Datensicherheit",          "437-testcharakteristik-zu-prüfaspekt-7-datensicherheit")),
    ("Paid",   ("Kostenpflichtige Ressourcen",    "(8) Kostenpflichtige Ressourcen","438-testcharakteristik-zu-prüfaspekt-8-kostenpflichtige-ressourcen")),
    ("Ntwk",   ("Netzwerkkommunikation",          "(9) Netzwerkkommunikation",    "439-testcharakteristik-zu-prüfaspekt-9-netzwerkkommunikation")),
    ("Plat",   ("Plattformspezifische Interaktionen","(10) Plattformspezifische Interaktionen","4310-testcharakteristik-zu-prüfaspekt-10-plattformspezifische-interaktionen")),
    ("Resi",   ("Resilienz",                      "(11) Resilienz",               "4311-testcharakteristik-zu-prüfaspekt-11-resilienz")),
])

# Default R/D/P/M class per group (working hypothesis; refine row-by-row over time)
GROUP_DEFAULT_CLASS = {
    "Purp":   "M",
    "Arch":   "M",
    "Source": "D",
    "TrdP":   "D",
    "Cryp":   "D",
    "Rand":   "D",
    "Auth":   "D",
    "Pass":   "D",
    "Data":   "D + M",
    "Paid":   "D",
    "Ntwk":   "R + D",
    "Plat":   "D",
    "Resi":   "D + P",
}

# Default candidate tool per group
GROUP_DEFAULT_TOOL = {
    "Purp":   "Manual review of consent flow + privacy text",
    "Arch":   "Architecture doc + threat-model review (`threagile`)",
    "Source": "`semgrep` + `swiftlint` SAST",
    "TrdP":   "`syft` SBOM + `osv-scanner` CVE",
    "Cryp":   "Crypto-inventory YAML reconciled vs build scan",
    "Rand":   "`semgrep` ban on `arc4random`; assert `SecRandomCopyBytes`",
    "Auth":   "XCUITest auth flow + token-claim assertion",
    "Pass":   "XCUITest password policy assertion",
    "Data":   "MobSF static + dynamic; `gitleaks`",
    "Paid":   "Code review for App Store IAP only",
    "Ntwk":   "`testssl.sh` + ATS plist audit",
    "Plat":   "Entitlements diff + `Info.plist` purpose-string check",
    "Resi":   "Apple notarisation + `cosign` provenance",
}

# Default TwoBreath status per group given local-first / no-backend / no-accounts posture.
# 🔍 = to be determined  ✅ = met  🟡 = partial  ❌ = missing  ➖ = not applicable today
GROUP_DEFAULT_TBR_STATUS = {
    "Purp":   ("🔍", "Privacy/consent text exists for App Store; needs explicit mapping per O.Purp_n."),
    "Arch":   ("❌", "No formal architecture doc + threat model authored yet."),
    "Source": ("❌", "SAST not yet wired into CI."),
    "TrdP":   ("❌", "SBOM + dep-CVE scan not yet in CI."),
    "Cryp":   ("➖", "No app-side cryptographic key material today (Apple-platform defaults)."),
    "Rand":   ("➖", "Same — no custom RNG path; defers to platform."),
    "Auth":   ("➖", "No user accounts; no authentication flow today."),
    "Pass":   ("➖", "No password store; no credential."),
    "Data":   ("🟡", "Local-only data, no PII transmitted; needs explicit mapping per O.Data_n."),
    "Paid":   ("✅", "Apple IAP only — no third-party payment integration."),
    "Ntwk":   ("🔍", "App talks to App Store CDN + marketing site; testssl on each pending."),
    "Plat":   ("🔍", "Entitlements + Info.plist purpose strings present; need explicit mapping."),
    "Resi":   ("🟡", "App Store + notarisation cover most; explicit `cosign` provenance pending."),
}

REQ_RE = re.compile(
    r'<a id="(o-[a-z]+-\d+(?:-2)?)"></a>\n'
    r'\*\*(O\.[A-Za-z]+_\d+)\*\*\n\n'
    r'```\n(.*?)\n```',
    re.DOTALL,
)
PRÜFTIEFEN = ("CHECK", "EXAMINE")


def extract() -> dict[str, dict]:
    """Extract per-rid normative + audit blocks. Order in markdown is always
    chapter-3 (normative) first, then chapter-4 (audit) — so we use first-seen
    semantics rather than a suffix heuristic, which breaks for IDs like
    O.Arch_2 whose slug naturally ends in -2."""
    md = SRC.read_text(encoding="utf-8")
    records: dict[str, dict] = OrderedDict()
    for m in REQ_RE.finditer(md):
        anchor, rid, block = m.group(1), m.group(2), m.group(3)
        rec = records.setdefault(rid, {"audit_block": "", "norm_block": "", "anchor_norm": "", "anchor_audit": ""})
        if not rec["anchor_norm"]:
            rec["anchor_norm"] = anchor
            rec["norm_block"] = block
        else:
            rec["anchor_audit"] = anchor
            rec["audit_block"] = block
    return records


def parse_audit(block: str, rid: str) -> tuple[str, str]:
    """Return (Kurzfassung, Prüftiefe). Best-effort layout parser."""
    lines = [l for l in block.splitlines() if l.strip()]
    head_idx = next((i for i, l in enumerate(lines) if rid in l), None)
    if head_idx is None:
        return ("", "")
    parts = re.split(r"\s{2,}", lines[head_idx].strip())
    summary: list[str] = []
    depth = ""
    for p in parts[1:]:
        ps = p.strip()
        if ps in PRÜFTIEFEN:
            depth = ps
            break
        summary.append(ps)
    # Continuation lines until depth found or new req
    j = head_idx + 1
    while j < len(lines) and not depth:
        nxt = lines[j].strip()
        if not nxt or re.match(r"O\.[A-Za-z]+_\d+", nxt):
            break
        for p in re.split(r"\s{2,}", nxt):
            ps = p.strip()
            if ps in PRÜFTIEFEN:
                depth = ps
                break
            if ps:
                summary.append(ps)
        if depth:
            break
        j += 1
    return (" ".join(summary).strip(), depth)


def normative_excerpt(block: str, rid: str, max_len: int = 220) -> str:
    """Pull the chapter-3 normative wording, single-line, truncated."""
    text = re.sub(r"\s+", " ", block.replace("\n", " ")).strip()
    text = text.replace(rid, "", 1).strip()
    if len(text) > max_len:
        text = text[: max_len - 1].rstrip() + "…"
    return text


def load_overrides() -> dict[str, dict]:
    if not OVERRIDES.exists():
        return {}
    data = yaml.safe_load(OVERRIDES.read_text(encoding="utf-8")) or {}
    return data.get("overrides", {}) or {}


STATUS_LABEL = {
    "✅": "met",
    "🟡": "partial",
    "❌": "missing",
    "➖": "n/a",
    "🔍": "tbd",
}


def main() -> None:
    records = extract()
    overrides = load_overrides()
    by_group: dict[str, list[tuple[str, str, str, str, str]]] = OrderedDict()
    for rid, r in records.items():
        kurz, depth = parse_audit(r["audit_block"], rid)
        norm = normative_excerpt(r["norm_block"], rid)
        grp = rid.split("_")[0].split(".")[1]
        by_group.setdefault(grp, []).append((rid, kurz, depth, norm, r["anchor_norm"]))

    # Compute coverage stats from overrides
    status_counts = OrderedDict([("✅", 0), ("🟡", 0), ("❌", 0), ("➖", 0), ("🔍", 0)])
    class_counts: dict[str, int] = {}
    overridden_count = 0
    for rid in records:
        ov = overrides.get(rid)
        status = ov.get("status") if ov else "🔍"
        if ov:
            overridden_count += 1
        status_counts[status] = status_counts.get(status, 0) + 1
        cls = (ov.get("class") if ov else "—") or "—"
        # Count primary class (first letter of "D + R" etc.)
        primary = cls.split("+")[0].strip() if cls != "—" else "—"
        class_counts[primary] = class_counts.get(primary, 0) + 1

    total = sum(status_counts.values())

    out: list[str] = []
    out.append("# TwoBreath × DiGA — TR-03161-1 official-IDs compliance matrix")
    out.append("")
    out.append(f"> Auto-generated from `regulations/markdown/BSI-TR-03161-1.md` + `evidence/tr1-twobreath-status.yaml` by `scripts/build-official-matrix.py`.")
    out.append(f"> Total unique requirement IDs: **{total}** across **{len(by_group)}** groups (mapping the 11 official Prüfaspekte). Per-row determinations: **{overridden_count}/{total}**.")
    out.append("> Re-run via `make official-matrix` to refresh after a TR update or after editing overrides.")
    out.append("")
    out.append("## Resolved status across all 127 requirements")
    out.append("")
    out.append("| Status | Bedeutung | Anzahl | Anteil |")
    out.append("| --- | --- | ---: | ---: |")
    for s, label in STATUS_LABEL.items():
        n = status_counts.get(s, 0)
        pct = (n / total * 100) if total else 0
        out.append(f"| {s} | {label} | {n} | {pct:.0f} % |")
    out.append(f"| **Gesamt** | | **{total}** | **100 %** |")
    out.append("")
    out.append("**Nachweisklasse-Verteilung (Default je Anforderung):**")
    out.append("")
    out.append("| Klasse | Anzahl |")
    out.append("| --- | ---: |")
    for c in ("R", "D", "P", "M", "—"):
        if c in class_counts:
            out.append(f"| {c} | {class_counts[c]} |")
    out.append("")
    out.append("")
    out.append("## Legend")
    out.append("")
    out.append("- **Class:** R real-time · D deploy-time · P periodic · M manual (see `PLANNING.md` § 7).")
    out.append("- **Status:** ✅ met · 🟡 partial · ❌ missing · ➖ not applicable today (with trigger) · 🔍 to be determined.")
    out.append("- **Prüftiefe:** as printed in TR-03161-1 v3.0 § 4.3 (CHECK / EXAMINE).")
    out.append("")
    out.append("## Coverage at a glance")
    out.append("")
    out.append("| Group | Official Prüfaspekt | Reqs |")
    out.append("| --- | --- | ---: |")
    for grp, items in by_group.items():
        official_label, official_pa, anchor = GROUPS[grp]
        out.append(f"| `O.{grp}_*` — {official_label} | [{official_pa}](regulations/markdown/BSI-TR-03161-1.md#{anchor}) | {len(items)} |")
    out.append(f"| **Total** | | **{sum(len(v) for v in by_group.values())}** |")
    out.append("")
    out.append("---")
    out.append("")

    for grp, items in by_group.items():
        official_label, official_pa, anchor = GROUPS[grp]
        default_cls = GROUP_DEFAULT_CLASS[grp]
        tool = GROUP_DEFAULT_TOOL[grp]
        out.append(f"## `O.{grp}_*` — {official_label}")
        out.append("")
        out.append(f"**Official Prüfaspekt:** [{official_pa}](regulations/markdown/BSI-TR-03161-1.md#{anchor})")
        out.append(f"**Default class:** {default_cls}  ·  **Default tool:** {tool}")
        out.append("")
        out.append("| ID | Kurzfassung (TR-03161-1 § 4.3) | Prüftiefe | Class | TwoBreath | Begründung / Quelle |")
        out.append("| --- | --- | --- | --- | --- | --- |")
        for rid, kurz, depth, norm, a_norm in items:
            id_link = f"[{rid}](regulations/markdown/BSI-TR-03161-1.md#{a_norm})"
            kurz_safe = (kurz or "—").replace("|", "\\|")
            depth_safe = depth or "—"
            ov = overrides.get(rid, {})
            status = ov.get("status", "🔍")
            cls = ov.get("class", default_cls)
            note = (ov.get("note") or "(group default)").replace("|", "\\|").replace("\n", " ")
            out.append(f"| {id_link} | {kurz_safe} | {depth_safe} | {cls} | {status} | {note} |")
        out.append("")

    OUT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({sum(len(v) for v in by_group.values())} requirements across {len(by_group)} groups)")


if __name__ == "__main__":
    main()
