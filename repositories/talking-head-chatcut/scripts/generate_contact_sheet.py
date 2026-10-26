#!/usr/bin/env python3
"""Build the pre-export contact sheet the user actually looks at.

One stable mid-scene frame per scene, laid out on a labelled grid. This is the
cheapest possible way for a human to catch a composition error before export —
the S04 accident (an info card covering the top half while the full-screen
talking head showed underneath) is obvious at a glance on this sheet.

Frames are taken from an already-rendered preview/export with ffmpeg. It never
touches the ChatCut project.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

CELL_WIDTH = 480
MAX_CELLS_PER_PAGE = 12
COLUMNS = 4


def load_json(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def print_result(status: str, **details: object) -> None:
    print(json.dumps({"status": status, **details}, ensure_ascii=False))


def require_tool(name: str) -> str:
    path = shutil.which(name)
    if not path:
        raise RuntimeError(f"{name} is required to build the contact sheet but was not found on PATH")
    return path


def stable_mid_frame(scene: dict) -> int:
    """The settled middle of the scene: what the viewer looks at for longest."""
    frame_range = scene.get("range", {})
    start = int(frame_range.get("startFrame", 0))
    end = int(frame_range.get("endFrameExclusive", start + 1))
    return start + (end - start) // 2


def label_for(scene: dict, frame: int) -> str:
    anchor = str(scene.get("speech", {}).get("anchor") or "").strip().replace("\n", " ")
    if not anchor:
        anchor = str(scene.get("label") or "").strip().replace("\n", " ")
    if len(anchor) > 24:
        anchor = anchor[:23] + "…"
    scene_id = scene.get("sceneId") or scene.get("planSceneId") or scene.get("userSceneId") or "?"
    parts = [str(scene_id), f"f{frame}"]
    state = scene.get("canvasState")
    if state:
        parts.append(str(state))
    if anchor:
        parts.append(anchor)
    return "  ".join(parts)


def extract_frame(ffmpeg: str, video: Path, frame: int, fps: float, destination: Path) -> None:
    timestamp = frame / fps
    completed = subprocess.run(
        [
            ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
            "-ss", f"{timestamp:.4f}",
            "-i", str(video),
            "-frames:v", "1",
            "-vf", f"scale={CELL_WIDTH}:-2",
            str(destination),
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode or not destination.exists():
        raise RuntimeError(f"could not extract frame {frame}: {(completed.stderr or '').strip()}")


def has_drawtext(ffmpeg: str) -> bool:
    completed = subprocess.run([ffmpeg, "-hide_banner", "-filters"], capture_output=True, text=True, check=False)
    return " drawtext " in (completed.stdout or "")


def build_page(ffmpeg: str, cells: list[tuple[Path, str]], destination: Path, labels: bool = True) -> None:
    """Tile the cells into a grid, drawing the scene label under each frame."""
    columns = min(COLUMNS, len(cells))
    rows = (len(cells) + columns - 1) // columns
    inputs: list[str] = []
    for path, _ in cells:
        inputs.extend(["-i", str(path)])

    label_filters = []
    for index, (_, text) in enumerate(cells):
        if labels:
            safe = text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "")
            label_filters.append(
                f"[{index}:v]pad=iw:ih+40:0:0:color=black,"
                f"drawtext=text='{safe}':x=8:y=ih-30:fontsize=20:fontcolor=white[c{index}]"
            )
        else:
            # This ffmpeg has no drawtext; keep the grid geometry and name the
            # cells in the sidecar index instead of silently dropping labels.
            label_filters.append(f"[{index}:v]pad=iw:ih+40:0:0:color=black[c{index}]")
    chain = ";".join(label_filters)
    stream_refs = "".join(f"[c{index}]" for index in range(len(cells)))
    filtergraph = f"{chain};{stream_refs}xstack=inputs={len(cells)}:layout={xstack_layout(len(cells), columns)}:fill=black[out]"
    if len(cells) == 1:
        filtergraph = f"{chain};[c0]null[out]"

    completed = subprocess.run(
        [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *inputs,
         "-filter_complex", filtergraph, "-map", "[out]", "-frames:v", "1", str(destination)],
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode or not destination.exists():
        raise RuntimeError(f"could not tile contact sheet page: {(completed.stderr or '').strip()}")
    _ = rows


def xstack_layout(count: int, columns: int) -> str:
    positions = []
    for index in range(count):
        column = index % columns
        row = index // columns
        x = "0" if column == 0 else "+".join(f"w{i}" for i in range(column))
        y = "0" if row == 0 else "+".join(f"h{i * columns}" for i in range(row))
        positions.append(f"{x}_{y}")
    return "|".join(positions)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    source_group = parser.add_mutually_exclusive_group(required=True)
    source_group.add_argument("--scene-map", help="剪辑/scene-map.json")
    source_group.add_argument("--plan", help="旧项目兼容：包含 canvas.fps 与 scenes[] 的计划 JSON")
    parser.add_argument("--video", required=True, help="已渲染的预览或导出文件")
    parser.add_argument("--revision", required=True, help="审核证据目录用的 revision 名，例如 r3")
    parser.add_argument("--out-dir", default="剪辑/审核证据", help="审核证据根目录")
    args = parser.parse_args()

    try:
        ffmpeg = require_tool("ffmpeg")
        source_path = args.scene_map or args.plan
        plan = load_json(source_path)
        video = Path(args.video)
        if not video.exists():
            raise FileNotFoundError(f"{video} does not exist")
        fps = plan.get("fps") or plan.get("canvas", {}).get("fps")
        if not isinstance(fps, (int, float)) or fps <= 0:
            raise ValueError("scene map fps (or legacy plan canvas.fps) must be positive")
        scenes = sorted(plan.get("scenes", []), key=lambda item: item.get("range", {}).get("startFrame", 0))
        if not scenes:
            raise ValueError("the plan has no scenes")

        target = Path(args.out_dir) / args.revision
        target.mkdir(parents=True, exist_ok=True)
        frames_dir = target / "contact-sheet-frames"
        frames_dir.mkdir(exist_ok=True)

        cells: list[tuple[Path, str]] = []
        for scene in scenes:
            frame = stable_mid_frame(scene)
            scene_id = scene.get("sceneId") or scene.get("planSceneId") or scene.get("userSceneId") or "scene"
            cell_path = frames_dir / f"{scene_id}-frame-{frame}.png"
            extract_frame(ffmpeg, video, frame, float(fps), cell_path)
            cells.append((cell_path, label_for(scene, frame)))

        labels = has_drawtext(ffmpeg)
        pages: list[str] = []
        page_count = (len(cells) + MAX_CELLS_PER_PAGE - 1) // MAX_CELLS_PER_PAGE
        for page_index in range(page_count):
            chunk = cells[page_index * MAX_CELLS_PER_PAGE:(page_index + 1) * MAX_CELLS_PER_PAGE]
            name = "contact-sheet.png" if page_count == 1 else f"contact-sheet-p{page_index + 1}.png"
            destination = target / name
            build_page(ffmpeg, chunk, destination, labels=labels)
            pages.append(str(destination))

        # Sidecar index: which cell is which scene, in reading order.
        index_lines = [f"# 接触表索引 · {args.revision}", "", "| 页 | 位置 | 场景 |", "| --- | --- | --- |"]
        for position, (_, text) in enumerate(cells):
            page = position // MAX_CELLS_PER_PAGE + 1
            slot = position % MAX_CELLS_PER_PAGE
            index_lines.append(f"| {page} | 第{slot // COLUMNS + 1}行第{slot % COLUMNS + 1}格 | {text} |")
        if not labels:
            index_lines.append("")
            index_lines.append("> 本机 ffmpeg 缺少 drawtext 滤镜，格内未烧录文字，请对照本索引阅读。")
        (target / "contact-sheet-index.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as exc:
        print_result("FAIL", errors=[str(exc)])
        return 1

    print_result(
        "PASS",
        scenes=len(cells),
        pages=pages,
        nextStep="把接触表交给用户过目；把批准原话和时间写入剪辑/result.json或当前项目审核记录后才允许导出。",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
