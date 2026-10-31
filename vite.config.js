import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 로 두면 어떤 하위 경로(GitHub Pages 등)에 올려도 그대로 동작합니다.
export default defineConfig({
  base: './',
  plugins: [react()],
})
