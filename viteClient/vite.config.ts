import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.vue', '.json', '.js', 'ts'],
    alias: {
      
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
      '$http': path.resolve(__dirname, './src/utils/axios.ts'),
      '$tipMessge': path.resolve(__dirname, './src/components/tipMessge.ts'),
    }
  },
})
