# 迁移记录

日期：2026-10-27

范围：23 个公开仓库；21 个文件快照，2 个空仓库说明。源文件总数 8521。未合并历史，也未执行第三方项目程序。

## 公开导入时的调整

| 路径 | 调整 |
|---|---|
| repositories/xhs_create_v3/cookies.txt | 排除浏览器登录 Cookie 文件；原始下载只保留在本地迁移工作目录，不提交。 |
| repositories/fourgo/Application/Admin/View/media/js/form-components.js | 2 处凭据替换为 REDACTED_IMPORT_CREDENTIAL。 |

| repositories/clawdbot/extensions/google-antigravity-auth/index.ts | 移除两项编码保存的 Google OAuth 凭据，改为读取自己的环境变量 GOOGLE_ANTIGRAVITY_CLIENT_ID 和 GOOGLE_ANTIGRAVITY_CLIENT_SECRET。 |

## 检查

使用校验过发布文件 SHA-256 的 Gitleaks 8.30.1 扫描。对已有扫描基线中的哈希、文档占位符、公开客户端标识和测试夹具逐类复核；保留测试用途的固定密钥，未将其当作生产账号凭据。排除已逐类复核的精确匹配项后，再次扫描返回 0 个未处理发现。扫描不能保证发现所有类型的敏感内容。

文件完整性按源压缩包逐文件 SHA-256 检查，除上表调整及新增导航文档外，应保持一致。可执行模式和符号链接按源压缩包元数据写入 Git 索引。

所有原许可证和署名原样保留。本集合没有为原项目重新授予许可。

发布前逐文件核对：8518 个未改动源文件 SHA-256 一致；2 个源文件已脱敏，1 个 Cookie 文件未提交。

第一次上传被 GitHub 凭据保护拦截；已移除上述编码凭据并重建首次提交，没有使用保护绕过链接。
