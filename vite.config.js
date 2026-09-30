import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pilgrims-predestined-path/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
  },
});
