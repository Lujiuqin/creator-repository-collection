import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能优化配置
  reactStrictMode: true,
  // 在生产构建时忽略 ESLint 错误，避免因代码风格问题阻塞部署
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/zh-CN',
      },
    ]
  },
  
  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
    // 允许的远程图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mmbiz.qpic.cn', // 微信公众号图片域名
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.qpic.cn', // 微信相关图片域名的通配符
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // 实验性功能，提升性能
  experimental: {
    // 优化CSS
    optimizeCss: true,
    // 优化包导入 - 简化路径
    optimizePackageImports: ['@/components'],
  },
  
  // 禁用遥测和追踪
  productionBrowserSourceMaps: false,
};

export default nextConfig;
