---
name: talking-head-chatcut
description: Produce complete editable ChatCut talking-head and narration videos in 9:16 or 16:9 from supplied video, scripts, and materials. Use when Codex should directly edit in ChatCut, clean speech, correct ASR and proper nouns, style subtitles, implement the user's own visual plan faithfully, create editable motion graphics and continuous transitions, source verified media, enhance audio, verify the rendered result, and export after the user has seen the contact sheet.
---

# ChatCut 口播成片

## 核心契约

1. **用户画面规划是版式与动效的最高真值。** AI 只做三件事：补充用户没写的场景、细化用户描述到精确帧和参数、润色不改变结构的配色字号曲线。
2. **AI 不得**删除或替换用户指定的版式、删掉用户指定的 PIP、合并拆分或重排用户定义的场景、把用户点名的机制降级为通用模板、改写用户的画面描述去迁就现有模板。
3. **认为用户规划有问题时（无法实现、素材缺失、互相矛盾），唯一合法动作是停下来向用户提问**，把问题、影响和备选方案列出来等用户裁决。不允许"先按自己理解改了再说"。
4. **没有数量型密度指标。** 没有理由加画面时保持干净的真人全屏；每个动效必须能说出它服务哪句口播的什么理解任务，说不出就不做。
5. 始终在 ChatCut 项目和时间线上制作并保留可编辑性；不在本地压平后导入，不交付 Remotion 工程；不拉伸裁切或加黑边冒充另一个画幅。
6. 画面规划是执行说明，不是写入门禁。收到正常的制作、修改或继续请求后，直接在当前 ChatCut 项目中执行；写前刷新项目状态，写后重读结构并检查合成帧。
7. 优先使用用户素材和已锁定的口播稿/SRT，标记为"最终"的稿件不得擅自改写观点；默认口播 `1.1x`、保持音高、启用人声增强。
8. 真实 Logo、产品界面和事实证据必须来自官方原始资源或现场截图，禁止 AI 伪造。AI 图片用 Codex 内置 `image_gen`，AI 视频用 `chatcut:video-gen`。
9. 导出前必须把接触表交给用户过目并取得批准记录。
10. 本账号的 4K 主口播默认由用户在 ChatCut Desktop 本地导入，AI 按 [local-4k-workflow.md](references/local-4k-workflow.md) 接管编辑。`local-only` 只限制云端源字节和云端画面渲染，不得误判为不能剪辑、不能加字幕/贴图/转场或素材已降级。

执行细节全部在 [hard-invariants.md](references/hard-invariants.md)。**S5–S9 执行时该文件必须完整在上下文中**；其余 references 按当前阶段单独加载，不要一次性读完。

## 执行方式

- 本 Skill 只使用标准 ChatCut 工作流。直接遵循 `chatcut:chatcut-plugin-basics` 和任务对应的 ChatCut Skill，在用户指定或当前活动的项目与时间线上剪辑。
- 不要求用户回复任何模式切换口令，也不要求旧版计划锁、宿主隔离证明、场景授权或外部审核签发。旧版严格门禁材料不属于本工作流，不能用来阻塞写入或导出。
- 每批写入前刷新 `projectId`、`timelineId`、画布和相关轨道；破坏性或大批量操作先 `validateOnly`，再真实提交；提交后重读受影响范围并检查实际合成帧。
- 目标为 4K 时先读取 [local-4k-workflow.md](references/local-4k-workflow.md)。不得用插件重新导入桌面版已有的 4K 主母版；先核验 ChatCut 资产仍为 3840×2160，再开始编辑。
- 始终保留可编辑时间线、忠实执行用户画面规划，不把“工具调用成功”当成视觉完成。只有真实缺素材、用户要求互相矛盾、付费生成需确认或接触表待用户批准时才暂停。

## 来源优先级

**用户画面规划中的每一行** > 用户标记为最终的口播稿/字幕 > 当前选题与剪辑工单 > 校正后带时间码转写 > 原始 ASR > 模型推断。

第 1 级里的版式、PIP、动效、mustShowTerms、点名机制、真实录屏标注各自是独立的 `mustHonor userOverride`，逐条绑定，不可被整体覆盖，也不能因为"整体方案更好"而打包替换。它与任何来源冲突时不做取舍 —— 停下来问用户。

## 执行流程

完整执行 [production-flow.md](references/production-flow.md)。S0–S3 形成精剪时间线；S4 按 [visual-planning.md](references/visual-planning.md) 把用户画面要求整理成当前执行计划，然后立即进入标准 ChatCut 写入。计划用于保持忠实度和协作连续性，不需要锁定、签名或独立门禁。

每个场景记录 `userSpecRef`、`fidelity`、`deviations`、`canvasState`、`baseLayer`；每个信息单元记录 `purpose`。场景编号和帧范围一次性登记在 `剪辑/scene-map.json`（[scene-map.schema.json](assets/scene-map.schema.json)），其他文件引用其中的 ID。执行计划可以是便于当前项目协作的表格或结构化文件，不要求专用锁定格式；校验只负责发现内容和技术问题，不签发 ChatCut 写入许可。

使用标准 ChatCut 工具逐批执行：刷新状态 → 必要时 `validateOnly` → 提交 → 重读结构 → 检查合成帧 → 修正。发现项目被用户手改时，以实时项目为准重新读取并继续，不复用陈旧坐标或 item ID。

配套 Skill 按阶段路由：`chatcut:chatcut-plugin-basics`（始终）、`chatcut:talking-head-guide` + `chatcut:transcription`（口播转写）、`chatcut:asset-import`（非本地 4K 主母版的素材）、`imagegen` 内置 `image_gen`（AI 图）、`chatcut:video-gen`（AI 视频）、`chatcut:voice` / `chatcut:music`（声音）、`browser:control-in-app-browser`（真实页面截图）、`chatcut:create-motion-graphics` / `chatcut:shader-gen`（MG 与转场）、`chatcut:verification`（每个可见阶段）、`computer-use:computer-use`（`local-only` 的 ChatCut Desktop 画面验证）、`chatcut:export`（远程就绪素材的交付）、`chatcut:known-errors`（异常恢复）。

## 验证循环

- 每个可见阶段都按 `chatcut:verification` 检查时间线结构和实际合成帧；抽帧范围见 [stage-audit-standards.md](references/stage-audit-standards.md)。发现问题就修正并重新取证，不等待外部审核者签发 verdict。
- 主素材为 `local-only` 时，云端截图失败是已知能力边界，不是编辑失败。按 [local-4k-workflow.md](references/local-4k-workflow.md) 改用 ChatCut Desktop 预览取证；分别报告结构验证、桌面预览验证和真实 4K 导出验证，三者不得互相冒充。
- 结构、构图、版式、动效语义、字幕、声音和素材真实性都由当前制作流程完成验证。外部复审是用户明确要求时的附加质量检查，不是写入或导出的前置许可。
- S9 完成后生成接触表交用户过目。用户批准后，记录用户原话和时间，再按 `chatcut:export` 做导出前检查并导出。
- 机器可读检查项见 [audit-checklist.json](assets/audit-checklist.json)。

## 视觉与素材（按阶段单独加载，不要一次读完）

- 默认字幕/颜色/版式/PIP/MG：[visual-system.md](references/visual-system.md) + [default-style.json](assets/default-style.json) + [layout-profiles.json](assets/layout-profiles.json)
- 选场景模板与转场（信息结构与运动签名是同一个 `sceneTemplate`）：[semantic-template-system.md](references/semantic-template-system.md) + [semantic-template-system.json](assets/semantic-template-system.json)；多场景编排另读 [visual-orchestration.md](references/visual-orchestration.md)
- 素材呈现、寻源与验证：[asset-strategy.md](references/asset-strategy.md) + [resource-sourcing-and-generation.md](references/resource-sourcing-and-generation.md) + [resource-policy.json](assets/resource-policy.json)；声音读 [sound-standards.md](references/sound-standards.md)
- 仅当用户点名 ShotCraft 镜头卡：[shotcraft-adapter.md](references/shotcraft-adapter.md)；S9 通过后登记可复用机制：[template-evolution.md](references/template-evolution.md)

用户脚本的画面标注是 `mustHonor userOverride`，优先于任何模板；模板评分低于 8/10 时直接做可编辑 bespoke 机制，而不是改写用户描述。ShotCraft 卡只是 `designReferences`。`motion-primitives.json` 提供底层运动词汇，[legacy/](legacy/README.md) 只用于读取存量计划。

## 完成条件

[hard-invariants.md](references/hard-invariants.md) 20 条全部满足；每个场景对得上用户规划的一行且 `deviations` 为空或带用户原话批准；结构复读与当前素材状态允许的真实像素验证完成；接触表已交用户过目并取得批准；素材来源可追溯、无 AI 伪造事实证据；ChatCut 项目保持可编辑并已导出或达到可导出状态。`local-only` 项目必须额外区分“桌面预览通过”和“4K 实际导出通过/待验证”。最终回复用简短表格汇报阶段、验证结果、修正数量和交付结果。
