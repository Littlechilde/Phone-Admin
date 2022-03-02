import axios from 'axios';
import { message } from 'ant-design-vue';

// let url = window.location.origin
const service = axios.create({
  baseURL:'http://120.77.237.25:8080/',
  // baseURL:url,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000,
  headers: {'content-type': 'application/json'}
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
    const {data} = response;
    message.success('成功');
    return data
  },
  // 对响应错误做点什么
  // 超出 2xx 范围的状态码都会触发该函数。
  error => {
    const {response} = error;
    const {status,data:{message}} = response;
    return Promise.reject(error)
  }
)
export default service;
