import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Air-fryer-bakery/', // This exact string is required to prevent 404s on assets
})