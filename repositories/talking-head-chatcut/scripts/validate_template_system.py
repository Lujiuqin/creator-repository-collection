#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator
from referencing import Registry, Resource


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def load_json(path):
    with Path(path).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def require_fields(obj, fields, label, errors):
    for field in fields:
        if field not in obj:
            errors.append(f"{label} missing field: {field}")


def schema_required(schema, definition):
    return schema.get("$defs", {}).get(definition, {}).get("required", [])


def duplicate_ids(items):
    seen = set()
    duplicates = set()
    for item in items:
        item_id = item.get("id")
        if item_id in seen:
            duplicates.add(item_id)
        seen.add(item_id)
    return sorted(value for value in duplicates if value)


def merge_ranges(ranges):
    normalized = sorted((item[0], item[1]) for item in ranges if item[1] > item[0])
    if not normalized:
        return []
    merged = []
    current_start, current_end = normalized[0]
    for start, end in normalized[1:]:
        if start <= current_end:
            current_end = max(current_end, end)
        else:
            merged.append((current_start, current_end))
            current_start, current_end = start, end
    merged.append((current_start, current_end))
    return merged


def maximum_static_gap(scene_start, scene_end, motion_ranges):
    merged = merge_ranges(motion_ranges)
    if not merged:
        return scene_end - scene_start
    gaps = [merged[0][0] - scene_start, scene_end - merged[-1][1]]
    gaps.extend(right[0] - left[1] for left, right in zip(merged, merged[1:]))
    return max(gaps)


def role_compatible(port_roles, transition_roles):
    return "any" in transition_roles or bool(set(port_roles) & set(transition_roles))


COUNT_COLLECTIONS = {
    "lineCount": "lines",
    "itemCount": "items",
    "stageCount": "stages",
    "eventCount": "events",
    "categoryCount": "categories",
    "recordCount": "records",
    "destinationCount": "destinations",
    "layerCount": "layers",
    "resultCount": "results",
    "sectorCount": "sectors",
    "memoryCount": "memories",
}

SHOTCRAFT_MODES = {"motion-grammar", "ported-mg", "timeline-plus-mg", "study-only"}
SOURCE_MODES = {"template", "chatcut-library", "project-existing", "bespoke", "bespoke-forced", "legacy"}


def validate_shotcraft_adapter(adapter, scene_map):
    errors = []
    require_fields(
        adapter,
        ["version", "provider", "sourceRepo", "galleryUrl", "reviewedRevision", "sourceFps", "defaultPolicy", "cards"],
        "shotcraft adapter",
        errors,
    )
    if adapter.get("provider") != "video-shotcraft":
        errors.append("shotcraft adapter provider must be video-shotcraft")
    cards = adapter.get("cards", [])
    if not cards:
        errors.append("shotcraft adapter cards must be a non-empty list")
    for duplicate in duplicate_ids(cards):
        errors.append(f"duplicate shotcraft card id: {duplicate}")
    for card in cards:
        card_id = card.get("id", "<unknown>")
        label = f"shotcraft card {card_id}"
        require_fields(
            card,
            ["id", "kind", "category", "recipePath", "demoPath", "adaptationMode", "complexity", "templateCandidates", "presentationModes", "syncModes", "requiredAssets", "preservedBeats", "rejectWhen"],
            label,
            errors,
        )
        if card.get("kind") not in ("scene", "transition"):
            errors.append(f"{label} kind must be scene or transition")
        if card.get("adaptationMode") not in SHOTCRAFT_MODES:
            errors.append(f"{label} has unsupported adaptationMode")
        if not str(card.get("recipePath", "")).endswith(".md"):
            errors.append(f"{label} recipePath must point to markdown")
        if not str(card.get("demoPath", "")).endswith(".tsx"):
            errors.append(f"{label} demoPath must point to TSX source")
        if not card.get("preservedBeats"):
            errors.append(f"{label} has no preserved beats")
        for template_id in card.get("templateCandidates", []):
            if template_id not in scene_map:
                errors.append(f"{label} references unknown scene template: {template_id}")
    return errors


def validate_design_references(owner, label, expected_kind, adapter_map, schema, errors):
    references = owner.get("designReferences", [])
    if not isinstance(references, list):
        errors.append(f"{label} designReferences must be a list")
        return
    if len(references) > 1:
        errors.append(f"{label} may use at most one primary design reference")
    required = schema_required(schema, "designReference") if schema else [
        "provider", "cardId", "sourceRevision", "recipePath", "demoPath", "adaptationMode", "preservedBeats", "discardedImplementation"
    ]
    for reference in references:
        if not isinstance(reference, dict):
            errors.append(f"{label} designReference must be an object")
            continue
        reference_label = f"{label} designReference {reference.get('cardId', '<unknown>')}"
        require_fields(reference, required, reference_label, errors)
        if reference.get("provider") != "video-shotcraft":
            errors.append(f"{reference_label} provider must be video-shotcraft")
        card = adapter_map.get(reference.get("cardId"))
        if not card:
            errors.append(f"{reference_label} references unknown adapter card")
            continue
        if card.get("kind") != expected_kind:
            errors.append(f"{reference_label} kind does not match its owner")
        for key in ("recipePath", "demoPath"):
            if reference.get(key) != card.get(key):
                errors.append(f"{reference_label} {key} differs from adapter catalog")
        mode = reference.get("adaptationMode")
        allowed_modes = {card.get("adaptationMode"), "motion-grammar", "study-only"}
        if mode not in allowed_modes:
            errors.append(f"{reference_label} adaptationMode is not allowed for this card")
        if mode != "study-only":
            missing_beats = [beat for beat in card.get("preservedBeats", []) if beat not in reference.get("preservedBeats", [])]
            if missing_beats:
                errors.append(f"{reference_label} omits required preserved beats: {', '.join(missing_beats)}")
        if not reference.get("discardedImplementation"):
            errors.append(f"{reference_label} must record discarded implementation")


def resolved_count(resolved_params, key):
    if isinstance(resolved_params.get(key), int):
        return resolved_params[key]
    collection = resolved_params.get(COUNT_COLLECTIONS.get(key, ""))
    return len(collection) if isinstance(collection, list) else None


def frame_in_ranges(frame, ranges):
    return any(start <= frame < end for start, end in ranges)


def validate_library(library, primitives, contract, schema):
    errors = []
    scene_templates = library.get("sceneTemplates", [])
    transition_templates = library.get("transitionTemplates", [])
    if not scene_templates:
        errors.append("sceneTemplates must be a non-empty list")
    if not transition_templates:
        errors.append("transitionTemplates must be a non-empty list")

    for duplicate in duplicate_ids(scene_templates):
        errors.append(f"duplicate scene template id: {duplicate}")
    for duplicate in duplicate_ids(transition_templates):
        errors.append(f"duplicate transition template id: {duplicate}")

    primitive_ids = {item.get("id") for item in primitives.get("primitives", [])}
    scene_required = schema_required(schema, "sceneTemplate")
    for template in scene_templates:
        label = f"sceneTemplate {template.get('id', '<unknown>')}"
        require_fields(template, scene_required, label, errors)
        if template.get("kind") != "sceneTemplate":
            errors.append(f"{label} kind must be sceneTemplate")
        identity = template.get("identity", {})
        require_fields(identity, ["viewerJob", "informationStructure", "silhouette", "recommendedFor"], f"{label}.identity", errors)
        signature = template.get("motionSignature", {})
        require_fields(signature, ["entrance", "perItemReveal", "sustainMode", "exit", "boundPrimitives", "prohibitedPrimitives"], f"{label}.motionSignature", errors)
        bound = signature.get("boundPrimitives", [])
        if not bound:
            errors.append(f"{label} has no bound primitives")
        for primitive_id in bound + signature.get("prohibitedPrimitives", []):
            if primitive_id not in primitive_ids:
                errors.append(f"{label} references unknown primitive: {primitive_id}")
        if set(bound) & set(signature.get("prohibitedPrimitives", [])):
            errors.append(f"{label} authorizes and prohibits the same primitive")
        aspects = template.get("aspectVariants", {})
        for aspect in ("portrait-9-16", "landscape-16-9"):
            if aspect not in aspects:
                errors.append(f"{label} missing aspect variant: {aspect}")
        ports = template.get("transitionPorts", {})
        require_fields(ports, ["entryRoles", "exitRoles"], f"{label}.transitionPorts", errors)

    transition_required = schema_required(schema, "transitionTemplate")
    for template in transition_templates:
        label = f"transitionTemplate {template.get('id', '<unknown>')}"
        require_fields(template, transition_required, label, errors)
        if template.get("kind") != "transitionTemplate":
            errors.append(f"{label} kind must be transitionTemplate")
        duration = template.get("durationRange", {})
        require_fields(duration, ["minFrames", "maxFrames", "defaultFrames"], f"{label}.durationRange", errors)
        minimum = duration.get("minFrames")
        maximum = duration.get("maxFrames")
        default = duration.get("defaultFrames")
        if all(isinstance(value, int) for value in (minimum, maximum, default)):
            if not minimum <= default <= maximum:
                errors.append(f"{label} default duration must fall inside range")
        carried = template.get("carriedElement", {})
        require_fields(carried, ["type", "required", "mustStayContinuous"], f"{label}.carriedElement", errors)
        continuity = template.get("continuityContract", {})
        require_fields(continuity, ["samplePoints", "assertions"], f"{label}.continuityContract", errors)
        aspects = template.get("aspectVariants", {})
        for aspect in ("portrait-9-16", "landscape-16-9"):
            if aspect not in aspects:
                errors.append(f"{label} missing aspect variant: {aspect}")

    return errors


def validate_presenter_transition(instance, errors):
    presenter = instance.get("keyframes", {}).get("presenter", [])
    info = instance.get("keyframes", {}).get("infoLayer", [])
    label = f"transition {instance.get('transitionId')} {instance.get('fromSceneId')}->{instance.get('toSceneId')}"
    if len(presenter) < 3 or len(info) < 3:
        errors.append(f"{label} requires at least three presenter and infoLayer keyframes")
        return
    presenter = sorted(presenter, key=lambda item: item.get("frame", -1))
    info = sorted(info, key=lambda item: item.get("frame", -1))
    widths = [item.get("rect", [0, 0, -1, -1])[2] for item in presenter]
    heights = [item.get("rect", [0, 0, -1, -1])[3] for item in presenter]
    radii = [item.get("radius", -1) for item in presenter]
    if widths != sorted(widths, reverse=True) or heights != sorted(heights, reverse=True):
        errors.append(f"{label} presenter size must decrease monotonically")
    target_rect = presenter[-1].get("rect", [0, 0, 0, 0])
    distances = [
        sum(abs(value - target) for value, target in zip(item.get("rect", []), target_rect))
        for item in presenter
    ]
    if distances != sorted(distances, reverse=True) or distances[-1] != 0:
        errors.append(f"{label} presenter must move monotonically toward its target rect")
    if radii != sorted(radii):
        errors.append(f"{label} corner radius must increase monotonically")
    if any(item.get("opacity") != 1 for item in presenter):
        errors.append(f"{label} presenter must stay fully visible")
    progress = [item.get("buildProgress", -1) for item in info]
    if progress != sorted(progress):
        errors.append(f"{label} infoLayer buildProgress must be monotonic")
    if progress[-1] >= 1:
        errors.append(f"{label} infoLayer must remain incomplete at transition end")


def rect_matches_corner(rect, corner, canvas):
    if not isinstance(rect, list) or len(rect) != 4:
        return False
    x, y, width, height = rect
    canvas_width, canvas_height = canvas
    center_x = x + width / 2
    center_y = y + height / 2
    horizontal_ok = center_x >= canvas_width / 2 if corner.endswith("right") else center_x <= canvas_width / 2
    vertical_ok = center_y <= canvas_height / 2 if corner.startswith("top") else center_y >= canvas_height / 2
    return horizontal_ok and vertical_ok


def validate_plan(plan, scene_map, transition_map, contract, schema=None, plan_schema=None, adapter_map=None, allow_legacy_input=True):
    errors = []
    if adapter_map is None:
        adapter = load_json(ASSETS / "shotcraft-card-adapter.json")
        adapter_map = {item["id"]: item for item in adapter.get("cards", [])}
    generated_plan = plan.get("generated") is True
    if plan_schema and (generated_plan or not allow_legacy_input):
        system_schema_uri = (ASSETS / "semantic-template-system.schema.json").resolve().as_uri()
        plan_schema_with_id = {**plan_schema, "$id": (ASSETS / "semantic-template-plan.schema.json").resolve().as_uri()}
        registry = Registry().with_resource(system_schema_uri, Resource.from_contents(schema))
        validator = Draft202012Validator(plan_schema_with_id, registry=registry)
        for issue in sorted(validator.iter_errors(plan), key=lambda item: list(item.path)):
            errors.append(f"plan schema {list(issue.path)}: {issue.message}")
    root_required = (
        plan_schema.get("required", [])
        if plan_schema and generated_plan
        else ["version", "status", "fps", "aspect", "sceneInstances", "transitionInstances", "userOverrides"]
    )
    require_fields(plan, root_required, "plan", errors)
    fps = plan.get("fps")
    aspect = plan.get("aspect")
    if not isinstance(fps, (int, float)) or fps <= 0:
        errors.append("plan fps must be positive")
        return errors
    if aspect not in ("portrait-9-16", "landscape-16-9"):
        errors.append("plan aspect must be portrait-9-16 or landscape-16-9")

    scenes = plan.get("sceneInstances", [])
    scene_by_id = {}
    for scene in scenes:
        scene_id = scene.get("sceneId")
        label = f"scene {scene_id or '<unknown>'}"
        scene_required = schema_required(schema, "sceneInstance") if schema else ["sceneId", "templateId", "sourceMode", "aspect", "entryRole", "exitRole", "denseSpeech", "startFrame", "endFrameExclusive", "resolvedParams", "wordCues", "processContinuity", "overrides"]
        if not generated_plan:
            scene_required = [field for field in scene_required if field != "sourceEvidence"]
        require_fields(scene, scene_required, label, errors)
        if scene_id in scene_by_id:
            errors.append(f"duplicate scene id: {scene_id}")
        scene_by_id[scene_id] = scene
        validate_design_references(scene, label, "scene", adapter_map, schema, errors)
        start = scene.get("startFrame")
        end = scene.get("endFrameExclusive")
        if not isinstance(start, int) or not isinstance(end, int) or start < 0 or end <= start:
            errors.append(f"{label} has invalid frame range")
            continue
        if scene.get("aspect") != aspect:
            errors.append(f"{label} aspect differs from plan")
        source_mode = scene.get("sourceMode")
        template_id = scene.get("templateId")
        if source_mode not in SOURCE_MODES:
            errors.append(f"{label} has unsupported sourceMode: {source_mode}")
        if source_mode == "template" and template_id not in scene_map:
            errors.append(f"{label} references unknown template: {template_id}")
        if source_mode in ("bespoke", "bespoke-forced") and template_id is not None:
            errors.append(f"{label} bespoke sourceMode requires templateId null")
        if source_mode in ("chatcut-library", "project-existing"):
            evidence = scene.get("sourceEvidence", {})
            require_fields(evidence, ["snapshotRef", "snapshotRevision", "identityRef", "toolId", "toolEvidenceRef"], f"{label}.sourceEvidence", errors)
            if evidence.get("identityRef") != template_id or not template_id:
                errors.append(f"{label} external source identityRef must equal templateId")
        if source_mode == "legacy" and plan.get("status") == "locked":
            errors.append(f"{label} legacy sourceMode must be resolved before locking")
        template = scene_map.get(template_id)
        if not isinstance(scene.get("entryRole"), str) or not scene.get("entryRole"):
            errors.append(f"{label} requires a non-empty entryRole")
        if not isinstance(scene.get("exitRole"), str) or not scene.get("exitRole"):
            errors.append(f"{label} requires a non-empty exitRole")
        if template:
            if scene.get("entryRole") not in template["transitionPorts"]["entryRoles"]:
                errors.append(f"{label} entryRole is not allowed by its template")
            if scene.get("exitRole") not in template["transitionPorts"]["exitRoles"]:
                errors.append(f"{label} exitRole is not allowed by its template")
            resolved_params = scene.get("resolvedParams", {})
            for count_key, count_contract in template.get("params", {}).items():
                if not count_key.endswith("Count"):
                    continue
                count = resolved_count(resolved_params, count_key)
                if count is None:
                    errors.append(f"{label} cannot resolve required {count_key}")
                    continue
                minimum = count_contract.get("min")
                maximum = count_contract.get("max")
                if isinstance(minimum, int) and count < minimum:
                    errors.append(f"{label} {count_key} below template minimum")
                if isinstance(maximum, int) and count > maximum:
                    errors.append(f"{label} {count_key} above template maximum")

        cue_frames = []
        allowed_sync_modes = set(template.get("cueContract", {}).get("syncModes", [])) if template else None
        for cue in scene.get("wordCues", []):
            cue_required = schema_required(schema, "wordCue") if schema else ["id", "triggerWord", "triggerFrame", "cueFrame", "syncMode"]
            require_fields(cue, cue_required, f"{label} cue", errors)
            trigger_frame = cue.get("triggerFrame")
            cue_frame = cue.get("cueFrame")
            if not isinstance(trigger_frame, int) or not start <= trigger_frame < end:
                errors.append(f"{label} cue {cue.get('id')} triggerFrame outside scene")
            elif cue_frame != trigger_frame - start:
                errors.append(f"{label} cue {cue.get('id')} cueFrame formula mismatch")
            if allowed_sync_modes is not None and cue.get("syncMode") not in allowed_sync_modes:
                errors.append(f"{label} cue {cue.get('id')} syncMode is not allowed by its template")
            if isinstance(cue_frame, int):
                cue_frames.append(cue_frame)
        if cue_frames != sorted(cue_frames):
            errors.append(f"{label} wordCues must be ordered")

        continuity = scene.get("processContinuity", {})
        continuity_required = schema_required(schema, "processContinuity") if schema else ["isGenuineProcess", "motionWindows", "cadenceFrames"]
        require_fields(continuity, continuity_required, f"{label}.processContinuity", errors)
        if template and continuity.get("isGenuineProcess") != template.get("processContinuityDefault", {}).get("isGenuineProcess"):
            errors.append(f"{label} process classification differs from its template")
        windows = []
        for window in continuity.get("motionWindows", []):
            window_start = window.get("startFrame")
            window_end = window.get("endFrameExclusive")
            if not isinstance(window_start, int) or not isinstance(window_end, int) or not start <= window_start < window_end <= end:
                errors.append(f"{label} has invalid motion window")
            else:
                windows.append((window_start, window_end))
        cadence = continuity.get("cadenceFrames", [])
        if cadence != sorted(set(cadence)):
            errors.append(f"{label} cadenceFrames must be sorted and unique")
        if any(not isinstance(frame, int) or not start <= frame < end for frame in cadence):
            errors.append(f"{label} cadence frame outside scene")
        elif any(not frame_in_ranges(frame, windows) for frame in cadence):
            errors.append(f"{label} cadence frame must fall inside a motion window")

    ordered_scenes = sorted(scenes, key=lambda item: item.get("startFrame", -1))
    adjacent_pairs = []
    for previous, current in zip(ordered_scenes, ordered_scenes[1:]):
        if previous.get("endFrameExclusive", 0) > current.get("startFrame", 0):
            errors.append(f"scenes {previous.get('sceneId')} and {current.get('sceneId')} overlap")
        if previous.get("endFrameExclusive") != current.get("startFrame"):
            errors.append(f"scenes {previous.get('sceneId')} and {current.get('sceneId')} are not contiguous")
        adjacent_pairs.append((previous.get("sceneId"), current.get("sceneId")))

    transitions = plan.get("transitionInstances", [])
    hard_cuts = 0
    previous_signature = None
    transition_pair_counts = {pair: 0 for pair in adjacent_pairs}
    for instance in transitions:
        transition_id = instance.get("transitionId")
        label = f"transition {transition_id or '<unknown>'}"
        transition_required = schema_required(schema, "transitionInstance") if schema else ["transitionId", "fromSceneId", "toSceneId", "aspect", "startFrame", "endFrameExclusive", "intent", "carriedElementBinding", "keyframes", "overrides", "audit"]
        if not generated_plan:
            transition_required = [field for field in transition_required if field not in {"sourceMode", "sourceEvidence", "entryRole", "exitRole"}]
        require_fields(instance, transition_required, label, errors)
        validate_design_references(instance, label, "transition", adapter_map, schema, errors)
        source_mode = instance.get("sourceMode", "template")
        if source_mode not in SOURCE_MODES - {"legacy"}:
            errors.append(f"{label} has unsupported sourceMode: {source_mode}")
        template = transition_map.get(transition_id) if source_mode == "template" else None
        evidence = instance.get("sourceEvidence", {})
        if source_mode == "template" and not template:
            errors.append(f"{label} references unknown transition template")
            continue
        if source_mode in ("chatcut-library", "project-existing"):
            require_fields(evidence, ["snapshotRef", "snapshotRevision", "identityRef", "toolId", "toolEvidenceRef", "roleMetadataRef"], f"{label}.sourceEvidence", errors)
            if evidence.get("identityRef") != transition_id:
                errors.append(f"{label} external source identityRef must equal transitionId")
        if transition_id == "hard-cut":
            hard_cuts += 1
        if instance.get("aspect") != aspect:
            errors.append(f"{label} aspect differs from plan")
        if template and instance.get("intent") != template.get("intent"):
            errors.append(f"{label} intent differs from template")
        from_scene = scene_by_id.get(instance.get("fromSceneId"))
        to_scene = scene_by_id.get(instance.get("toSceneId"))
        if not from_scene or not to_scene:
            errors.append(f"{label} references unknown from/to scene")
            continue
        pair = (from_scene.get("sceneId"), to_scene.get("sceneId"))
        if pair not in transition_pair_counts:
            errors.append(f"{label} does not connect adjacent scenes")
        else:
            transition_pair_counts[pair] += 1
        from_roles = template.get("fromRoles", []) if template else [instance.get("entryRole")]
        to_roles = template.get("toRoles", []) if template else [instance.get("exitRole")]
        if not role_compatible([from_scene.get("exitRole")], from_roles):
            errors.append(f"{label} incompatible with from scene role")
        if not role_compatible([to_scene.get("entryRole")], to_roles):
            errors.append(f"{label} incompatible with to scene role")
        start = instance.get("startFrame")
        end = instance.get("endFrameExclusive")
        duration = end - start if isinstance(start, int) and isinstance(end, int) else -1
        limits = template.get("durationRange", {}) if template else evidence.get("durationRange", {})
        if limits and (duration < limits.get("minFrames", 0) or duration > limits.get("maxFrames", duration)):
            errors.append(f"{label} duration outside template range")
        seam = from_scene.get("endFrameExclusive")
        if not isinstance(start, int) or not isinstance(end, int) or not start <= seam <= end:
            errors.append(f"{label} must straddle the from/to scene seam")
        carried = template.get("carriedElement", {}) if template else evidence.get("carriedElement", {})
        if carried.get("required") and not instance.get("carriedElementBinding"):
            errors.append(f"{label} missing required carried element binding")
        proof_frames = instance.get("audit", {}).get("continuityProofFrames", [])
        proof_points = template.get("continuityContract", {}).get("samplePoints", []) if template else contract["transitions"]["requiredProofPoints"]
        if len(proof_frames) < len(proof_points):
            errors.append(f"{label} has insufficient continuity proof frames")
        if any(not isinstance(frame, int) or frame < start or frame > end for frame in proof_frames):
            errors.append(f"{label} continuity proof frame outside transition")
        signature = (instance.get("intent"), carried.get("type"))
        if contract["transitions"]["forbidAdjacentSameIntentAndCarriedElement"] and signature == previous_signature:
            errors.append(f"{label} repeats previous transition intent and carried element")
        previous_signature = signature
        if transition_id == "presenter-demote-to-corner" and template:
            validate_presenter_transition(instance, errors)
            presenter_keyframes = instance.get("keyframes", {}).get("presenter", [])
            if presenter_keyframes:
                final = sorted(presenter_keyframes, key=lambda item: item.get("frame", -1))[-1]
                variant = template.get("aspectVariants", {}).get(aspect, {})
                target = variant.get("targetRect")
                allowed_targets = [target] if target else []
                if target and variant.get("mirrorAllowed"):
                    canvas_width = contract.get("aspects", {}).get(aspect, {}).get("canvas", [0, 0])[0]
                    x, y, width, height = target
                    allowed_targets.append([canvas_width - x - width, y, width, height])
                if allowed_targets and final.get("rect") not in allowed_targets:
                    errors.append(f"{label} final presenter rect differs from the aspect target")

    for pair, count in transition_pair_counts.items():
        if count != 1:
            errors.append(f"scene handoff {pair[0]}->{pair[1]} requires exactly one transition")

    if transitions and hard_cuts / len(transitions) > contract["transitions"]["maximumHardCutRatio"]:
        errors.append("hard-cut ratio exceeds contract maximum")

    override_ids = set()
    for override in plan.get("userOverrides", []):
        override_id = override.get("id")
        if override_id in override_ids:
            errors.append(f"duplicate user override id: {override_id}")
        override_ids.add(override_id)
        override_required = schema_required(schema, "userOverride") if schema else ["id", "mustHonor", "scope", "appliesTo", "directiveType", "spec", "facet", "conflictPolicy", "fidelityCheck"]
        require_fields(override, override_required, f"override {override_id}", errors)
        if not override.get("mustHonor"):
            continue
        applies_to = override.get("appliesTo", {})
        directive_type = override.get("directiveType")
        spec = override.get("spec", {})
        if override.get("scope") == "scene":
            target = scene_by_id.get(applies_to.get("sceneId"))
            if not target or override_id not in target.get("overrides", []):
                errors.append(f"override {override_id} was not applied to its target scene")
                continue
            if directive_type == "bespoke" and target.get("sourceMode") != "bespoke-forced":
                errors.append(f"override {override_id} bespoke directive must force bespoke source mode")
            if directive_type in scene_map and target.get("templateId") != directive_type:
                errors.append(f"override {override_id} requested scene template was not used")
        elif override.get("scope") == "transition":
            target = next(
                (
                    item for item in transitions
                    if item.get("fromSceneId") == applies_to.get("fromSceneId")
                    and item.get("toSceneId") == applies_to.get("toSceneId")
                ),
                None,
            )
            if not target or override_id not in target.get("overrides", []):
                errors.append(f"override {override_id} was not applied to its target transition")
                continue
            if directive_type in transition_map and target.get("transitionId") != directive_type:
                errors.append(f"override {override_id} requested transition template was not used")
            presenter_keyframes = target.get("keyframes", {}).get("presenter", [])
            presenter_specs = {"targetRadius", "targetRect", "targetCorner"} & set(spec)
            if presenter_specs and not presenter_keyframes:
                errors.append(f"override {override_id} requires presenter keyframes for geometric fidelity")
                continue
            if presenter_keyframes:
                final = sorted(presenter_keyframes, key=lambda item: item.get("frame", -1))[-1]
                if "targetRadius" in spec and final.get("radius") != spec["targetRadius"]:
                    errors.append(f"override {override_id} targetRadius was not honored")
                if "targetRect" in spec and final.get("rect") != spec["targetRect"]:
                    errors.append(f"override {override_id} targetRect was not honored")
                if "targetCorner" in spec:
                    canvas = contract.get("aspects", {}).get(aspect, {}).get("canvas")
                    if not canvas or not rect_matches_corner(final.get("rect"), spec["targetCorner"], canvas):
                        errors.append(f"override {override_id} targetCorner was not honored")
        else:
            errors.append(f"override {override_id} has unsupported scope")

    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", help="Optional semantic-template-plan.json")
    parser.add_argument("--allow-legacy-input", action="store_true", help="Compatibility-only: accept historical non-generated candidate plans")
    args = parser.parse_args()

    library = load_json(ASSETS / "semantic-template-system.json")
    primitives = load_json(ASSETS / "motion-primitives.json")
    contract = load_json(ASSETS / "template-system-contract.json")
    schema = load_json(ASSETS / "semantic-template-system.schema.json")
    plan_schema = load_json(ASSETS / "semantic-template-plan.schema.json")
    adapter = load_json(ASSETS / "shotcraft-card-adapter.json")
    errors = validate_library(library, primitives, contract, schema)

    scene_map = {item["id"]: item for item in library.get("sceneTemplates", [])}
    transition_map = {item["id"]: item for item in library.get("transitionTemplates", [])}
    adapter_map = {item["id"]: item for item in adapter.get("cards", [])}
    errors.extend(validate_shotcraft_adapter(adapter, scene_map))
    if args.plan:
        plan = load_json(args.plan)
        if args.allow_legacy_input and plan.get("status") == "locked":
            errors.append("--allow-legacy-input is restricted to candidate migration plans")
        else:
            errors.extend(validate_plan(plan, scene_map, transition_map, contract, schema, plan_schema, adapter_map, args.allow_legacy_input))

    if errors:
        print(json.dumps({"status": "FAIL", "errors": errors}, ensure_ascii=False, indent=2))
        return 1
    print(json.dumps({
        "status": "PASS",
        "sceneTemplates": len(scene_map),
        "transitionTemplates": len(transition_map),
        "shotcraftCards": len(adapter_map),
        "planValidated": bool(args.plan),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
