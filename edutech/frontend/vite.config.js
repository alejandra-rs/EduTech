import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['edutech-app.tail6b7334.ts.net'],
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://host.docker.internal:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'http://host.docker.internal:8000',
        ws: true,
      },
    },
  },
})
