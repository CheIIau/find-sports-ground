import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  },
  esbuild: {
    legalComments: 'none'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ymaps: ['ymaps'],
          '@emotion/react': ['@emotion/react'],
          '@emotion/styled': ['@emotion/styled'],
          '@mui/icons-material': ['@mui/icons-material'],
          '@reduxjs/toolkit': ['@reduxjs/toolkit']
        }
      }
    }
  }
})
