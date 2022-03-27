import request from '@/utils/request';

const roleApi={
  getRole:'/int-admin/sys/role/list',
  saveRole:"/int-admin/sys/role/save",
  roleEdit:"/int-admin/sys/role/update",
  roleSelect:"/int-admin/sys/role/select",
  roleDelete:"/int-admin/sys/role/delete",
  roleInfo:`/int-admin/sys/role/info`,

  menuList:'/int-admin/sys/menu/list',
  saveMenu:'/int-admin/sys/menu/save',
  updateMenu:'/int-admin/sys/menu/update',
  deleteMenu:'/int-admin/sys/menu/delete',
  navMenu:'/int-admin/sys/menu/nav'
}

//获取角色列表
export function roleList(data) {
  return request({
    url:roleApi.getRole,
    method: 'GET',
    //`headers` are custom headers to be sent,不修改预定义
    headers:data
  })
};
//角色信息
export function getRoleInfo(roleId) {
  return request({
    url:`${roleApi.roleInfo}/${roleId}`,
    method: 'GET',
  })
};
//删除角色
export function roleDelete(data) {
  return request({
    url:roleApi.roleDelete,
    method: 'POST',
    data
  })
};
//修改角色
export function roleUpdate(data) {
  return request({
    url:roleApi.roleEdit,
    method: 'POST',
    data
  })
};
//查询角色选择
export function roleCheck(data) {
  return request({
    url:roleApi.roleSelect,
    method: 'GET',
    data
  })
};
//新增角色
export function roleAdd(data) {
  return request({
    url:roleApi.saveRole,
    method: 'POST',
    data
  })
};
//菜单管理列表
export function menuList(data) {
  return request({
    url:roleApi.menuList,
    method: 'GET',
    params:data
  })
};
//保存菜单
export function saveMenu(data) {
  return request({
    url:roleApi.saveMenu,
    method: 'POST',
    data
  })
};
//编辑菜单
export function updateMenu(data) {
  return request({
    url:roleApi.updateMenu,
    method: 'POST',
    data
  })
};
//删除菜单
export function deleteMenu(data) {
  return request({
    url:roleApi.deleteMenu,
    method: 'GET',
    params:data
  })
};
//登录/刷新加载菜单
export function navMenu(data) {
  return request({
    url:roleApi.navMenu,
    method: 'GET',
    params:data
  })
};