# 从这个仓库开始使用

这个仓库里的项目分为技能、资料库、网站程序，使用方式不同。最省事的第一步是账号定位与内容技能，不必先运行网站。

## 第一步：安装五个内容相关技能

将下面整段发给 Codex：

```text
请使用 skill-installer，从我的仓库安装以下五个技能：
https://github.com/Lujiuqin/creator-repository-collection

路径：
repositories/account-positioning-interview
repositories/ai-content-workflow-skills/skills/viral-pattern-analysis
repositories/ai-content-workflow-skills/skills/topic-generation-workflow
repositories/ai-content-workflow-skills/skills/content-production-workflow
repositories/ai-content-workflow-skills/skills/writing-preference-learning

先检查同名技能是否已存在，保留我已有的自定义内容。
安装后检查文件完整性，并告诉我是否需要新开对话。
```

仓库内容搬迁不等于已经安装；上面指令是后续使用入口。

## 第二步：建立自己的账号资料

准备一个自己的本地内容文件夹，在这个文件夹中让 Codex 工作，然后说：

```text
使用 account-positioning-interview，读取我这个内容工作区已有的资料，帮我梳理自己的经历、业务、目标用户和内容方向。缺什么就一次问我一个问题。
```

没有产品、没有用户证据都可以如实记录，不必先准备一套完美答案。

## 第三步：先完成一篇稿件

已经有题目时直接说：

```text
使用 content-production-workflow。我想做一条口播，选题是【填入选题】。请先整理素材，再通过提问补足我的真实观点和经历，最后根据我的确认生成初稿。
```

还没有题目时，准备一批可完整读取的参考素材，再调用 topic-generation-workflow；想先归纳素材的标题、开头和结构，则调用 viral-pattern-analysis。这两个技能本身不负责联网采集。

## 第四步：保存自己的表达习惯

保留 AI 初稿，另改用户编辑稿。修改后说：

```text
使用 writing-preference-learning，对比这篇 AI 初稿和我的编辑稿，整理候选写作偏好。把事实纠正、单篇特殊要求和长期表达习惯区分开。
```

确认候选偏好后，后续稿件才按适用范围使用这些规则。

## 其他项目的入口

- AI-Content-System：下载后可用 Obsidian 打开，先区分作者资料和自己的资料。
- Ai-news：阅读其 README。可先运行演示模式，真实数据需要接入自己的服务。
- talking-head-chatcut：先确认当前 AI 工具有 ChatCut 及对应能力；不是剪映插件。
- Ai-auto-content：本机调度按 Mac 设计，Windows 需要适配；当前文档仍将写作、配图、发布列为未开始。
- xhs_create_v3、xhs_create_two、artive_help：网站开发项目，需要分别配置环境和服务。

不要在仓库根目录执行所有项目的安装脚本。先选一个目标项目，根据它自己的说明操作。
