import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from 'path'
import autoprefixer from 'autoprefixer'
import PostcssFlexbugsFixes from 'postcss-flexbugs-fixes'

function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: ["es2021", "chrome100", "safari13"],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("'use client'")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      $http: path.resolve(__dirname, './src/utils/request.ts'),
    }
  },
  css: {
    postcss: {
      plugins: [
        // 前缀追加
        autoprefixer({
          overrideBrowserslist: [
            'Chrome >= 100',
            'Safari >= 13',
            'iOS >= 13',
            'Firefox >= 91',
            'Edge >= 100',
          ],
          grid: false,
        }),
        PostcssFlexbugsFixes
      ],
    }
  }
});
