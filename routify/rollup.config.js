import svelte from 'rollup-plugin-svelte-hot';
import Hmr from 'rollup-plugin-hot'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { copySync, removeSync } from 'fs-extra'
import { spassr } from 'spassr'
import getConfig from '@roxi/routify/lib/utils/config'
import autoPreprocess from 'svelte-preprocess'
import { injectManifest } from 'rollup-plugin-workbox'
import image from "svelte-image";

const { distDir } = getConfig() // use Routify's distDir for SSOT
const assetsDir = 'assets'
const buildDir = `${distDir}/build`
const isNollup = !!process.env.NOLLUP
const production = !process.env.ROLLUP_WATCH;
process.env.NODE_ENV = production ? "production" : "development";

// clear previous builds
removeSync(distDir)
removeSync(buildDir)

const serve = () => ({
    writeBundle: async () => {
        const options = {
            assetsDir: [assetsDir, distDir],
            entrypoint: `${assetsDir}/__app.html`,
            script: `${buildDir}/main.js`
        }
        spassr({ ...options, port: 5000 })
        spassr({ ...options, ssr: true, port: 5005, ssrOptions: { inlineDynamicImports: true, dev: true } })
    }
})
const copyToDist = () => ({ writeBundle() { copySync(assetsDir, distDir) } })

export default {
    preserveEntrySignatures: false,
    input: ['src/main.ts'],
    output: {
        sourcemap: true,
        format: 'esm',
        dir: buildDir,
        // for performance, disabling filename hashing in development
        chunkFileNames: `[name]${production && '-[hash]' || ''}.js`
    },
    plugins: [
        commonjs(),
        replace({
            preventAssignment: true,
            'process.browser': true,
        }),
        svelte({
            dev: !production, // run-time checks      
            // Extract component CSS — better performance
            css: css => css.write(`bundle.css`),
            hot: isNollup,
            preprocess: [
                autoPreprocess({
                    postcss: require('./postcss.config.js'),
                    defaults: { style: 'postcss' },
                    ...image(),
                })
            ]
        }),
        // resolve matching modules from current working directory
        resolve({
            browser: true,
            dedupe: importee => !!importee.match(/svelte(\/|$)/)
        }),
        typescript({
            sourceMap: true,
            inlineSources: !production
        }),
        production && terser(),
        !production && !isNollup && serve(),
        !production && !isNollup && livereload(distDir), // refresh entire window when code is updated
        !production && isNollup && Hmr({ inMemory: true, public: assetsDir, }), // refresh only updated code
        {
            // provide node environment on the client
            transform: code => ({
                code: code.replace(/process\.env\.NODE_ENV/g, `"${process.env.NODE_ENV}"`),
                map: { mappings: '' }
            })
        },
        injectManifest({
            globDirectory: assetsDir,
            globPatterns: ['**/*.{js,css,svg}', '__app.html'],
            swSrc: `src/sw.js`,
            swDest: `${distDir}/serviceworker.js`,
            maximumFileSizeToCacheInBytes: 10000000, // 10 MB,
            mode: 'production'
        }),
        production && copyToDist(),
    ],
    watch: {
        clearScreen: false,
        buildDelay: 100,
    }
}
