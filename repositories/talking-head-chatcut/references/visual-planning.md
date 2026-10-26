# 画面规划

项目级执行源由用户原始画面规划、最终脚本和当前执行计划共同组成。需要机器可读文件时使用 `剪辑/edit-plan.json`，记录 `scenes`、`directives`、`captionContract`、`audioPlan` 和 `visualSystemMetrics`；它用于协作与追踪，不构成 ChatCut 写入许可。`semantic-template-plan.json`、`semantic-motion-plan.json` 和 `visual-orchestration-plan.json` 可作为兼容视图，但不得反向覆盖用户原始要求。

## 规划原则

- 先回答“观众此刻必须看懂什么”，再选择绑定信息结构与运动签名的模板；不得先做静态排版再随意套动画。
- 先把用户脚本中的明确画面标注写入根对象 `directives[]`，使用 `mustHonor: true`，再由场景和转场的 `directives` 引用。随后按 `semantic-template-system.md` 填写 `viewerJob`、`visual.informationStructure`、`visual.templateChoice` 和 `transitionOut`；底层实现才从 `motion-primitives.json` 选原语。
- 用精剪后的口播时间码和原句作为锚点，不按粗略秒数猜测。
- 一个场景承载一个主要认知任务；复杂概念用递进卡片、流程或对比拆开。
- 画面出现时机对准关键词或语义完成点。需要铺垫时可轻微提前，但不得提前泄露结论。
- 当前执行计划和其中 `directives` 指导后续模板、素材、MG、字幕、音频与转场。调整时同步更新计划和 ChatCut 实际状态；不需要锁定、签名或重新授权。
- 先确定当前 `layout_profiles`。双画幅交付时共享口播锚点和视觉任务，但分别写明横竖屏布局，不写“自动适配”带过关键差异；后续实际制作时从集合中选择当前 `active_layout_profile`。

## 词级同步设计

先把每个场景拆成“语义信息单元”，例如标题、结论、卡片、列表项、图中节点、连线、数字、按钮标注或素材焦点。每个单元必须记录：

- `triggerWord`：校正转写中的原词或短语。
- `triggerFrame`：精剪、变速后的时间线绝对帧。
- `cueFrame`：相对 MG/素材时间线项起点的帧，计算为 `triggerFrame - itemStartFrame`。
- `syncMode`：`reveal`、`highlight`、`state-change` 或 `media-focus`。
- `templateChoice`：严格使用 `origin`、`id`、`sourceEvidence`、`score`、`reason` 和 `rejectedCandidates`。`origin` 只能是 `skill-catalog`、`chatcut-library`、`project-existing` 或 `bespoke`；新计划禁止 `legacy`。
- `sourceEvidence.sourceMode`：按来源映射为 `template`、`chatcut-library`、`project-existing`、`bespoke` 或 `bespoke-forced`，并保存 `snapshotRef`、`snapshotRevision` 和 `identityRef`。Library/项目既有来源还必须保存 `toolId/toolEvidenceRef`；bespoke 必须保存 `implementationRoute`、`editableProperties` 和 `triggerReason`。
- `primitiveIds`：来自 `motion-primitives.json` 的 1 个主原语和最多 2 个辅助原语。
- `primitiveAssignments`：为每个已选原语单独记录 `role`、`syncMode` 和 `intensity`；只有一个 `primary`，且每项都必须在该原语目录能力内。
- `motionIntensity`：`L0` 至 `L3`；由语义重要度决定。
- `motionProfile`：当前 Design Style 下的运动语气，例如 `mechanical-crisp` 或 `documentary-proof`。
- `meaningfulChangeReason`：说明动画改善理解、强调、关系、定位、节奏或记忆的哪一项。
- `reducedMotionFallback`：无法安全使用目标运动时的静态或轻响应替代方案。
- `visibleResponse`：语义单元到点时的可见响应；更细的前/中/后状态保存在 `visual.motionSignature.perUnitResponse` 或兼容字段 `semanticUnits[].legacy`，不得向 `semanticUnit` 根对象添加 Schema 外字段。
- `processContinuity`：有效运动窗口和状态推进帧。不再声明覆盖率或最大静止段——没有数量门槛。
- `purpose`：每个信息单元的动效服务哪句口播的什么理解任务（理解结构 / 强调重点 / 表达关系 / 定位操作 / 建立记忆点）。用户规划里写了的动效标 `userRequired: true`。
- `transitionOut`：使用与模板相同的四源 `transitionChoice`，保存来源证据、entry/exit role、角色元数据、intent、绝对帧范围和连续性证据。
- 外部设计参考：卡名、固定 commit、适配方式、必保动作和删弃实现写入对应 `sourceRefs`、`templateChoice.sourceEvidence` 或 `rejectedCandidates`，不新增 Schema 外的 `designReferences` 字段；不得用卡名替代观众任务或模板身份。
- `overrides`：本场景或转场实际落实的用户覆盖 ID。

每个语义信息单元必须按 `semantic-motion.md` 的最小 JSON 契约逐项记录，不能用一条全片风格说明代替单元级 `motionProfile`、`meaningfulChangeReason` 或 `reducedMotionFallback`。原语必须属于主要模式允许集合；使用集合外原语时必须声明允许它的辅助语义模式。相邻单元重叠时记录 `handoffToNextUnit`。

模式选择规则：

- `reveal`：适合新结论、新解释和逐项递进；未讲到的信息不能提前完整可读。
- `highlight`：适合目录、总览、并列项或已经合法出现的结构；基础信息可以先显示，但当前项必须在对应口播词到达时获得清晰高亮，且不得提前泄露后续结论。
- `state-change`：适合流程、关系图、任务状态和进度；节点、连线或状态按口播推进。
- `media-focus`：适合截图、录屏和实拍；素材可以已在场，缩放、框选、箭头或局部强调在对应口播词到达时发生。

`highlight` 必须有普通态、重点态和邻项权重差；只有一行写着“HIGHLIGHT”不算实现。`media-focus` 必须先建立真实或仿真素材上下文，再指向具体对象；没有对象的空准星不算实现。

这不是字幕逐字卡拉 OK。同步的是承载理解的语义单元，不要求每个虚词都动画。

## 呈现模式

使用以下模式之一或组合：

- `TH`：全屏口播，适合情绪、过渡和无需补充信息的句子。
- `INFO`：全屏信息页，适合定义、结论、结构和章节开场。
- `TH_CARD`：口播缩至右上圆角方形，主区展示卡片或步骤。
- `ROWS`：宽卡片逐行累积，适合 2 至 5 个并列概念。
- `MEDIA_FULL`：素材全屏播放，适合屏幕演示、现场证据和需要完整观看的片段。
- `MEDIA_FRAME`：素材在框内播放，适合保留口播或上下文。
- `ZOOM_ANNOTATE`：局部放大、框选、箭头或高亮，适合界面细节和证据定位。
- `COMPARE`：并排或前后对比，适合差异、选择和错误示范。
- `MAP`：总结图、流程图或关系图，适合回顾和收束。

## 素材获取模式

每个使用素材的场景同时选择 `resourceMode`：

- `BRAND_ASSET`：官方 Logo、图标、字标或产品图；不得 AI 生成。
- `WEB_SCREENSHOT`：真实 GitHub、官网、文档或产品界面；记录页面与获取日期并处理隐私。
- `PUBLIC_MEDIA`：来源明确的公共图片/视频；必须下载/导入 ChatCut，不能热链搜索缩略图。
- `AI_IMAGE`：概念示意、场景、插图、背景或一致性锚点。
- `AI_VIDEO`：难拍短场景、抽象动态、风格化镜头、图生视频或镜头延展。

同时标记 `factuality`：`official`、`documentary`、`illustrative` 或 `decorative`。真实品牌、真实 UI 和事实证据只能使用前两类；AI 生成只能标为后两类。

## 规划表模板

使用以下列，并保持每行简洁：

| 场景 | 时间/口播锚点 | directiveId | 画幅/布局 | viewerJob / informationStructure | templateChoice.origin/id/sourceEvidence | 设计参考 / 适配方式 | motionSignature / processContinuity | wordCues / visibleResponse | 资源模式/事实类型/来源或生成简报 | transitionOut intent / 承载对象 | SFX intent / anchorFrame | 风险 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 00:00:00，锚点原句 | `D-01` | 9:16 纵向；16:9 左主右辅 | 理解能力源与三分支 | `skill-catalog / radial-system-map / template` | 无；或 `video-shotcraft/card / ported-mg` | 中心建立→分支连线→焦点迁移；0.5 | `cue-01@120f:state-change`；连接三分支 | `BRAND_ASSET / official / 官方品牌页` | `role-demote / presenter-video` | `whoosh@人物到位帧` | PIP 与标题避让 |

不要只写“加动画”“放素材”。必须写清屏幕上出现什么、为什么出现、何时出现、何时离开。

## 复读与变更

执行前把当前执行计划、**用户原始画面规划**、最终脚本、Design Style 和必要代表帧放在一起复读。逐项验证：每个场景对得上用户规划的一行且无未批准降权、`canvasState`/`baseLayer` 合法、描述能由当前素材/ChatCut 实现、cue 来自精剪词级时间码、四源身份与评分真实、模板绑定的运动签名忠实表达信息结构、每个动效都有成立的 purpose、转场连续、横竖屏差异明确、用户标注未被模板覆盖且不存在常驻装饰循环。引用外部设计时还要验证来源可追溯、卡片与语义匹配、必保动作明确且没有引入本地渲染依赖。

复读完成后直接进入标准 ChatCut 写入。用户明确要求审阅画面规划时才设人工确认点；否则不等待锁定文件、审核账本或外部 verdict。

后续若需帧级同步、尺寸、留白或样式修复，刷新项目状态后直接修改，并同步更新当前执行计划。发现需要改变场景意图、增删关键事实或产生明显付费成本时才询问用户。每个实际场景都要能追溯到 `sceneId`；不得用“模板更方便”作为偏离理由。

## 四项并列内容的默认版式

当口播逐项讲解 4 个并列概念时：

1. 先用全屏信息页交代“共有 4 项”的总结构。
2. 进入第一项时，竖屏把口播裁成右上角圆角方形，横屏也优先右上但根据主体位置可镜像到左上；头像居中并与框对齐。
3. 主区使用 4 张横向宽卡片，一张一行；竖屏在画中画下方纵向累积，横屏在主内容区用更宽、更矮的四行累积。讲到哪一项才出现哪一张，或先显示总览后按词级 cue 高亮当前行；由规划中的 `syncMode` 决定。
4. 新卡片出现时保留前面的卡片，直至四张在一屏内完整呈现。
5. 卡片只保留名称和一句最必要说明，字号优先于信息量。
