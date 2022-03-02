import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './permission';
import '@/serve/mock';// 需要引入，否则会报404错误

createApp(App).use(store).use(router).use(Antd).mount('#app');
