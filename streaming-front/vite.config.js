import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		port: 5173,
		strictPort: true,
		host: true,
		cors: true,
		hmr: {
		protocol: 'ws',
		host: 'localhost',
		port: 5173
		}
	},
	build: {
		outDir: '../streaming-server/build/prod',
		emptyOutDir: true,
		sourcemap: false
	}
})

// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// const mode = process.env.NODE_ENV
// const dev = mode === 'development' || mode === 'local'

// // https://vite.dev/config/
// export default defineConfig({
// 	plugins: [
// 		vue(),
// 		vueDevTools(),
// 	],
// 	resolve: {
// 		alias: {
// 			'@': fileURLToPath(new URL('./src', import.meta.url))
// 		},
// 	},
// 	css: {
// 		minify: mode === 'production'
// 	},
// 	head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
// 	build: {
// 		target: 'esnext',
// 		minify: dev ? false : 'esbuild',
// 		rollupOptions: {
// 			input: {
// 				main: './index.html'
// 			},
// 			output: {
// 				dir:
// 					'../streaming-server/build/' +
// 					(dev ? 'dev' : 'prod'),
// 				entryFileNames: `js/[name]${dev ? '' : '-[hash]'}.js`,
// 				assetFileNames: `css/[name]${dev ? '' : '-[hash]'}[extname]`,
// 				chunkFileNames: `js/[name]${dev ? '' : '-[hash]'}.js`,
// 			}
// 		},
// 		chunkSizeWarningLimit: 1000,
// 		sourcemap: dev,
// 		reportCompressedSize: false
// 	},
// 	define: {
// 		__VUE_OPTIONS_API__: true,
// 		__VUE_PROD_DEVTOOLS__: false
// 	}
// })
