#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "assets" / "visual-orchestration-contract.json"


def fail(errors):
    print(json.dumps({"status": "FAIL", "errors": errors}, ensure_ascii=False))
    return 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", required=True)
    args = parser.parse_args()

    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    plan = json.loads(Path(args.plan).read_text(encoding="utf-8"))
    errors = []

    for field in contract["requiredRootFields"]:
        if field not in plan:
            errors.append(f"missing root field: {field}")
    if errors:
        return fail(errors)

    fps = plan["fps"]
    duration = plan["durationInFrames"]
    scenes = plan["scenes"]
    if not isinstance(fps, (int, float)) or fps <= 0:
        errors.append("fps must be positive")
    if not isinstance(duration, int) or duration <= 0:
        errors.append("durationInFrames must be a positive integer")
    if not isinstance(plan["brandInvariants"], list) or not plan["brandInvariants"]:
        errors.append("brandInvariants must be a non-empty list")
    if not isinstance(scenes, list) or not scenes:
        errors.append("scenes must be a non-empty list")
    if errors:
        return fail(errors)

    previous_end = None
    silhouettes = []
    entrances = []
    max_state_gap = 0

    for index, scene in enumerate(scenes):
        missing = [field for field in contract["requiredSceneFields"] if field not in scene]
        for field in missing:
            errors.append(f"scene {index} missing field: {field}")
        if missing:
            continue

        start = scene["startFrame"]
        end = scene["endFrameExclusive"]
        changes = scene["stateChangeFrames"]
        if not isinstance(start, int) or not isinstance(end, int) or start < 0 or end <= start or end > duration:
            errors.append(f"scene {scene['sceneId']} has invalid range")
            continue
        if previous_end is not None and start < previous_end:
            errors.append(f"scene {scene['sceneId']} overlaps the previous scene")
        previous_end = end

        if not isinstance(changes, list) or any(not isinstance(value, int) for value in changes):
            errors.append(f"scene {scene['sceneId']} stateChangeFrames must contain integers")
            continue
        if changes != sorted(set(changes)):
            errors.append(f"scene {scene['sceneId']} stateChangeFrames must be sorted and unique")
        if any(value < start or value >= end for value in changes):
            errors.append(f"scene {scene['sceneId']} has a state change outside its range")

        points = [start] + changes + [end]
        max_gap = max(right - left for left, right in zip(points, points[1:]))
        max_state_gap = max(max_state_gap, max_gap)

        for field in (
            "viewerJob",
            "layoutSilhouette",
            "entranceMechanism",
            "motionPath",
            "informationPersistence",
            "materialTreatment",
        ):
            if not isinstance(scene[field], str) or not scene[field].strip():
                errors.append(f"scene {scene['sceneId']} has empty {field}")

        silhouettes.append(scene["layoutSilhouette"].strip())
        entrances.append(scene["entranceMechanism"].strip())

    for index in range(len(scenes) - 1):
        if silhouettes[index] == silhouettes[index + 1] and entrances[index] == entrances[index + 1]:
            errors.append(f"scenes {index} and {index + 1} repeat silhouette and entrance")
    for index in range(len(scenes) - 2):
        if silhouettes[index] == silhouettes[index + 1] == silhouettes[index + 2]:
            errors.append(f"scenes {index}-{index + 2} repeat one silhouette three times")

    transitions = plan.get("transitions", [])
    transition_signatures = []
    hard_cuts = 0
    scene_ids = {scene.get("sceneId") for scene in scenes}
    if not isinstance(transitions, list):
        errors.append("transitions must be a list when present")
        transitions = []
    for index, transition in enumerate(transitions):
        missing = [field for field in contract["requiredTransitionFields"] if field not in transition]
        for field in missing:
            errors.append(f"transition {index} missing field: {field}")
        if missing:
            continue
        label = f"transition {transition['transitionId']}"
        start = transition["startFrame"]
        end = transition["endFrameExclusive"]
        if not isinstance(start, int) or not isinstance(end, int) or start < 0 or end < start or end > duration:
            errors.append(f"{label} has invalid range")
        if transition["fromSceneId"] not in scene_ids or transition["toSceneId"] not in scene_ids:
            errors.append(f"{label} references an unknown scene")
        proof_frames = transition["continuityProofFrames"]
        if not isinstance(proof_frames, list) or len(proof_frames) < 2:
            errors.append(f"{label} lacks continuity proof frames")
        elif any(not isinstance(frame, int) or frame < start or frame > end for frame in proof_frames):
            errors.append(f"{label} has a continuity proof frame outside its range")
        signature = (transition["intent"], transition["carriedElementType"])
        if transition_signatures and signature == transition_signatures[-1]:
            errors.append(f"{label} repeats the previous intent and carried element")
        transition_signatures.append(signature)
        if transition["transitionId"] == "hard-cut" or transition["intent"] == "hard-cut":
            hard_cuts += 1
    if transitions and hard_cuts / len(transitions) > contract["thresholds"]["maxHardCutRatio"]:
        errors.append("hard-cut ratio exceeds the visual orchestration limit")

    if errors:
        return fail(errors)

    print(
        json.dumps(
            {
                "status": "PASS",
                "scenes": len(scenes),
                "distinctSilhouettes": len(set(silhouettes)),
                "distinctEntrances": len(set(entrances)),
                "transitions": len(transitions),
                "distinctTransitionSignatures": len(set(transition_signatures)),
                "maxStateHoldSeconds": round(max_state_gap / fps, 3),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
