# video-shotcraft → ChatCut 适配层

## 定位

把 [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) 当作外部镜头语言和调校经验来源，ChatCut 始终是唯一制作、审核与交付环境。

- ShotCraft 卡只提供设计参考、动作阶段、节奏比例和已知坑。
- `sceneTemplate` 仍由观众任务、信息结构和完整运动签名决定。
- `sourceMode` 仍只使用 `template`、`bespoke`、`bespoke-forced` 或 `legacy`；不得新增 `shotcraft` sourceMode。
- 所有视频、字幕、真实素材、MG、音乐和音效必须作为 ChatCut 可编辑资产和时间线项存在。
- 禁止把 ShotCraft、Ink Press 或任意 Remotion 工程作为本地合成链运行、安装到内容项目或渲染成压平中间片。

首批支持卡见 `../assets/shotcraft-card-adapter.json`。该表是候选入口，不是自动套用清单。

首批表之外的卡不得自动选择。用户明确点名未登记卡时，先读取卡片、准确 demo 和许可信息并完成 ChatCut 兼容性检查；兼容时先把完整适配条目加入首批表并运行统一验证器，再进入规划。无法满足可编辑性、双画幅、真实素材或云端渲染合同时，将其标为 `study-only` 并用 ChatCut bespoke 机制忠实实现用户意图，不得借卡名宣称复现。

## 触发与优先级

按以下顺序处理：

1. 用户明确点名卡片时，把要求保存为 `mustHonor userOverride`。默认覆盖分面为 `motion-signature-only`；用户明确要求整镜复现时才使用 `whole-scene`。
2. 用户未点名时，先完成 `sceneTemplate` / `transitionTemplate` 匹配。只有首批卡与观众任务、信息结构、素材条件和当前风格都一致时，才自主选择一张作为设计参考。
3. 当前模板已经能清晰实现锁定画面时，不为增加“电影感”强行叠卡。
4. 同一场景最多使用一张主卡；相邻场景避免复用同一动作命门；招牌转场全片最多一次。
5. 用户指令、锁定画面描述、词级 cue、真实素材和当前 Design Style 均高于外部卡片。

ShotCraft 卡不是事实依据。卡内示例文案、UI、数字、品牌和页面均不得进入成片，除非它们本身就是经过核验的目标素材。

## 来源解析

使用某张卡前：

1. 从适配表读取 `recipePath`、`demoPath`、适配方式和必保动作。
2. 从官方仓库读取该卡全文和准确 demo 源码；优先使用适配表的 `reviewedRevision`，如改用更新版本则记录实际 commit。
3. 只在临时目录进行只读 checkout，或读取固定 commit 的 raw 文件；不得 vendor、symlink 或安装仓库到本 Skill 或内容项目。
4. 记录 `designReferences`：
   - `provider: "video-shotcraft"`
   - `cardId`
   - `sourceRevision`
   - `recipePath`
   - `demoPath`
   - `adaptationMode`
   - `preservedBeats`
   - `discardedImplementation`
5. 场景引用写入 `sceneInstance.designReferences`；转场引用写入 `transitionInstance.designReferences`。

卡片文档与 demo 冲突时，以同一 commit 的 demo 调校参数作为运动实现参考，但不得覆盖更高优先级的锁定画面和 ChatCut 合同。

## 适配方式

- `motion-grammar`：只吸收运动逻辑和节奏，不复制代码。
- `ported-mg`：把单镜头重写为 ChatCut 内联纯 JavaScript JSX。
- `timeline-plus-mg`：真实素材、口播或录屏由时间线承载，MG 只负责遮罩、标注、框线和语义响应。
- `study-only`：只参考构图或节奏；不得声称已经复现该卡。

默认优先 `motion-grammar`。只有单个 MG 能在 ChatCut 中保持可编辑属性、词级同步和双画幅构图时才使用 `ported-mg`。

首批表中 `study-only` 的卡仅用于方案和构图参考，不能直接进入 ChatCut 代码移植。需要正式移植时先补齐可执行的场景/转场合同并通过一次真实项目验证。

## Remotion → ChatCut 转译合同

1. 删除 TypeScript 类型、所有 `import` / `export`、`Composition`、`Sequence`、`staticFile`、本地组件和 fixture 依赖。
2. 使用 `chatcut:create-motion-graphics` 的内联代码合同：`const Component = ({ item }) => ...`，所有时间由 `useCurrentFrame()` 驱动。
3. 把可见文字、颜色、数字、图片和视频改成 `item.props` 的可编辑属性；素材 URL 不得硬编码。
4. 把 ShotCraft 的假 UI 替换为目标项目的真实截图、录屏或可验证数据。真实素材作为 ChatCut asset 导入，不依赖热链。
5. 原卡按 30fps 给出帧数时，以 `round(sourceFrames × targetFps / 30)` 作为初始换算，再以实际词级 cue 和阅读时间重排；保留阶段比例和停稳逻辑，不机械照搬绝对帧。
6. 保留确定性：不得使用 `Date.now()` 或 `Math.random()`；需要噪声时使用固定种子或 ChatCut 可用的确定性 `random`。
7. 为 `portrait-9-16` 和 `landscape-16-9` 分别构图；不得把 ShotCraft 的 1920×1080 demo 直接裁成竖屏。
8. 原卡需要跨镜头、人物、真实录屏或多个音轨时，拆为时间线项和 MG；不得把全部内容塞进一个不可维护的全屏 MG。

## 素材、代码与授权

- 仓库代码主体为 Apache-2.0。复制或修改具体代码时，在 MG 资产描述或项目来源台账记录仓库、commit、原文件和许可证；保留适用的版权/NOTICE 信息。
- 动作思路重写仍记录设计来源，便于审核和后续更新。
- 音频、音乐、截图和 demo 素材不是默认可复用资产。逐文件核验来源与许可；来源不明或记录不完整的一律不用。
- 优先使用 ChatCut 已核验音效/音乐和目标项目的真实素材，不整包导入 ShotCraft `assets/audio`。
- Ink Press 只能作为 `study-only` 的结构参考，不能作为 ChatCut 的可执行模板。

## 规划与验收

规划阶段先写清：观众任务、信息结构、模板/转场、词级 cue、素材、卡片引用、适配方式、必保动作、删弃实现和降级方案。

S7/S9 用 ChatCut 合成帧验证，而不是用 ShotCraft demo 或本地渲染证明：

- 必保动作阶段是否真实可见，顺序、速度对比和停稳是否成立。
- cue 前是否没有提前泄露，cue 时是否发生预期响应，最后是否真静止。
- 真实素材、字幕、PIP 和 MG 是否共同构成完整画面，无裁切、遮挡和跨场景污染。
- 横竖屏是否各自成立。
- 如果动作命门被删掉、弱化到不可感知或与语义冲突，把引用降级为 `study-only` 或移除，不得继续用卡名宣称复现。

通过 S9 的外部卡适配不会自动成为 `proven` ChatCut 模板。只有其“观众任务 + 信息结构 + 完整运动签名”按 `template-evolution.md` 在真实项目中满足晋级条件时，才登记为候选或晋级。
