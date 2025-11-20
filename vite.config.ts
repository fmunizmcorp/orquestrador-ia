import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  root: './client',
  plugins: [
    react(),
    visualizer({
      filename: '../bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@server': path.resolve(__dirname, './server'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    // SPRINT 28: Bundle Optimization
    // SPRINT 54: TEMPORARILY disabled console removal for debugging Sprint 53 logs
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // SPRINT 54: Keep console.log for debugging
        drop_debugger: true,
        pure_funcs: [], // SPRINT 54: Allow all console methods
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'trpc-vendor': ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'],
        },
      },
    },
  },
});
