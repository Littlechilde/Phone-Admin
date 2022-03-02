import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';//mock数据插件

// https://vitejs.dev/config/
export default defineConfig({
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
  server: {
    host: '0.0.0.0',
  },
  //ant 自定义样式
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#F5222D',
          'link-color': 'red',
        },
        javascriptEnabled: true,
      }
    },
  },
})
