import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import viteCompression from 'vite-plugin-compression'


export default defineConfig({
  plugins: [
    react({
      // Optimize React fast refresh
      fastRefresh: true,
      // Exclude node_modules from transformation
      jsxTransform: true,
    }), 
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
      // Disable for small files to save build time
      disable: false,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
      disable: false,
    })
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Tree-shake unused exports
    dedupe: ['react', 'react-dom']
  },
  
  server: {
    allowedHosts: [
      "31df23daf2d1.ngrok-free.app"
    ],
  },
  
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 500, // Reduced from 1000 to catch large chunks early
    reportCompressedSize: false, // Disable reporting for faster builds
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries - these are used everywhere
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Auth components together - lazy load these
          'auth': [
            './src/components/AuthForms/login.jsx',
            './src/components/AuthForms/Signup.jsx',
            './src/components/AuthForms/protected.jsx'
          ],
          
          // UI components - shared across all routes
          'ui': [
            './src/components/ui/Sidebar.jsx',
            './src/components/ui/ErrorBoundary.jsx'
          ],
          
          // Separate heavy utilities if they exist
          // Uncomment if you have large utility files
          // 'utils': ['./src/utils/']
        },
        
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        // Optimize chunk size distribution
        inlineDynamicImports: false, // Keep dynamic imports separate
      }
    },
    
    cssCodeSplit: true, // Keep CSS code split for faster loading
    sourcemap: false, // Already good - don't generate source maps in production
    minify: 'esbuild', // Fastest and most efficient minifier
    terserOptions: undefined, // Not needed with esbuild
    
    // Optimize module pre-bundling
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    
    // Reduce unnecessary polyfills
    polyfillDynamicImport: false,
    
    // Enable incremental build for faster rebuilds
    watch: process.env.WATCH ? {
      exclude: ['node_modules/**', 'dist/**']
    } : null
  },
  
  optimizeDeps: {
    // Pre-bundle these dependencies for faster app loading
    include: [
      'react',
      'react-dom',
      'react-router-dom'
      // Add other frequently used dependencies here
      // Examples: 'axios', 'lodash-es', etc.
    ],
    exclude: [
      // Exclude dependencies that are conditionally loaded
      // Examples: 'heavy-chart-library', 'code-editor'
    ],
    // Force re-optimize even if already cached
    force: false,
  },
  
  // Development-specific optimizations
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
})