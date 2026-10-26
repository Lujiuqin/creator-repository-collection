# legacy/

2026-08-02 归档。这里的文件**只用于读取存量计划**，主流程文档和新项目选型不再引用它们。

| 文件 | 原位置 | 现在的唯一用途 |
|---|---|---|
| `semantic-motion.md` | `references/` | 读懂旧计划里的 `legacy.*` 单元字段 |
| `component-blueprints.md` | `references/` | 读懂旧计划里的组件蓝图名称 |
| `semantic-motion-patterns.json` | `assets/` | `validate_semantic_motion.py` 对旧派生视图的兼容校验 |
| `semantic-scene-components.json` | `assets/` | 同上 |

新项目的场景与转场选型只走 `assets/semantic-template-system.json`（一个 `sceneTemplate` 同时决定信息结构和完整运动签名）。
底层运动词汇仍在 `assets/motion-primitives.json`。

不要在 S4 规划或 S5–S9 执行时加载本目录。
