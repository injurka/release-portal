import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { compression as Compression } from 'vite-plugin-compression2'
import { autoImportOptionsCfg } from './cfg/auto-import'
import { iconsCfg } from './cfg/icons'
import { visualizerPlugin } from './lib/helpers'

const appVersion = process.env.VITE_APP_VERSION || '1.0.0'

export default defineConfig({
  experimental: {
    bundledDev: true,
  },

  base: '/',
  root: resolve(__dirname, '../'),
  publicDir: resolve(__dirname, '../public'),
  envDir: resolve(__dirname, '../'),
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },

  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },

  plugins: [
    Vue(),
    AutoImport(autoImportOptionsCfg),
    Compression({
      algorithms: ['gzip'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    Icons(iconsCfg),
    ...visualizerPlugin('renderer'),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '~/assets/scss/_setup.scss' as *;`,
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4446',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    cssCodeSplit: true,
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. Ядро Vue (всегда нужно сразу)
            if (/[\\/]node_modules[\\/](?:vue|vue-router|pinia|@vueuse)[\\/]/.test(id)) {
              return 'vendor-core'
            }

            // Все остальное
            return 'vendor-others'
          }
        },
      },
    },
  },
})
