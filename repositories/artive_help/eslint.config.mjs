import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 官方推荐配置（含 TypeScript 支持）
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 通用规则细化
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      // 在前后端代码中保留调试日志能力（生产构建请配合日志级别控制）
      "no-console": "off",
    },
  },

  // API 路由（SSE/流式处理等）可能需要使用 eval/console 等能力
  {
    files: ["src/app/api/**/*.{ts,tsx}"],
    rules: {
      "no-eval": "off",
      "no-console": "off",
    },
  },
];

export default eslintConfig;
