import { defineConfig } from 'vite'
// Importamos el nuevo plugin de SWC
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import { fileURLToPath } from 'url';
// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({

  plugins: [
    react(),
    tailwindcss(),
  ], resolve: {
    alias: {
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
})