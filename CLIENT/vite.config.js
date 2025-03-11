// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['date-fns'], // Ensure date-fns is pre-bundled
  },
  resolve: {
    alias: {
      // Optionally, map specific internal paths if needed
      'date-fns/_lib/format/longFormatters': 'date-fns/esm/_lib/format/longFormatters',
    },
  },
});