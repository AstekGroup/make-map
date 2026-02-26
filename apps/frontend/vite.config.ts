import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@make-map/types': path.resolve(__dirname, '../../shared/types/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['maplibre-gl', 'react-map-gl', 'supercluster'],
  },
})
