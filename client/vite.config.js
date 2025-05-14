import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 Ajout de l'alias
      '@services': '/src/services',

    },
  },
})
