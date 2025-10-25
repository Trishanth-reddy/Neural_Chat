import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    })
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  server: {
    allowedHosts: [
      "31df23daf2d1.ngrok-free.app"
    ],
  },
  
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Auth components together
          'auth': [
            './src/components/AuthForms/login.jsx',
            './src/components/AuthForms/Signup.jsx',
            './src/components/AuthForms/protected.jsx'
          ],
          
          // UI components
          'ui': [
            './src/components/ui/Sidebar.jsx',
            './src/components/ui/ErrorBoundary.jsx'
          ],
          
          // Route-based splitting happens automatically with lazy()
        },
        
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  }
})
