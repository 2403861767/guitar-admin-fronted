import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
          },
        },
      }
  ,plugins: [vue(), Components({
        resolvers: [VantResolver()],
    }),],
    // 代理配置
    // server: {
    //     https: true,
    //     proxy: {
    //         '/api': { // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
    //             target: 'https://localhost:9999', // 目标地址 --> 服务器地址
    //             changeOrigin: true, // 允许跨域
    //             ws: true,  // 允许websocket代理
    //             // 重写路径 --> 作用与vue配置pathRewrite作用相同
    //             rewrite: (path) => path.replace(/^\/api/, "")
    //         }
    //     },
    // },
})
