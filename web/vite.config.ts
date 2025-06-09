/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // https://github.com/vitejs/vite/discussions/17738
  optimizeDeps: {
    exclude: ['node_modules/.cache'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
