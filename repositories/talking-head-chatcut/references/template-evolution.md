# 信息模板自主沉淀

## 目标

让每次成片产生的新视觉经验进入可复用目录，同时避免把一次性文案、项目资产 ID 或偶然布局当成模板。场景模板沉淀的是“观众任务 + 信息结构 + 完整运动签名 + 词级同步契约 + 转场端口”，转场模板沉淀的是“语义意图 + 承载对象 + 连续空间变换”，不是一张固定皮肤或一段固定时长动画。

## 何时新建

先读取 `semantic-template-system.md` 并匹配 `assets/semantic-template-system.json`：

- 信息结构与运动签名都与现有条目一致：复用 `sceneTemplate` 并重新实例化。
- 信息结构相同但核心运动逻辑不同，且新动作确实改变理解方式：登记新的 `sceneTemplate`，不要只给旧模板换入场动画。
- 场景内部不变，只出现新的连续交接关系：登记新的 `transitionTemplate`。
- 只需新的底层运动实现方式：评估是否新增 `motion-primitives.json` 原语，再由模板运动签名引用。
- 用户明确要求库外效果：先以 `bespoke-forced` 完成，不要求在制作前先扩库。
- 外部 ShotCraft 卡只提供设计参考：先按 `shotcraft-adapter.md` 完成 ChatCut 转译和像素审核，再判断是否产生了可复用的新模板；卡名本身不是模板身份或成功证明。

然后执行：

1. 比较观众任务、信息结构、运动签名、目标画幅、同步模式、转场端口和可编辑属性。
2. 评分达到 8/10 且不改变画面描述时，使用已有模板并按当前 Design Style 直接编写 ChatCut 内联 JSX。
3. 没有匹配项时，按画面描述设计新的可编辑 MG；不要退回少数通用卡片模板。
4. 仅修改文字、颜色、圆角、背景或品牌样式不构成新模板。
5. 新增模板或转场后运行 `scripts/validate_template_system.py`；ID、原语引用、双画幅、运动覆盖、转场端口或连续性合同失败时不得登记。

## 登记生命周期

- `candidate`：一个真实项目中通过 S7 和 S9，可在下次项目中试用。
- `proven`：在至少两个不同视频或不同内容结构中通过 S7 和 S9，可优先匹配。
- `deprecated`：重复失败、可读性差、同步能力不足或已经被更准确的模板替代，不再自动选用。

每次项目完成后由代理自主更新目录，不等待用户提醒。候选模板第二次通过时增加 `successfulUses` 并自动晋级；失败时记录 `limitations`，必要时降级或停用。

## 目录字段

每个 `sceneTemplate` 至少记录：

- `id`、`name`、`status`、`successfulUses`。
- `identity`：`viewerJob`、`informationStructure`、`silhouette` 和适用语义。
- `motionSignature`：入场、逐信息响应、中段持续方式、退场、允许和禁止的原语。
- `params`、`cueContract`、两套 `aspectVariants`、`processContinuityDefault`。
- `transitionPorts` 和 `qa.requiredEvidence`。

每个 `transitionTemplate` 至少记录语义 `intent`、`fromRoles`、`toRoles`、`carriedElement`、`spatialLogic`、时长范围、连续性断言、双画幅变体和音效提示。旧的语义模式、场景组件和 component catalog 只保留兼容，不再新增平行模板概念。

不得记录 ChatCut 项目专属 asset/item ID、临时 URL、用户隐私内容或本地 JSX 文件。ChatCut MG 仍按 `chatcut:create-motion-graphics` 在目标项目中以内联 JSX 重新实例化；目录负责设计和同步契约，不绕过当前项目风格与画幅检查。由 ShotCraft 适配产生的模板可保留仓库、commit、卡名和设计来源，但不得保留 Remotion 工程、原 demo 假 UI 或第三方音频。

## 复用审核

复用不等于照搬外观。每次使用仍要：

1. 读取锁定画面描述和当前 Design Style。
2. 重新计算精剪后的词级 cue。
3. 为 9:16 与 16:9 分别构图。
4. 重新执行 S7 词级同步审核和 S9 导出帧审核。
5. 只有真实像素证据通过才增加 `successfulUses`。
6. 运行统一模板验证器、模板回归测试和 Skill `quick_validate.py` 后才结束 S10；真实像素审核仍以当前 ChatCut 时间线为准。
