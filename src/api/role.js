import request from '@/utils/request';

const roleApi={
  getRole:'/int-admin/sys/role/list',
  saveRole:"/int-admin/sys/role/save",
  roleEdit:"/int-admin/sys/role/update",
  roleSelect:"/int-admin/sys/role/select",
  roleDelete:"/int-admin/sys/role/delete",
  // roleInfo:`/int-admin/sys/role/info/${roleId}`,

  menuList:'/int-admin/sys/menu/list',
  saveMenu:'/int-admin/sys/menu/save',
  updateMenu:'/int-admin/sys/menu/update',
  deleteMenu:'/int-admin/sys/menu/delete'
}

//获取角色列表
export function roleList(data) {
  return request({
    url:roleApi.getRole,
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