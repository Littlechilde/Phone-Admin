import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './permission';
import '@/serve/mock';// 需要引入，否则会报404错误
import myDirective from'@/utils/directive/directive'//自定义指令（元素级权限）

const app = createApp(App);
myDirective(app);
app.use(store);
app.use(router);
app.use(Antd);
app.mount('#app');
