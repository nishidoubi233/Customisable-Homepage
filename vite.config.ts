import { defineConfig } from 'vite';

// Vite configuration for Customisable Homepage
// Vite 自定义主页配置
export default defineConfig({
    // 根目录设置
    // Root directory setting
    root: '.',

    // 构建选项
    // Build options
    build: {
        outDir: 'dist',
        sourcemap: true,
    },

    // 开发服务器配置
    // Dev server configuration
    server: {
        port: 5173,
        open: true,
    },
});
