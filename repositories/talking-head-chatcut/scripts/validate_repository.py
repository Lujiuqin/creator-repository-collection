#!/usr/bin/env python3
"""Validate this Skill repository without requiring a Codex installation."""

from __future__ import annotations

import compileall
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

import yaml
from jsonschema import Draft202012Validator
from jsonschema.exceptions import SchemaError


ROOT = Path(__file__).resolve().parents[1]
NAME_RE = re.compile(r"^[a-z0-9-]{1,64}$")
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")

OBSOLETE_PATHS = [
    "assets/edit-plan.schema.json",
    "assets/execution-isolation-attestation.schema.json",
    "assets/planning-context.schema.json",
    "assets/production-state.schema.json",
    "assets/review-ledger.schema.json",
    "references/planning-agent-prompts.md",
    "references/planning-orchestration.md",
    "scripts/authorize_execution.py",
    "scripts/dispatch_chatcut_execution.py",
    "scripts/verify_execution_isolation.py",
    "scripts/verify_export_gate.py",
]

STALE_GATE_TERMS = [
    "edit-plan.lock.json",
    "execution-isolation",
    "review-ledger.json",
    "planning-context.json",
    "production-state.json",
    "Claude Code",
]


def validate_frontmatter(errors: list[str]) -> None:
    skill_path = ROOT / "SKILL.md"
    text = skill_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        errors.append("SKILL.md must start with YAML frontmatter")
        return
    try:
        end = lines.index("---", 1)
        metadata = yaml.safe_load("\n".join(lines[1:end]))
    except (ValueError, yaml.YAMLError) as exc:
        errors.append(f"SKILL.md frontmatter is invalid: {exc}")
        return
    if not isinstance(metadata, dict):
        errors.append("SKILL.md frontmatter must be an object")
        return
    if set(metadata) != {"name", "description"}:
        errors.append("SKILL.md frontmatter may contain only name and description")
    name = metadata.get("name")
    description = metadata.get("description")
    if not isinstance(name, str) or not NAME_RE.fullmatch(name):
        errors.append("Skill name must use lowercase letters, digits, and hyphens")
    if not isinstance(description, str) or not description.strip():
        errors.append("Skill description must be non-empty")


def validate_json(errors: list[str]) -> int:
    paths = sorted(
        set((ROOT / "assets").rglob("*.json"))
        | set((ROOT / "scripts" / "fixtures").rglob("*.json"))
        | set((ROOT / "legacy").rglob("*.json"))
    )
    for path in paths:
        try:
            value = json.loads(path.read_text(encoding="utf-8"))
            if path.name.endswith(".schema.json"):
                Draft202012Validator.check_schema(value)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path.relative_to(ROOT)} is invalid JSON: {exc}")
        except SchemaError as exc:
            errors.append(f"{path.relative_to(ROOT)} is not a valid JSON Schema: {exc}")
    return len(paths)


def validate_contract_fixtures(errors: list[str]) -> None:
    scene_schema = json.loads((ROOT / "assets" / "scene-map.schema.json").read_text(encoding="utf-8"))
    scene_fixture = json.loads(
        (ROOT / "scripts" / "fixtures" / "contact-sheet-scene-map.json").read_text(encoding="utf-8")
    )
    for issue in Draft202012Validator(scene_schema).iter_errors(scene_fixture):
        errors.append(f"contact-sheet scene-map fixture is invalid at {list(issue.path)}: {issue.message}")

    audit = json.loads((ROOT / "assets" / "audit-checklist.json").read_text(encoding="utf-8"))
    stage_ids = [stage.get("id") for stage in audit.get("stages", [])]
    expected = [f"S{index}" for index in range(11)]
    if stage_ids != expected:
        errors.append(f"audit checklist stages must be ordered S0-S10, got {stage_ids}")


def validate_links(errors: list[str]) -> int:
    checked = 0
    for path in sorted(ROOT.rglob("*.md")):
        for raw_target in LINK_RE.findall(path.read_text(encoding="utf-8")):
            target = raw_target.strip().split("#", 1)[0]
            if not target or "://" in target or target.startswith("mailto:"):
                continue
            checked += 1
            resolved = (path.parent / unquote(target)).resolve()
            if not resolved.exists():
                errors.append(f"{path.relative_to(ROOT)} links to missing {raw_target}")
    return checked


def validate_removed_gate(errors: list[str]) -> None:
    for relative in OBSOLETE_PATHS:
        if (ROOT / relative).exists():
            errors.append(f"obsolete strict-gate path remains: {relative}")

    active_files = [ROOT / "SKILL.md", *sorted((ROOT / "references").glob("*.md"))]
    active_files += sorted((ROOT / "assets").glob("*.json"))
    for path in active_files:
        text = path.read_text(encoding="utf-8")
        for term in STALE_GATE_TERMS:
            if term in text:
                errors.append(f"{path.relative_to(ROOT)} still contains obsolete gate term {term!r}")


def main() -> int:
    errors: list[str] = []
    validate_frontmatter(errors)
    json_files = validate_json(errors)
    validate_contract_fixtures(errors)
    links = validate_links(errors)
    validate_removed_gate(errors)
    if not compileall.compile_dir(ROOT / "scripts", quiet=1):
        errors.append("Python script compilation failed")

    if errors:
        print(json.dumps({"status": "FAIL", "errors": errors}, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps({"status": "PASS", "jsonFiles": json_files, "localLinks": links}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
