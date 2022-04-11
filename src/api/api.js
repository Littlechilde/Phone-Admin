import request from '@/utils/request';//模块都有独立的顶级作用域下面的模块不能互相访问（类似两个函数作用域）

export const systemApi ={
    login:"/int-admin/sys/login",
    getPic:'int-admin/captchaSwagger.jpg',
    area:'/area/getArea',

    role:'/getRole',
    callType:'/callType',
    userType:'/userType',
    roleType:'/roleType',
    areaType:'/areaType',
    userList:'/userList',
    payList:'/payList',
    getDetail:'/getDetail',
};
//登录
export function Login(data) {
  return request({
    url:systemApi.login,
    method: 'POST',
    params:data
  })
};
//获取code验证码
export function getCode(data) {
  return request({
    url:systemApi.getPic,
    method: 'get',
    params: data
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
/*@mock*/
// 获取用户角色权限的动态菜单（mock)
export function UserInfo(data) {
  return request({
    url:systemApi.role,
    method: 'post',
    data
  })
};
//获取类型
export function getCallType(data) {
  return request({
    url:systemApi.callType,
    method: 'get',
    params: data
  })
};

export function getUserType(data) {
  return request({
    url:systemApi.userType,
    method: 'get',
    params: data
  })
};
export function getRoleType(data) {
  return request({
    url:systemApi.roleType,
    method: 'get',
    params: data
  })
};
export function getAreaType(data) {
  return request({
    url:systemApi.areaType,
    method: 'get',
    params: data
  })
};
export function getUserList(data) {
  return request({
    url:systemApi.userList,
    method: 'get',
    params: data
  })
};
export function getPayType(data) {
  return request({
    url:systemApi.payList,
    method: 'get',
    params: data
  })
};
export function getDefault(data) {
  return request({
    url:systemApi.getDetail,
    method: 'get',
    params: data
  })
}
