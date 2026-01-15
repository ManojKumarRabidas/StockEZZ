// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     modulePreload: true,
//     target: 'esnext'
//   },
//   optimizeDeps: {
//     include: ['date-fns'], // Ensure date-fns is pre-bundled
//   },
//   resolve: {
//     alias: {
//       // Optionally, map specific internal paths if needed
//       'date-fns/_lib/format/longFormatters': 'date-fns/esm/_lib/format/longFormatters',
//     },
//   },
// });

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/server": {
          target: env.VITE_API_BASE_URL || "http://localhost:5001",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      modulePreload: true,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            dateFns: ['date-fns'],  // Separate chunk for date-fns
            // Add other large libraries here if needed
          },
        },
      },
    },
    optimizeDeps: {
      include: ['date-fns'],
    },
    resolve: {
      alias: {
        'date-fns/_lib/format/longFormatters': 'date-fns/esm/_lib/format/longFormatters',
      },
    },
  }
});