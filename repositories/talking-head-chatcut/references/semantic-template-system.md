# 语义动效模板系统

`semantic-template-system.json` 是 Skill 级可选机制 catalog。项目只需在当前执行计划中记录每个场景的模板选择、词级 cue 和转场；执行计划用于忠实执行和复读，不是写入许可。

## 核心定义

把场景模板定义为“信息结构 + 运动签名”，不要把静态排版和动画分开选择。模板的运动签名必须规定入场、逐信息响应、口播中段持续推进和退场；时长、强度、内容数量、词级 cue、画幅和素材由实例参数化。

场景模板与场景转场是两个平行的 Skill catalog 对象，项目实例进入当前执行计划：

- `sceneTemplate` 负责一个场景内部怎样运动着被理解。
- `scenes[].visual.templateChoice/motionSignature/wordCues` 把真实内容、词级时间和画幅绑定到所选模板。
- `transitionTemplate` 负责两个场景状态怎样连续交接。
- `scenes[].transitionOut` 绑定前后场景角色、承载元素、绝对帧和关键帧证据。
- 用户脚本中的明确画面要求保存为 `directives[]`，并由场景/转场引用，优先于模板匹配。
- ShotCraft 等外部设计来源及转译取舍通过 `sourceRefs`、`sourceEvidence` 或 `rejectedCandidates` 留痕；不新增项目 Schema 字段，不参与事实判断，也不替代模板身份或用户指令。

读取：

- `../assets/semantic-template-system.json`：统一场景模板与转场模板库。
- `../assets/semantic-template-system.schema.json`：对象字段合同。
- `../assets/semantic-template-plan.schema.json`：旧模板验证器的自动派生兼容视图合同。
- `../assets/template-system-contract.json`：选择、连续运动、转场和审核阈值。
- `../scripts/validate_template_system.py`：模板库与项目计划验证器。
- `../scripts/test_template_system.py`：横竖屏正向样例、故障样例和镜像 PIP 回归测试。

`motion-primitives.json` 继续作为底层运动词汇。`semantic-motion-patterns.json`、`semantic-scene-components.json` 和 `component-catalog.json` 只作为旧计划兼容来源，不再分别参与新项目的模板选择。

## 解析优先级

按以下顺序解析每个语义段：

1. 先抽取用户脚本中的明确画面标注，保存为当前执行计划的 `directives[]`。
2. `mustHonor: true` 的覆盖恒为最高优先级，只覆盖其 `facet` 指定的分面。
3. 没有强制覆盖时，按观众任务、信息结构、语义动作、画幅、风格、可编辑性和词级控制匹配 `sceneTemplate`。
4. 项目选择写入 `templateChoice`：`origin` 只能为 `skill-catalog`、`chatcut-library`、`project-existing`、`bespoke`；最高真实候选评分低于 8/10 时选择 `origin: bespoke`，不得改写画面描述迁就模板。
5. `sourceEvidence.sourceMode` 按 origin 映射为 `template`、`chatcut-library`、`project-existing` 或 `bespoke`；用户明确要求库外机制时仍使用 `origin: bespoke`，但写 `sourceEvidence.sourceMode: bespoke-forced`。
6. 一次性机制通过 S9 后登记为候选；第二次独立项目通过后晋级 proven。

支持的覆盖分面：

- `whole-scene`：整个场景按用户描述自由制作。
- `template-only`：指定或替换信息结构模板。
- `motion-signature-only`：保留信息结构但按用户动作描述重做内部运动。
- `transition-only`：只指定前后场景交接。
- `timing-only`：只调整 cue、持续时长或节奏。

发生模板兼容冲突时不得静默忽略用户指令。先尝试 bespoke 实现；仍无法忠实时记录 `fidelity-conflict` 并在 S7 阻断。

## 场景实例化

每个场景在当前执行计划创建一个 `scenes[]` 对象；以下概念字段保持一致，避免另建互相冲突的平行计划：

- `sceneId`、`denseSpeech`、`range.startFrame/endFrameExclusive`。
- `visual.informationStructure` 和 `visual.templateChoice`；后者包含 `origin`、`id`、`sourceEvidence`、`score`、`reason`、`rejectedCandidates`。
- `visual.wordCues`：每项包含 `cueId`、`unitId`、`triggerWord`、绝对 `triggerFrame`、相对 `cueFrame`、`syncMode` 和 `settledFrame`。
- `visual.processContinuity`：`isGenuineProcess`、有效 `activeRanges`、`motionCoverage`、`maxDenseStaticSeconds` 和 `contractRef`。
- `directives`：实际应用的用户 `directiveId`。
- `transitionOut`：四源 `transitionChoice`，显式记录 `entryRole`、`exitRole`、`roleMetadataRef`、`intent` 和绝对帧范围；bespoke 也不能跳过角色兼容检查。
- 外部设计参考不能新增 Schema 外的项目字段。固定 commit、配方/demo、适配方式和必保动作进入对应 `sourceRefs`、`templateChoice.sourceEvidence` 或 `rejectedCandidates`；它们仍不参与事实判断，也不替代模板身份。

`cueFrame` 必须等于 `triggerFrame - scene.range.startFrame`。同步单位是语义信息单元，不是逐字卡拉 OK。

ShotCraft 等外部卡片只能在模板/转场匹配之后充当运动实现参考。不得把卡名写进 `templateChoice.id` 或 `sourceEvidence.sourceMode`。用户明确点名卡片时，先建立 `mustHonor: true` 的 directive，再按 [shotcraft-adapter.md](shotcraft-adapter.md) 解析和移植。

## 持续运动

“持续运动”指语义状态在口播过程中继续推进，不等于装饰元素一直漂浮：

**这里没有任何数量门槛。** 2026-08-02 起，"有效运动覆盖率"、"最多静止几秒"这类指标已从契约中删除 —— 它们逼出了"为凑指标而加动效"和"嫌麻烦干脆不加"两个极端。

- 每个动效必须声明 `purpose`：它服务哪句口播的什么理解任务（理解结构 / 强调重点 / 表达关系 / 定位操作 / 建立记忆点，五选一）。说不出来的动效不做。
- 用户规划里写了的动效不受此限 —— 它天然有 purpose：用户要求。
- 没有理由加画面时，默认保持干净的真人全屏。这是合格状态，不是偷懒。
- 有效运动是：揭示一项、焦点迁移、路径推进、节点解析、真实素材聚焦、结构收束。
- 无语义漂浮、呼吸、闪烁、光扫、空扫描和假进度是禁止的装饰循环，不是"不计分"而已。
- 只在内容明确表达循环、扫描、实时或等待时使用有界循环，并在语义窗结束时停止。

每个场景同一时刻只保留一个主运动焦点。阅读关键结论时降低辅助运动强度。

## 转场

转场不是随机效果。先判断语义关系和需要连续保留的对象，再匹配 `transitionTemplate`：

- `chapter-break`：主题重置，允许章节遮罩、翻页或明确硬切。
- `continuation`：同一概念继续展开，优先关键词、节点或方向承接。
- `detail`：从总览进入真实素材或局部证据。
- `overview`：从局部回到系统总览。
- `correction`：误解在否定 cue 被正确结论替换。
- `role-demote`：全屏口播连续缩小为角落 PIP，信息画布接管主叙事。

匹配时同时验证前场景 `exitRoles`、后场景 `entryRoles` 和转场 `fromRoles`/`toRoles`。没有兼容转场时显式使用 `hard-cut` 或制作 bespoke 转场；不得随便套翻页、擦除或缩放。

每一对相邻场景必须恰好有一个转场实例，包括显式 `hard-cut`。转场帧范围必须跨过两场景的接缝，不能把转场登记在无关时间段冒充实现。

需要连续承载对象的转场必须保存起点、中点和终点证据。承载对象在整个转场中保持同一身份、连续可见和可追踪。

### 全屏口播缩到角落

使用 `presenter-demote-to-corner`：

1. 保持同一口播视频连续播放。
2. 在 18 至 36 帧内等比缩小并移动到目标角落。
3. 圆角从 0 连续增加到画幅变体的目标值。
4. 信息画布在人物后方建立；人物到位帧时信息结构只完成约 60%，后续内容继续按词级 cue 展开。
5. 9:16 默认右上方形并以头像居中裁切；16:9 默认右上横形，可根据主内容镜像到左上。
6. 审核起点、中点和终点；硬切人物视频、瞬间改变裁切或提前铺满信息均判失败。

## 画幅

每个模板和转场必须同时提供 `portrait-9-16` 与 `landscape-16-9` 变体。横竖屏分别构图，禁止按比例拉伸或简单裁切：

- 9:16 优先纵向层级、折线路径、右上方形 PIP，并为底部字幕留安全带。
- 16:9 优先非对称左右构图、横向流程和横形 PIP；PIP 可按主内容镜像。

## 自动检查

模板库或模板兼容视图发生变化后运行：

```powershell
python scripts/validate_template_system.py --plan <semantic-template-plan.json>
python scripts/test_template_system.py
```

验证器检查模板和原语引用、双画幅、cue 公式、逐动效 purpose、转场角色兼容、持续承载证据和用户指令落实。机器合同通过后，S7/S9 仍必须用真实合成帧检查语义时机、构图、裁切、重叠和视觉连续性；模板名称不能替代像素证据。
