// vite.config.ts
import { defineConfig } from "file:///E:/object-cloud-drive/node_modules/.pnpm/vite@3.2.10_@types+node@18.19.31_less@4.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///E:/object-cloud-drive/node_modules/.pnpm/@vitejs+plugin-react@2.2.0_vite@3.2.10/node_modules/@vitejs/plugin-react/dist/index.mjs";
import * as path from "path";
import autoprefixer from "file:///E:/object-cloud-drive/node_modules/.pnpm/autoprefixer@10.4.19_postcss@8.4.38/node_modules/autoprefixer/lib/autoprefixer.js";
import PostcssFlexbugsFixes from "file:///E:/object-cloud-drive/node_modules/.pnpm/postcss-flexbugs-fixes@5.0.2_postcss@8.4.38/node_modules/postcss-flexbugs-fixes/index.js";
var __vite_injected_original_dirname = "E:\\object-cloud-drive";
function _resolve(dir) {
  return path.resolve(__vite_injected_original_dirname, dir);
}
var vite_config_default = defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: ["es2021", "chrome100", "safari13"],
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG
  },
  resolve: {
    alias: {
      "@": _resolve("src")
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8",
            "> 1%"
          ],
          grid: true
        }),
        PostcssFlexbugsFixes
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxvYmplY3QtY2xvdWQtZHJpdmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXG9iamVjdC1jbG91ZC1kcml2ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovb2JqZWN0LWNsb3VkLWRyaXZlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xyXG5pbXBvcnQgUG9zdGNzc0ZsZXhidWdzRml4ZXMgZnJvbSAncG9zdGNzcy1mbGV4YnVncy1maXhlcydcclxuXHJcbmZ1bmN0aW9uIF9yZXNvbHZlKGRpcjogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRpcilcclxufVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcblxyXG4gIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXHJcbiAgLy8gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXHJcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxyXG4gIC8vIHRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAxNDIwLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICB9LFxyXG4gIC8vIHRvIG1ha2UgdXNlIG9mIGBUQVVSSV9ERUJVR2AgYW5kIG90aGVyIGVudiB2YXJpYWJsZXNcclxuICAvLyBodHRwczovL3RhdXJpLnN0dWRpby92MS9hcGkvY29uZmlnI2J1aWxkY29uZmlnLmJlZm9yZWRldmNvbW1hbmRcclxuICBlbnZQcmVmaXg6IFtcIlZJVEVfXCIsIFwiVEFVUklfXCJdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBUYXVyaSBzdXBwb3J0cyBlczIwMjFcclxuICAgIHRhcmdldDogW1wiZXMyMDIxXCIsIFwiY2hyb21lMTAwXCIsIFwic2FmYXJpMTNcIl0sXHJcbiAgICAvLyBkb24ndCBtaW5pZnkgZm9yIGRlYnVnIGJ1aWxkc1xyXG4gICAgbWluaWZ5OiAhcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcgPyBcImVzYnVpbGRcIiA6IGZhbHNlLFxyXG4gICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcclxuICAgIHNvdXJjZW1hcDogISFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogX3Jlc29sdmUoJ3NyYycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIFx1NTI0RFx1N0YwMFx1OEZGRFx1NTJBMFxyXG4gICAgICAgIGF1dG9wcmVmaXhlcih7XHJcbiAgICAgICAgICBvdmVycmlkZUJyb3dzZXJzbGlzdDogW1xyXG4gICAgICAgICAgICAnQW5kcm9pZCA0LjEnLFxyXG4gICAgICAgICAgICAnaU9TIDcuMScsXHJcbiAgICAgICAgICAgICdDaHJvbWUgPiAzMScsXHJcbiAgICAgICAgICAgICdmZiA+IDMxJyxcclxuICAgICAgICAgICAgJ2llID49IDgnLFxyXG4gICAgICAgICAgICAnPiAxJScsXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgZ3JpZDogdHJ1ZSxcclxuICAgICAgICB9KSxcclxuICAgICAgICBQb3N0Y3NzRmxleGJ1Z3NGaXhlc1xyXG4gICAgICBdLFxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVAsU0FBUyxvQkFBb0I7QUFDbFIsT0FBTyxXQUFXO0FBQ2xCLFlBQVksVUFBVTtBQUN0QixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLDBCQUEwQjtBQUpqQyxJQUFNLG1DQUFtQztBQU16QyxTQUFTLFNBQVMsS0FBYTtBQUM3QixTQUFZLGFBQVEsa0NBQVcsR0FBRztBQUNwQztBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUlqQixhQUFhO0FBQUEsRUFFYixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBR0EsV0FBVyxDQUFDLFNBQVMsUUFBUTtBQUFBLEVBQzdCLE9BQU87QUFBQSxJQUVMLFFBQVEsQ0FBQyxVQUFVLGFBQWEsVUFBVTtBQUFBLElBRTFDLFFBQVEsQ0FBQyxRQUFRLElBQUksY0FBYyxZQUFZO0FBQUEsSUFFL0MsV0FBVyxDQUFDLENBQUMsUUFBUSxJQUFJO0FBQUEsRUFDM0I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssU0FBUyxLQUFLO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFFUCxhQUFhO0FBQUEsVUFDWCxzQkFBc0I7QUFBQSxZQUNwQjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0EsTUFBTTtBQUFBLFFBQ1IsQ0FBQztBQUFBLFFBQ0Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
