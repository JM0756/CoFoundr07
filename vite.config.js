import { defineConfig } from 'vite'

const basePath = process.env.VITE_PUBLIC_BASE_PATH || '/'

export default defineConfig(({ command }) => ({
  base: basePath,
  server: {
    proxy: command === 'serve' ? {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    } : undefined,
  },
}))
