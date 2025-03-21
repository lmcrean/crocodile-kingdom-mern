import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
   postcss: {
    plugins: [tailwindcss],
   },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    exclude: [
      '**/node_modules/**', 
      '**/tests/*.spec.js', 
      '**/tests-examples/**'
    ]
  }
});
