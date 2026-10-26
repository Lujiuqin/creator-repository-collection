# Lujiuqin 的公开仓库导航

整理日期：2026-10-27。按实际用途查看项目；仓库名和链接保持稳定，中文名称用于辨认。这里仅列公开项目，个人资料应另行私有保存。

## 从你要做的事开始

| 现在要做什么 | 打开哪个仓库 | 它负责什么 |
|---|---|---|
| 展示自己的经历与作品 | [个人作品主页](https://github.com/Lujiuqin/personal-homepage) | 静态个人网站，支持中英文切换 |
| 想清楚自己的账号方向 | [账号定位访谈](https://github.com/Lujiuqin/account-positioning-interview) | 用访谈整理经历、业务、受众和内容方向 |
| 拆一条视频或一个对标账号 | [对标内容拆解](https://github.com/Lujiuqin/benchmark-breakdown-skill) | 取数、转写、画面证据与内容结构分析 |
| 根据素材找选题、口述成稿、积累写作偏好 | [内容生产四件套](https://github.com/Lujiuqin/ai-content-workflow-skills) | 规律、选题、正文、偏好四个独立技能 |
| 参考内容资料怎么放 | [内容资料库示例](https://github.com/Lujiuqin/AI-Content-System) | 作者的 Obsidian 资料结构与示例 |
| 在 Windows 连接自己的记忆库 | [私有记忆系统安装器](https://github.com/Lujiuqin/compound-memory-installer/blob/main/README.zh-CN.md) | 安装工具与中文操作说明 |
| 了解网页形式的资讯工作台 | [信号台](https://github.com/Lujiuqin/Ai-news) | 演示与需要自行配置的数据接入应用 |
| 找某个原版项目或迁移记录 | [独立仓库入口](INDEPENDENT_REPOSITORIES.md)、[原始快照目录](repositories/) | 原版 README、来源版本与备份 |

## 一、重点维护的项目

| 仓库名 | 中文名称与判断 | 已做的整理 | 下一步值得做什么 |
|---|---|---|---|
| [personal-homepage](https://github.com/Lujiuqin/personal-homepage) | 个人作品主页；与你的对外展示直接相关，值得持续维护 | 补齐中文 README、文件说明和本地预览方法 | 由本人确认经历、作品和成果是否仍然准确；若要上线，再单独配置部署 |
| [benchmark-breakdown-skill](https://github.com/Lujiuqin/benchmark-breakdown-skill) | 对标内容拆解；有独立维护和上游改编说明，不应当作纯原创或普通下载工具 | 保留已有中文安装文档，补充统一分类入口 | 用一个真实素材跑通依赖检查、转写和画面证据流程，再按实际失败修复 |
| [compound-memory-installer](https://github.com/Lujiuqin/compound-memory-installer) | 私有记忆系统安装器；负责工具安装，不是笔记本体 | 新增中文说明，保留英文 README 和 v0.1.1 安装入口 | 换电脑或环境异常时再运行安装/健康检查；本次没有重新安装或同步笔记 |

## 二、内容工作流

| 仓库名 | 输入与产出 | 保留理由 | 使用入口与边界 |
|---|---|---|---|
| [account-positioning-interview](https://github.com/Lujiuqin/account-positioning-interview) | 你的真实经历和业务 → 五份背景资料 | 为后续 AI 创作提供统一事实入口 | 阅读原版 README；安装为技能后在自己的工作目录访谈 |
| [ai-content-workflow-skills](https://github.com/Lujiuqin/ai-content-workflow-skills) | 完整素材、选题、口述或改稿 → 规律、选题、正文与偏好文件 | 承接定位后的日常创作 | 四个技能可以单独使用；它们本身不负责联网采集和自动发布 |
| [AI-Content-System](https://github.com/Lujiuqin/AI-Content-System) | 原作者已有定位、素材、规律和选题示例 | 适合参考文件结构 | 原作者没有首页 README；可读 [AGENTS.md](https://github.com/Lujiuqin/AI-Content-System/blob/main/AGENTS.md)。原示例不代表自己的经历 |

建议从“定位 → 一个选题 → 一篇口述共创稿 → 自己改稿 → 保存偏好”开始。对标拆解提供参考证据，内容生产技能使用已经准备好的资料；不需要每次把所有工具都跑一遍。

## 三、待配置的应用与实验

| 仓库名 | 实际情况 | 为什么保留 | 当前优先级 |
|---|---|---|---|
| [Ai-news](https://github.com/Lujiuqin/Ai-news) | 信号台网页应用；README 提供演示模式，真实数据需要外部配置，验收文档列有未验证项 | 有明确的资讯、学习和选题界面思路 | 中。先体验 Demo，再决定是否投入真实数据接入 |
| [Ai-auto-content](https://github.com/Lujiuqin/Ai-auto-content) | 每日采集、选题与研究实验；上游仍将写作、配图、发布列为未开始，本机调度按 Mac 设计 | 可参考自动化组织方式 | 中低。Windows 适配与完整生产流程尚不能视为已完成 |

项目名称里的“自动”不等于所有环节已经自动完成。上游文档写的历史验证，也不等于在当前电脑上已验证。

## 四、参考项目

| 仓库名 | 判断依据 | 使用建议 |
|---|---|---|
| [artive_help](https://github.com/Lujiuqin/artive_help) | 2025 年的内容工作台代码，主 README 为框架英文模板；有公众号、素材和改写相关页面与说明 | 保留作功能参考。中文功能入口：[公众号功能说明](https://github.com/Lujiuqin/artive_help/blob/master/WECHAT_CONTENT_FEATURE.md)。不凭页面文件名认定功能已经跑通 |
| [video_spider](https://github.com/Lujiuqin/video_spider) | PHP/Composer 视频解析项目，当前 main 与直接上游 main 一致 | 有明确采集需求时再启用；平台 Cookie 和接口可用性需要现场验证 |
| [clash-verge-rev](https://github.com/Lujiuqin/clash-verge-rev) | 作者保留的网络客户端分支，与你的内容创作流程没有直接依赖 | 保留为低频源码参考。与直接来源一致，并不代表它等同于整个上游项目的最新发行版 |

“参考”不等于没用，而是目前不作为日常创作入口；也不因为时间较早就删掉真实代码。

## 五、归档保留

| 仓库名 | 核查到的内容 | 处理理由 |
|---|---|---|
| [ajax](https://github.com/Lujiuqin/ajax) | 只有约 21 字节的 README，没有实现代码 | 无可运行功能，归档减少日常干扰 |
| [bookish-octo-doodle](https://github.com/Lujiuqin/bookish-octo-doodle) | 原项目为空；当前只有迁移时添加的两份来源说明 | 没有应用内容，归档保留来源 |

归档保留所有文件和历史，仓库仍可查看；以后有实际用途可以取消归档。本轮没有删除仓库。

## 六、导航与快照

[creator-repository-collection](https://github.com/Lujiuqin/creator-repository-collection) 保留为本账号的公开项目导航和来源快照库。`repositories/` 下的 23 份快照用于备份、阅读和追溯；日常使用优先进入上方各自独立的仓库。

独立迁移尚有 14 项受 GitHub 创建限流影响未完成，见 [迁移入口与待办](INDEPENDENT_REPOSITORIES.md)。这些快照不是已经独立部署的应用，也不自动同步作者后续更新。

## 文件与命名约定

- GitHub 仓库名与已有链接先保持稳定；中文简介和本文的中文名称帮助辨认用途。
- Fork 的原版 README、目录、使用方法和署名保持原样；右侧简介与标签用于自己的分类。
- 自己维护的项目补齐 README；网页代码、安装工具、素材资料库分别保留，不强行合并。
- 新增文档优先放 `docs/`；源项目已使用 `references/` 等路径时沿用，不为整齐改坏引用。
- 定位、素材、稿件等个人工作数据放在自己的本地工作区或私有库，不混进公开工具源码。

## 如何看更新

本轮检查了现有 9 个 Fork 的默认分支与各自直接来源，均未发现需要同步的差异；因此没有盲目合并或升级依赖。个人主页补了缺失说明，安装器补了中文说明。功能升级应围绕一个实际任务，并先在对应项目中验证。

本轮整理没有启动自动工作流、调用付费服务、部署应用或批量运行安装程序。上述可用性判断来自仓库文件、版本与说明检查，不冒充运行验收。
