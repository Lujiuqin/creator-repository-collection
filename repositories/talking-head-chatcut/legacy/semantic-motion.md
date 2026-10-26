# 语义动效系统

项目级语义动效只写入 `剪辑/edit-plan.lock.json` 的 `scenes[].semanticUnits`、`scenes[].visual` 和 `visualSystemMetrics`。`semantic-motion-plan.json` 是由该执行源自动生成的只读兼容视图，不得由 Agent 单独创建、锁定或反向覆盖执行源。

## 目的

让 MG 动画承担理解、强调、关系、节奏或记忆任务。先判断观众此刻需要理解什么，再选择信息结构及其绑定的运动签名；不得从“想加点动效”反推动画。

新项目必须先读取 `semantic-template-system.md`，把“信息结构 + 运动签名”作为一个 `sceneTemplate` 选择并实例化。以下三层目录继续解释底层原语和兼容旧计划，但不再分别参与新项目的模板选择。

每次规划或制作语义动效时读取：

- `../assets/motion-primitives.json`：24 个基础运动原语，回答“怎么动”。
- `../assets/semantic-motion-patterns.json`：36 个语义模式，回答“为什么动”。
- `../assets/semantic-scene-components.json`：18 个场景组件，回答“整段画面怎么组织”。
- `../assets/visual-sync-contract.json`：词级 cue、证据和硬失败规则。
- `../assets/semantic-template-system.json`：新项目的统一场景模板与转场模板源。
- `../assets/template-system-contract.json`：持续运动、转场和用户指令阈值。

## 新项目选择顺序

1. 从脚本抽取用户明确画面标注，写入 edit plan 根对象 `directives[]` 并标记 `mustHonor: true`。
2. 写出 `viewerJob` 和 `informationStructure`，匹配 `semantic-template-system.json` 的 `sceneTemplate`。
3. 同时接受模板绑定的 `motionSignature`；只参数化内容、数量、词级 cue、强度、时长、画幅和素材，不得再给静态布局随意套入场动画。
4. 模板评分低于 8/10 时制作 `bespoke` 机制；用户明确要求库外效果时制作 `bespoke-forced` 机制。
5. 把场景机制写入 `scenes[].visual`，把交接写入前一场的 `transitionOut`，并通过 edit-plan 包装验证器运行模板合同。

## 旧计划兼容路由

对每个语义信息单元依次执行：

1. 写出 `viewerJob`：观众在这一刻需要理解、比较、定位、记住或感受到什么。
2. 从校正后的精剪转写记录 `triggerWord`、`triggerFrame` 和信息合法出现的最早时机。
3. 从场景目录选择一个 `sceneComponentId`；场景只承担一个主要认知任务。
4. 从语义目录选择一个主要 `semanticPatternId`。只有同时存在第二个独立理解任务时才增加一个辅助模式。
5. 从模式允许的 `primitiveIds` 中选择 1 至 3 个原语，用 `primitiveAssignments` 为每个原语分别指定 `primary`/`auxiliary`、同步模式和强度；恰好一个原语为主原语。
6. 选择 `syncMode`、`motionIntensity`、`motionProfile`、`entryState`、`cueState`、`settledState` 和 `exitState`。
7. 以内联 JSX 在 ChatCut 中创建可编辑 MG；外部库只能用于研究运动机制，不得作为运行时依赖。
8. 用真实合成帧检查 cue 前、cue 时、稳定态和退出态；代码或时间线数值不能替代像素证据。

不得因为目录里有某个模式就强行使用。没有匹配项时制作一次性机制，并在 S10 判断是否值得登记。

所选 `primitiveIds` 必须是主要 `semanticPatternId` 允许原语的子集。若第二个观众任务需要其他原语，必须显式记录 `auxiliarySemanticPatternId`，并证明它是独立理解任务；不得直接越过目录拿原语。`crisp-exit` 只负责退出，不算第二个主表达模式。

## 四种同步模式

- `reveal`：新信息到达 cue 时首次可读。适合结论、定义、列表项和新解释。
- `highlight`：信息已经合法可见，cue 到达时从普通态切换到重点态，并降低邻项权重或改变焦点。只显示“highlight”文字不算实现。
- `state-change`：节点、连接、进度、顺序、完成或选择状态随 cue 推进。
- `media-focus`：真实或仿真素材先建立上下文，再把缩放、框选、箭头、裁切或焦点迁移到具体对象。空准星或无对象扫描不算实现。

## 强度等级

- `L0`：无 MG 动画。让人物、原始素材或停顿承担画面；用于无需补充理解的句子。
- `L1`：轻响应。一次下划线、颜色切换、局部框选或轻量状态确认；用于普通信息。
- `L2`：结构响应。揭示、累积、连线、计数、对比或素材聚焦；用于步骤、关系、数据和证据。
- `L3`：主叙事冲击。全屏结论、章节、反转或强收束；同一连续段落默认不超过一次。

强度由语义重要度决定，不由画面空不空决定。没有明确理由时使用 `L1` 或 `L2`，不得为了热闹升级到 `L3`。

## 密度与节奏

- 同一时刻只保留一个主运动焦点；辅助运动不得与主焦点竞争。
- 同一语义单元默认使用 1 个主原语和最多 2 个辅助原语。
- 强响应落稳后保留足够阅读时间；退出不得截断内容。
- 信息密集口播不得超过 4 秒没有有效状态变化。流程、迁移、增长、装配、扫描和生成场景必须在口播中段持续推进语义状态，有效运动覆盖率至少 0.5；定义、结论、对比和清单至少 0.3，并把状态变化分布到整段。
- 两个 `L3` 响应之间至少保留一个完整语义单元的视觉恢复期。
- 章节、结论、数字和流程允许不同运动节奏；不得给全片所有 MG 套同一进出动画。
- 词级 cue 触发承载理解的语义单元，不做逐字卡拉 OK。

## 常驻运动限制

默认禁止以下与语义无关的常驻运动：

- 无限漂浮、呼吸、闪烁、发光和网格移动。
- 每个字幕词都缩放、弹跳或变色。
- 没有对象的扫描线、准星和进度假数据。
- 与内容无关的粒子、光扫、镜头晃动和连续循环。

只有内容明确表达加载、扫描、能量、实时检测、等待或循环时，才允许对应循环；循环必须在语义状态结束时停止。触发反馈优先使用一次性动作并落稳。

## edit plan 字段

每个包含 MG 的场景至少在 edit plan 记录：

- `viewerJob`
- `semanticUnits[]`：`unitId`、`triggerWord`、`triggerFrame`、`syncMode`、`visibleResponse` 与可选 `sourceRef`。
- `visual.wordCues[]`：`cueId`、`unitId`、`triggerWord`、`triggerFrame`、`cueFrame`、`syncMode`、`settledFrame`。
- `visual.motionIntensity`、`visual.primitiveAssignments`、`visual.motionSignature` 和 `visual.processContinuity`。
- 旧验证器需要的 `sceneComponentId`、`semanticPatternId`、`primitiveIds`、`motionProfile`、四态、`meaningfulChangeReason` 和 `reducedMotionFallback` 只放在可选的 `semanticUnits[].legacy`，不能在新计划根层重复一份。

`meaningfulChangeReason` 必须说明这次运动改善了什么：理解、强调、关系、定位、节奏或记忆。写不出来时删除该动效或降为 `L0`。

为兼容旧验证器，`semanticUnits[].legacy` 可以逐单元保存以下字段；它仍属于 edit plan，不是第二份计划。`triggerWord`、`triggerFrame`、`syncMode` 和 `visibleResponse` 保存在语义单元本体，`cueFrame` 保存在同 unitId 的 `visual.wordCues[]`。以下只展示 `legacy` 对象：

```json
{
  "sceneComponentId": "keyword-impact",
  "semanticPatternId": "quote-emphasis",
  "auxiliarySemanticPatternId": null,
  "primitiveIds": ["phrase-settle"],
  "primitiveAssignments": [
    {"primitiveId": "phrase-settle", "role": "primary", "syncMode": "reveal", "intensity": "L2"}
  ],
  "motionIntensity": "L2",
  "motionProfile": "editorial-restrained",
  "meaningfulChangeReason": "让完整短语在合法出现时成为单一记忆锚点",
  "reducedMotionFallback": "在 cue 帧直接显示静态高对比短语卡",
  "entryState": "短语尚未出现",
  "cueState": "完整短语落稳进入安全信息区",
  "settledState": "短语保持全不透明并可读",
  "exitState": "下一语义单元接管前干净退出",
  "handoffToNextUnit": "短语退出后下一主焦点才开始运动",
  "primaryMotionWindow": {"startFrame": 120, "endFrame": 132}
}
```

相邻场景存在时间重叠时，`handoffToNextUnit` 必须说明旧主焦点何时落稳/退出、新主焦点何时接管；不得让两个主焦点同时活跃。

主控先验证唯一执行源，再由确定性脚本生成带派生标记的兼容视图，供旧验证器读取：

```powershell
python scripts/validate_edit_plan.py --plan <剪辑/.edit-plan.locked-candidate.json> --context <planning-context.json> --ledger <剪辑/review-ledger.json>
python scripts/derive_legacy_visual_plans.py --plan <staging/locked-candidate.json> --output-dir <兼容输出目录>
python scripts/validate_semantic_motion.py --plan <semantic-motion-plan.json>
```

三个兼容视图都必须带 `generated=true`、`derivedFromPlanId`、`derivedFromRevision` 和与当前文件一致的 `sourcePlanSha256`。验证失败时不得发布 locked candidate。锁定计划要求全部帧为非负整数、词级 cue 公式正确、原语由模板运动签名授权、有效运动覆盖率达到合同下限、转场角色兼容且用户指令有落实证据。兼容视图仍要求 `cueFrame = triggerFrame - itemStartFrame`、主要/辅助模式授权和主运动窗不重叠，但只能从执行源派生，不能手工修补。

## motionProfile

`motionProfile` 描述同一 Design Style 下的运动语气，不替代具体原语：

- `mechanical-crisp`：硬切、斜切、线条推进、短缓动，适合工业科技。
- `editorial-restrained`：遮罩、排版切换、安静高亮，适合分析和杂志感。
- `friendly-geometric`：平面几何、编号、柔和位移，适合教学解释。
- `cinematic-emphasis`：大尺度构图、留白和单次冲击，适合核心结论。
- `documentary-proof`：少装饰、素材优先、框选与证据标注，适合截图和事实。

项目 Design Style 的动效约束优先于这些通用 profile。

## 审核问题

逐个语义单元询问：

1. 去掉动画后，观众是否更难理解或记住？如果不是，动画可能只是装饰。
2. cue 前是否提前泄露后续结论？
3. cue 到达时是否发生可见且可解释的状态变化？
4. 稳定态是否比中间态更清楚，是否留出阅读时间？
5. `highlight` 是否有普通态、重点态和邻项权重差？
6. `media-focus` 是否聚焦到具体素材对象？
7. 动画停止后是否仍有循环或漂移？
8. 退出是否完整，最后一帧是否避免意外黑帧？
9. 手机尺寸是否可读，横竖屏是否分别构图？
10. 是否有真实合成/导出帧证明以上结论？

## 代表样片结论

2026-07-16 的 ChatCut 代表样片验证了 `reveal`、`highlight`、`state-change`、`media-focus` 四类响应可通过内联 JSX 实现并保持可编辑。首次复审发现“文字写着 HIGHLIGHT 但没有状态变化”“空准星没有具体对象”“常驻网格与循环脉冲无语义”均应判失败；修正为普通态到重点态、全局到具体对象、一次性反馈后通过。把这些判例作为审核原则，不保存项目 ID、资产 ID 或 JSX。
