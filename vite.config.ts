import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
import dts from 'vite-plugin-dts'
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        /*
        Uncomment the following line to enable solid-devtools.
        For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
        */
        // devtools(),
        solidPlugin(),
        dts({ include: ['lib'] }),
    ],
    server: {
        port: 3002,
    },
    build: {
        target: 'esnext',
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            formats: ['es']
        },
        copyPublicDir: false,
        rollupOptions: {
            external: ['solid-js', 'solid-js/store', 'solid-js/universal', 'solid-js/web', 'solid-js/jsx-runtime']
        },
        cssCodeSplit: true
    },
    resolve: {
        alias: [
            {
                find: "@src",
                replacement: resolve(__dirname, './src')
            },
            {
                find: "@lib",
                replacement: resolve(__dirname, "./lib")
            }
        ]
    }
});
