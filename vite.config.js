import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';//mock数据插件

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) =>{
  const envConfig = loadEnv(mode, './');
  let config= {
    plugins: [
      vue(),
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: true,
        prodEnabled:false,
        supportTs: false,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      }),
    ],
    resolve:{
      alias:{
        '@': path.resolve(__dirname, 'src'),//设置别名
      },
    },
    base: envConfig.VITE_BASE_PATH,
    server: {
      host: '0.0.0.0',
      port: envConfig.VITE_PORT,
      // 是否自动在浏览器打开
      open: true,
      // 是否开启 https
      https: false,
      // 服务端渲染
      ssr: false,
      base: envConfig.VITE_BASE_URL,
      outDir: envConfig.VITE_OUTPUT_DIR,
      define: {
          'process.env': {}
      }
    },
    //ant 自定义样式
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#FA541C',
            'link-color': '#FA541C'
          },
          javascriptEnabled: true,
        }
      },
    },
  }
  return defineConfig(config)
})
