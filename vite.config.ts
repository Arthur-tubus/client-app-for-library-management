import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 9000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
