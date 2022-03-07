import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import VueTypeImports from 'vite-plugin-vue-type-imports'

import peerDepsExternal from "rollup-plugin-peer-deps-external";

// https://vitejs.dev/config/
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [
    peerDepsExternal(), 
    vue(),
    VueTypeImports()
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'beta-shared-components',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
})