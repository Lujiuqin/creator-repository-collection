#!/usr/bin/env python3
import json
import argparse
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
EXPECTED = {
    "motion-primitives.json": 24,
    "semantic-motion-patterns.json": 36,
    "semantic-scene-components.json": 18,
}
SYNC_MODES = {"reveal", "highlight", "state-change", "media-focus"}
INTENSITIES = {"L0", "L1", "L2", "L3"}
MOTION_PROFILES = {
    "editorial-restrained",
    "mechanical-crisp",
    "friendly-geometric",
    "cinematic-emphasis",
    "documentary-proof",
}
BLUEPRINTS = {
    "FullScreenInfo",
    "TalkingHeadPipShell",
    "AccumulatingRows",
    "MediaFrame",
    "ZoomAnnotation",
    "ComparePanel",
    "ProcessMap",
    "ProgressHeader",
    "KeyPointEmphasis",
}


def load(name):
    # semantic-motion-patterns.json / semantic-scene-components.json moved to legacy/
    # on 2026-08-02; they only serve historical plan compatibility now.
    path = ASSETS / name
    if not path.exists():
        path = ROOT / "legacy" / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise AssertionError(f"{name}: cannot parse JSON: {exc}") from exc


def unique_ids(items, label):
    ids = [item.get("id") for item in items]
    if any(not value for value in ids):
        raise AssertionError(f"{label}: every entry needs a non-empty id")
    duplicates = sorted({value for value in ids if ids.count(value) > 1})
    if duplicates:
        raise AssertionError(f"{label}: duplicate ids: {duplicates}")
    return set(ids)


def is_non_negative_int(value):
    return type(value) is int and value >= 0


def validate_plan(plan_path, primitive_map, pattern_map, scene_map):
    plan = json.loads(Path(plan_path).read_text(encoding="utf-8"))
    if not isinstance(plan, dict):
        raise AssertionError("plan: root must be an object")
    root_fields = {"version", "planStatus", "units"}
    allowed_root_fields = root_fields | {"derivation"}
    if not root_fields <= set(plan) or set(plan) - allowed_root_fields:
        raise AssertionError(f"plan: root fields must include {sorted(root_fields)} and only optional derivation")
    if "derivation" in plan:
        marker = plan["derivation"]
        required_marker = {"generated", "derivedFromPlanId", "derivedFromRevision", "sourceSha256"}
        if not isinstance(marker, dict) or not required_marker <= set(marker) or marker.get("generated") is not True:
            raise AssertionError("plan: derivation marker is incomplete")
    if not isinstance(plan.get("version"), str) or not plan["version"].strip():
        raise AssertionError("plan: version must be a non-empty string")
    status = plan.get("planStatus")
    if status not in {"candidate", "locked"}:
        raise AssertionError("plan: planStatus must be candidate or locked")
    units = plan.get("units")
    if not isinstance(units, list) or not units:
        raise AssertionError("plan: units must be a non-empty array")

    required = {
        "unitId", "viewerJob", "sceneComponentId", "semanticPatternId",
        "auxiliarySemanticPatternId", "primitiveIds", "primitiveAssignments", "motionIntensity",
        "motionProfile", "meaningfulChangeReason", "reducedMotionFallback",
        "triggerWord", "triggerFrame", "itemStartFrame", "cueFrame",
        "syncMode", "entryState", "cueState", "settledState", "exitState",
        "handoffToNextUnit", "primaryMotionWindow",
    }
    string_fields = {
        "unitId", "viewerJob", "sceneComponentId", "semanticPatternId",
        "motionProfile", "meaningfulChangeReason", "reducedMotionFallback",
        "triggerWord", "syncMode", "entryState", "cueState", "settledState",
        "exitState", "handoffToNextUnit",
    }
    windows = []
    ids = set()
    for unit in units:
        if not isinstance(unit, dict):
            raise AssertionError("plan: every unit must be an object")
        missing = sorted(required - set(unit))
        if missing:
            raise AssertionError(f"plan unit {unit.get('unitId', '?')}: missing fields {missing}")
        extra = sorted(set(unit) - required)
        if extra:
            raise AssertionError(f"plan unit {unit.get('unitId', '?')}: unexpected fields {extra}")
        for field in string_fields:
            if not isinstance(unit[field], str) or not unit[field].strip():
                raise AssertionError(f"plan unit {unit.get('unitId', '?')}: {field} must be non-empty")
        unit_id = unit["unitId"]
        if unit_id in ids:
            raise AssertionError(f"plan: duplicate unitId {unit_id}")
        ids.add(unit_id)
        if unit["sceneComponentId"] not in scene_map:
            raise AssertionError(f"plan unit {unit_id}: unknown sceneComponentId")
        main = unit["semanticPatternId"]
        auxiliary = unit["auxiliarySemanticPatternId"]
        if main not in pattern_map or (auxiliary is not None and auxiliary not in pattern_map):
            raise AssertionError(f"plan unit {unit_id}: unknown semantic pattern")
        scene_patterns = set(scene_map[unit["sceneComponentId"]]["patternIds"])
        selected_patterns = {main}
        if auxiliary:
            selected_patterns.add(auxiliary)
        unsupported_patterns = selected_patterns - scene_patterns
        if unsupported_patterns:
            raise AssertionError(
                f"plan unit {unit_id}: scene component does not support patterns {sorted(unsupported_patterns)}"
            )
        allowed = set(pattern_map[main]["primitiveIds"])
        if auxiliary:
            allowed.update(pattern_map[auxiliary]["primitiveIds"])
        refs = unit["primitiveIds"]
        if not isinstance(refs, list) or not 1 <= len(refs) <= 3:
            raise AssertionError(f"plan unit {unit_id}: primitiveIds must contain 1-3 ids")
        if any(not isinstance(ref, str) or not ref.strip() for ref in refs) or len(set(refs)) != len(refs):
            raise AssertionError(f"plan unit {unit_id}: primitiveIds must be unique non-empty strings")
        unknown = set(refs) - set(primitive_map)
        unauthorized = set(refs) - allowed
        if unknown:
            raise AssertionError(f"plan unit {unit_id}: unknown primitive ids {sorted(unknown)}")
        if unauthorized:
            raise AssertionError(f"plan unit {unit_id}: primitives not allowed by selected patterns {sorted(unauthorized)}")
        assignments = unit["primitiveAssignments"]
        if not isinstance(assignments, list) or len(assignments) != len(refs):
            raise AssertionError(f"plan unit {unit_id}: primitiveAssignments must map every primitiveId")
        assignment_fields = {"primitiveId", "role", "syncMode", "intensity"}
        assignment_ids = []
        primary_assignments = []
        for assignment in assignments:
            if not isinstance(assignment, dict) or set(assignment) != assignment_fields:
                raise AssertionError(f"plan unit {unit_id}: invalid primitiveAssignment fields")
            primitive_id = assignment["primitiveId"]
            if primitive_id not in refs:
                raise AssertionError(f"plan unit {unit_id}: assignment references an unselected primitive")
            if assignment["role"] not in {"primary", "auxiliary"}:
                raise AssertionError(f"plan unit {unit_id}: primitive role must be primary or auxiliary")
            if assignment["syncMode"] not in SYNC_MODES:
                raise AssertionError(f"plan unit {unit_id}: invalid primitive assignment syncMode")
            if assignment["intensity"] not in INTENSITIES:
                raise AssertionError(f"plan unit {unit_id}: invalid primitive assignment intensity")
            primitive = primitive_map[primitive_id]
            if assignment["syncMode"] not in set(primitive["syncModes"]):
                raise AssertionError(
                    f"plan unit {unit_id}: primitive {primitive_id} does not support syncMode {assignment['syncMode']}"
                )
            if assignment["intensity"] not in set(primitive["intensity"]):
                raise AssertionError(
                    f"plan unit {unit_id}: primitive {primitive_id} does not support intensity {assignment['intensity']}"
                )
            assignment_ids.append(primitive_id)
            if assignment["role"] == "primary":
                primary_assignments.append(assignment)
        if len(set(assignment_ids)) != len(assignment_ids) or set(assignment_ids) != set(refs):
            raise AssertionError(f"plan unit {unit_id}: primitiveAssignments and primitiveIds must match exactly")
        if len(primary_assignments) != 1:
            raise AssertionError(f"plan unit {unit_id}: exactly one primitiveAssignment must be primary")
        primary_assignment = primary_assignments[0]
        if unit["motionIntensity"] not in INTENSITIES:
            raise AssertionError(f"plan unit {unit_id}: invalid motionIntensity")
        if unit["motionIntensity"] not in set(pattern_map[main]["intensity"]):
            raise AssertionError(f"plan unit {unit_id}: motionIntensity is not supported by the primary pattern")
        if unit["motionProfile"] not in MOTION_PROFILES:
            raise AssertionError(f"plan unit {unit_id}: invalid motionProfile")
        if unit["syncMode"] not in SYNC_MODES:
            raise AssertionError(f"plan unit {unit_id}: invalid syncMode")
        allowed_sync_modes = {pattern_map[pattern_id]["preferredSyncMode"] for pattern_id in selected_patterns}
        if unit["syncMode"] not in allowed_sync_modes:
            raise AssertionError(f"plan unit {unit_id}: syncMode is not supported by the selected patterns")
        if primary_assignment["syncMode"] != unit["syncMode"]:
            raise AssertionError(f"plan unit {unit_id}: primary primitive syncMode must equal the unit syncMode")
        if primary_assignment["intensity"] != unit["motionIntensity"]:
            raise AssertionError(f"plan unit {unit_id}: primary primitive intensity must equal the unit motionIntensity")
        frame_values = [unit["triggerFrame"], unit["itemStartFrame"], unit["cueFrame"]]
        window = unit["primaryMotionWindow"]
        if not isinstance(window, dict) or set(window) != {"startFrame", "endFrame"}:
            raise AssertionError(f"plan unit {unit_id}: invalid primaryMotionWindow")
        if status == "locked":
            if not all(is_non_negative_int(value) for value in frame_values):
                raise AssertionError(f"plan unit {unit_id}: locked plan requires non-negative integer cue frames")
            if unit["cueFrame"] != unit["triggerFrame"] - unit["itemStartFrame"]:
                raise AssertionError(f"plan unit {unit_id}: cueFrame formula mismatch")
            start = window["startFrame"]
            end = window["endFrame"]
            if not is_non_negative_int(start) or not is_non_negative_int(end) or end <= start:
                raise AssertionError(f"plan unit {unit_id}: locked plan requires a valid primary motion window")
            windows.append((start, end, unit_id))
        else:
            for value in frame_values + [window["startFrame"], window["endFrame"]]:
                if value is not None and not is_non_negative_int(value):
                    raise AssertionError(f"plan unit {unit_id}: candidate frames must be null or non-negative integers")
            if all(is_non_negative_int(value) for value in frame_values):
                if unit["cueFrame"] != unit["triggerFrame"] - unit["itemStartFrame"]:
                    raise AssertionError(f"plan unit {unit_id}: candidate cueFrame formula mismatch")

    if status == "locked":
        windows.sort()
        for previous, current in zip(windows, windows[1:]):
            if current[0] < previous[1]:
                raise AssertionError(
                    f"plan: primary motion windows overlap ({previous[2]} and {current[2]})"
                )
    return len(units)


def validate(plan_path=None):
    primitives_doc = load("motion-primitives.json")
    patterns_doc = load("semantic-motion-patterns.json")
    scenes_doc = load("semantic-scene-components.json")

    primitives = primitives_doc.get("primitives", [])
    patterns = patterns_doc.get("patterns", [])
    scenes = scenes_doc.get("components", [])

    for name, expected in EXPECTED.items():
        document = {
            "motion-primitives.json": primitives_doc,
            "semantic-motion-patterns.json": patterns_doc,
            "semantic-scene-components.json": scenes_doc,
        }[name]
        items = {
            "motion-primitives.json": primitives,
            "semantic-motion-patterns.json": patterns,
            "semantic-scene-components.json": scenes,
        }[name]
        if document.get("count") != expected or len(items) != expected:
            raise AssertionError(
                f"{name}: expected count={expected}, declared={document.get('count')}, actual={len(items)}"
            )

    primitive_ids = unique_ids(primitives, "primitives")
    pattern_ids = unique_ids(patterns, "patterns")
    unique_ids(scenes, "scene components")
    primitive_map = {item["id"]: item for item in primitives}
    pattern_map = {item["id"]: item for item in patterns}
    scene_map = {item["id"]: item for item in scenes}

    for primitive in primitives:
        modes = set(primitive.get("syncModes", []))
        intensities = set(primitive.get("intensity", []))
        if not modes or not modes <= SYNC_MODES:
            raise AssertionError(f"primitive {primitive['id']}: invalid syncModes {sorted(modes)}")
        if not intensities or not intensities <= INTENSITIES:
            raise AssertionError(f"primitive {primitive['id']}: invalid intensity {sorted(intensities)}")
        if not isinstance(primitive.get("loop"), bool) or not isinstance(primitive.get("settles"), bool):
            raise AssertionError(f"primitive {primitive['id']}: loop and settles must be boolean")

    for pattern in patterns:
        mode = pattern.get("preferredSyncMode")
        refs = set(pattern.get("primitiveIds", []))
        intensities = set(pattern.get("intensity", []))
        if mode not in SYNC_MODES:
            raise AssertionError(f"pattern {pattern['id']}: invalid preferredSyncMode {mode}")
        if not refs or not refs <= primitive_ids:
            raise AssertionError(f"pattern {pattern['id']}: unknown primitive refs {sorted(refs - primitive_ids)}")
        if len(refs) > 3:
            raise AssertionError(f"pattern {pattern['id']}: more than three primitive choices")
        if not intensities or not intensities <= INTENSITIES:
            raise AssertionError(f"pattern {pattern['id']}: invalid intensity {sorted(intensities)}")
        for intensity in intensities:
            compatible_primaries = [
                primitive_id
                for primitive_id in refs
                if mode in set(primitive_map[primitive_id]["syncModes"])
                and intensity in set(primitive_map[primitive_id]["intensity"])
            ]
            if not compatible_primaries:
                raise AssertionError(
                    f"pattern {pattern['id']}: no primary primitive supports {mode} at {intensity}"
                )
        if mode == "media-focus" and pattern.get("requiresConcreteMedia") is not True:
            raise AssertionError(f"pattern {pattern['id']}: media-focus requires concrete media")

    for scene in scenes:
        blueprint_refs = set(scene.get("blueprintIds", []))
        semantic_refs = set(scene.get("patternIds", []))
        if not blueprint_refs or not blueprint_refs <= BLUEPRINTS:
            raise AssertionError(f"scene {scene['id']}: unknown blueprint refs {sorted(blueprint_refs - BLUEPRINTS)}")
        if not semantic_refs or not semantic_refs <= pattern_ids:
            raise AssertionError(f"scene {scene['id']}: unknown pattern refs {sorted(semantic_refs - pattern_ids)}")
        if scene.get("defaultIntensity") not in INTENSITIES:
            raise AssertionError(f"scene {scene['id']}: invalid defaultIntensity")

    sync_contract = load("visual-sync-contract.json")
    contract_modes = set(sync_contract.get("modes", {}))
    if contract_modes != SYNC_MODES:
        raise AssertionError(
            f"visual-sync-contract.json: modes must equal {sorted(SYNC_MODES)}, got {sorted(contract_modes)}"
        )

    result = {
        "primitives": len(primitives),
        "patterns": len(patterns),
        "sceneComponents": len(scenes),
        "crossReferences": "valid",
    }
    if plan_path:
        result["planUnits"] = validate_plan(plan_path, primitive_map, pattern_map, scene_map)
        result["plan"] = "valid"
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", help="Optional semantic-motion-plan.json to validate")
    args = parser.parse_args()
    try:
        result = validate(args.plan)
    except (AssertionError, OSError, json.JSONDecodeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
    print(json.dumps({"status": "PASS", **result}, ensure_ascii=False))
