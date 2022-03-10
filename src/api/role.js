import request from '@/utils/request';

const roleApi={
  getRole:'/int-admin/sys/role/list',
  saveRole:"/int-admin/sys/role/save",
  roleEdit:"/int-admin/sys/role/update",
  roleSelect:"/int-admin/sys/role/select",
  roleDelete:"/int-admin/sys/role/delete",
  roleInfo:`/int-admin/sys/role/info/${roleId}`
}

//获取角色列表
export function roleList(data) {
  return request({
    url:roleApi.getRole,
    method: 'POST',
    data
  })
};