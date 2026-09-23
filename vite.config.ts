import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths let the same build work on GitHub Pages
// (https://<user>.github.io/<repo>/) and on any other static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
});
