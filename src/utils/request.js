import axios from 'axios';
import { message } from 'ant-design-vue';
import router from '@/router';

export const VITE_BASE_URL = 'http://119.23.247.196:8031';
const service = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000,
  headers: { 'content-type': 'application/json' }
});
// 添加请求拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['X-AUTH-TOKEN'] = token;
    }
    return config
  },
  // 对请求错误做些什么
  error => {
    console.log(error)
    return Promise.reject(error)
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  // 对响应数据做点什么
  // 2xx 范围内的状态码都会触发该函数。
  response => {
    const { data } = response;
    const { code } = data;
    if (code && code !== 200) {
      message.error(data.message)
    }
    return data
  },
  // 对响应错误做点什么
  // 超出 2xx 范围的状态码都会触发该函数。
  error => {
    const { response } = error;
    const { status, data } = response;
    if (status == 500 && data.message == '权限不足') {
      localStorage.clear();
      message.error(data.message);
      setTimeout(() => {
        router.replace('/login');
      }, 1000)
    } else if (status == 500) {
      setTimeout(() => {
        router.push('noServe');
      }, 1000);
    } else if (status == 404) {
      setTimeout(() => {
        router.push('NotFound');
      }, 1000)
    } else if (status == 403) {
      setTimeout(() => {
        router.push('noPower');
      }, 1000)
    }
    return Promise.reject(error)
  }
)
export default service;
