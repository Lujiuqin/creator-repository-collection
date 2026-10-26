#!/usr/bin/env python3
"""Scan a content Vault for valid, read, and unread topic materials."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


FIELD_STOP_RE = re.compile(
    r"^(?:点赞量|收藏量|评论量|分享量|发布时间|更新时间|IP地址|博主ID|博主链接|博主昵称|"
    r"图片数量|笔记封面链接|笔记图片链接)：",
    re.MULTILINE,
)
SOURCE_PATH_RE = re.compile(r"`(02_内容素材/[^`]+\.md)`")
TOPIC_HEADING_RE = re.compile(r"^###\s+(?:\d+\.\s*)?(.+?)\s*$")


def extract_field(text: str, label: str) -> str:
    match = re.search(rf"^{re.escape(label)}：(.*)$", text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def extract_body(text: str) -> str:
    match = re.search(r"^笔记内容：(.*)$", text, re.MULTILINE)
    if not match:
        return ""
    first_line = match.group(1)
    remainder = text[match.end() :]
    stop = FIELD_STOP_RE.search(remainder)
    if stop:
        remainder = remainder[: stop.start()]
    return (first_line + remainder).strip()


def validate_material(path: Path) -> list[str]:
    reasons: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        return [f"无法读取：{exc}"]

    if not extract_field(text, "笔记标题"):
        reasons.append("缺少标题")

    link = extract_field(text, "笔记链接")
    if not link:
        reasons.append("缺少来源链接")
    elif not re.match(r"^https?://", link):
        reasons.append("来源链接不可识别")

    if not extract_body(text):
        reasons.append("正文为空")

    return reasons


def parse_topic_pool(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.is_file():
        return [], []

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    read_files: set[str] = set()
    in_read_section = False

    for line in lines:
        stripped = line.strip()
        if stripped == "## 已读取素材":
            in_read_section = True
            continue
        if in_read_section and stripped.startswith("## "):
            in_read_section = False
        if in_read_section:
            match = SOURCE_PATH_RE.search(line)
            if match:
                read_files.add(match.group(1))

    topics: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for line in lines:
        heading = TOPIC_HEADING_RE.match(line)
        if heading:
            if current:
                topics.append(current)
            current = {"title": heading.group(1), "target": "", "problem": ""}
            continue
        if current is None:
            continue
        if line.startswith("## "):
            topics.append(current)
            current = None
            continue
        if line.startswith("- 准备写给谁："):
            current["target"] = line.removeprefix("- 准备写给谁：").strip()
        elif line.startswith("- 解决什么具体问题："):
            current["problem"] = line.removeprefix("- 解决什么具体问题：").strip()
    if current:
        topics.append(current)

    return sorted(read_files), topics


def scan(root: Path, topic_pool_relative: str) -> dict[str, object]:
    root = root.resolve()
    materials_dir = root / "02_内容素材"
    topic_pool = root / topic_pool_relative

    if not materials_dir.is_dir():
        raise SystemExit(f"未找到内容素材目录：{materials_dir}")

    valid_files: list[str] = []
    invalid_files: list[dict[str, object]] = []

    for path in sorted(materials_dir.rglob("*.md")):
        if path.name == "搜索关键词.md" or path.name.startswith("_"):
            continue
        relative = path.relative_to(root).as_posix()
        reasons = validate_material(path)
        if reasons:
            invalid_files.append({"path": relative, "reasons": reasons})
        else:
            valid_files.append(relative)

    read_files, existing_topics = parse_topic_pool(topic_pool)
    valid_set = set(valid_files)
    unread_files = [path for path in valid_files if path not in set(read_files)]

    return {
        "root": root.as_posix(),
        "topic_pool": topic_pool.relative_to(root).as_posix(),
        "valid_count": len(valid_files),
        "valid_files": valid_files,
        "read_files": [path for path in read_files if path in valid_set],
        "unread_count": len(unread_files),
        "unread_files": unread_files,
        "existing_topic_count": len(existing_topics),
        "existing_topics": existing_topics,
        "invalid_files": invalid_files,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scan topic materials and compare them with 选题池.md read records."
    )
    parser.add_argument("--root", default=".", help="Vault root directory; defaults to cwd")
    parser.add_argument(
        "--topic-pool",
        default="04_选题库/选题池.md",
        help="Topic pool path relative to the Vault root",
    )
    args = parser.parse_args()
    result = scan(Path(args.root), args.topic_pool)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
