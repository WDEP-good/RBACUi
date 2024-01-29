import { ConfigEnv, UserConfigExport, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'url'
import path from 'path'

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 定义环境地址，mode在根目录下
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    server: {
      // 开启代理
      proxy: {
        // 环境：'/dev-api'
        [env.VITE_APP_BASE_API]: {
          // 代理目标'http://localhost:3000'
          target: env.VITE_APP_SERVICE_URL,
          changeOrigin: true,//允许跨域
          // 重写url
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
      },
    },
  }
}
