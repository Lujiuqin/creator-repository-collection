#!/usr/bin/env python3
"""Small deterministic checks for contact-sheet scene-map handling."""

from __future__ import annotations

import json

from generate_contact_sheet import label_for, stable_mid_frame, xstack_layout


def main() -> None:
    scene = {
        "userSceneId": "用户-1",
        "planSceneId": "scene-1",
        "label": "开场画面",
        "range": {"startFrame": 30, "endFrameExclusive": 90},
    }
    frame = stable_mid_frame(scene)
    assert frame == 60
    label = label_for(scene, frame)
    assert "scene-1" in label
    assert "开场画面" in label
    assert xstack_layout(4, 2) == "0_0|w0_0|0_h0|w0_h0"
    print(json.dumps({"status": "PASS", "midFrame": frame}, ensure_ascii=False))


if __name__ == "__main__":
    main()
