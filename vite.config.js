import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/BudgetApp",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://budgetapp-37rv.onrender.com', // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Ensure the output matches your current structure
  },
});
