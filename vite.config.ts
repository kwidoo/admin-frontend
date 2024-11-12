import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const clientPort: number = Number(process.env.VITE_PORT) || 3000;
const host: string = process.env.VITE_HOST;
const buildName: string = process.env.VITE_BUILD_NAME || 'default';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: clientPort,
        cors: {
            origin: '*',
        },
        hmr: {
            host,
            protocol: 'ws',
            clientPort,
            port: clientPort,
        },
        watch: {
            usePolling: true,
        },
    },
    mode: 'development',
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/${buildName}.[name].js`,
                chunkFileNames: `assets/${buildName}.[name].[hash].js`,
                assetFileNames: `assets/${buildName}.[ext]/[name].[hash].[ext]`,
            },
        },
        minify: 'esbuild',
    },
    plugins: [
        vue(),
        eslintPlugin({
            cache: false,
            include: ['./src/**/*.vue', './src/**/*.ts'],
        }),

    ],
    resolve: {
        alias: {
            _components: path.resolve(__dirname, './src/components'),
            _composables: path.resolve(__dirname, './src/composables'),
            _plugins: path.resolve(__dirname, './src/_plugins'),
            _store: path.resolve(__dirname, './src/_store'),
            _pages: path.resolve(__dirname, './src/pages'),
            '@': path.resolve(__dirname, './src'),
        },
    },
});
