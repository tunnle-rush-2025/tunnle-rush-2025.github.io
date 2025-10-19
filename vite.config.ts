import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const base = process.env.PUBLIC_BASE ?? '/';

export default defineConfig({
  // Keep the app source under the calculator folder to avoid clashing with existing static site files
  root: path.resolve(__dirname, 'calculator'),
  base,
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'calculator', 'dist'),
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: path.resolve(__dirname, 'calculator', 'vitest.setup.ts')
  }
});
