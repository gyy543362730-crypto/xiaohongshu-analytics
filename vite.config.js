import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/xiaohongshu-analytics/',plugins:[react()],test:{include:['tests/**/*.test.js']}});
