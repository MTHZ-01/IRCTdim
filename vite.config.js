import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-redux',
      '@mui/material',
      '@mui/material/Select',
      '@mui/material/Box',
      '@mui/material/Button',
      '@mui/icons-material',
      'xlsx-js-style',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  server: {
    port: 3000,
    host: 'localhost',
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
  },

  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
})