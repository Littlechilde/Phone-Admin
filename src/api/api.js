import request from '@/utils/request';

const systemApi ={
    login:"user/login",
    role:'/getRole',
    area:'/area/getArea'
};
//登录（mock）
export function Login(data) {
  return request({
    url:systemApi.login,
    method: 'Post',
    data
  })
};
// 获取用户角色权限的动态菜单（mock)
export function UserInfo(data) {
  return request({
    url:systemApi.role,
    method: 'post',
    data
  })
};
//获取地区
export function getArea(data) {
  return request({
    url:systemApi.area,
    method: 'get',
    params: data
  })
};
