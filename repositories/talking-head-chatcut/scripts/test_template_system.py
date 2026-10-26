#!/usr/bin/env python3
import copy
import json
import sys
from pathlib import Path

import validate_template_system as validator


FIXTURES = Path(__file__).resolve().parent / "fixtures"


def load_fixture(name):
    return validator.load_json(FIXTURES / name)


def assert_error(errors, fragment):
    if not any(fragment in error for error in errors):
        raise AssertionError(f"expected error containing {fragment!r}; got {errors}")


def main():
    library = validator.load_json(validator.ASSETS / "semantic-template-system.json")
    primitives = validator.load_json(validator.ASSETS / "motion-primitives.json")
    contract = validator.load_json(validator.ASSETS / "template-system-contract.json")
    schema = validator.load_json(validator.ASSETS / "semantic-template-system.schema.json")
    plan_schema = validator.load_json(validator.ASSETS / "semantic-template-plan.schema.json")
    adapter = validator.load_json(validator.ASSETS / "shotcraft-card-adapter.json")
    scene_map = {item["id"]: item for item in library["sceneTemplates"]}
    transition_map = {item["id"]: item for item in library["transitionTemplates"]}
    adapter_map = {item["id"]: item for item in adapter["cards"]}

    library_errors = validator.validate_library(library, primitives, contract, schema)
    if library_errors:
        raise AssertionError(library_errors)
    adapter_errors = validator.validate_shotcraft_adapter(adapter, scene_map)
    if adapter_errors:
        raise AssertionError(adapter_errors)

    portrait = load_fixture("portrait-plan.json")
    landscape = load_fixture("landscape-plan.json")
    for plan in (portrait, landscape):
        errors = validator.validate_plan(plan, scene_map, transition_map, contract, schema, plan_schema, adapter_map)
        if errors:
            raise AssertionError(errors)

    referenced = copy.deepcopy(portrait)
    card = adapter_map["marker-underline-title"]
    referenced["sceneInstances"][1]["designReferences"] = [{
        "provider": "video-shotcraft",
        "cardId": card["id"],
        "sourceRevision": adapter["reviewedRevision"],
        "recipePath": card["recipePath"],
        "demoPath": card["demoPath"],
        "adaptationMode": card["adaptationMode"],
        "preservedBeats": card["preservedBeats"],
        "discardedImplementation": ["Remotion imports and demo fixtures"],
    }]
    referenced_errors = validator.validate_plan(referenced, scene_map, transition_map, contract, schema, plan_schema, adapter_map)
    if referenced_errors:
        raise AssertionError(referenced_errors)

    bad_reference = copy.deepcopy(referenced)
    bad_reference["sceneInstances"][1]["designReferences"][0]["cardId"] = "unknown-card"
    assert_error(
        validator.validate_plan(bad_reference, scene_map, transition_map, contract, schema, plan_schema, adapter_map),
        "unknown adapter card",
    )

    bad = copy.deepcopy(portrait)
    bad["sceneInstances"][1]["processContinuity"]["cadenceFrames"] = [120, 160]
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "cadence frame must fall inside")

    bad = copy.deepcopy(portrait)
    bad["sceneInstances"][0]["exitRole"] = "fullscreen-info"
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "incompatible with from scene role")

    bad = copy.deepcopy(portrait)
    bad["sceneInstances"][1]["wordCues"][0]["syncMode"] = "media-focus"
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "syncMode is not allowed")

    bad = copy.deepcopy(portrait)
    bad["sceneInstances"][1]["resolvedParams"]["items"] = [str(index) for index in range(10)]
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "above template maximum")

    bad = copy.deepcopy(portrait)
    bad["userOverrides"][0]["spec"]["targetRadius"] = 30
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "targetRadius was not honored")

    bad = copy.deepcopy(portrait)
    bad["transitionInstances"][0]["keyframes"].pop("presenter")
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "requires presenter keyframes")

    bad = copy.deepcopy(landscape)
    bad["transitionInstances"] = bad["transitionInstances"][:1]
    assert_error(validator.validate_plan(bad, scene_map, transition_map, contract, schema, plan_schema), "requires exactly one transition")

    mirrored = copy.deepcopy(portrait)
    mirrored["aspect"] = "landscape-16-9"
    for scene in mirrored["sceneInstances"]:
        scene["aspect"] = "landscape-16-9"
    transition = mirrored["transitionInstances"][0]
    transition["aspect"] = "landscape-16-9"
    transition["keyframes"]["presenter"] = [
        {"frame": 96, "rect": [0, 0, 1920, 1080], "radius": 0, "opacity": 1},
        {"frame": 108, "rect": [300, 35, 900, 506], "radius": 12, "opacity": 1},
        {"frame": 120, "rect": [60, 70, 360, 240], "radius": 24, "opacity": 1},
    ]
    mirrored["userOverrides"][0]["spec"]["targetCorner"] = "top-left"
    mirrored["userOverrides"][0]["spec"]["targetRadius"] = 24
    mirrored_errors = validator.validate_plan(mirrored, scene_map, transition_map, contract, schema, plan_schema)
    if mirrored_errors:
        raise AssertionError(mirrored_errors)

    print(json.dumps({
        "status": "PASS",
        "positiveFixtures": 3,
        "negativeCases": 11,
        "mirroredPresenterTransition": "PASS",
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
