import request from '@/utils/request';

const userApi={
  delete:'/int-admin/sys/user/delete',
  info:`/int-admin/sys/user/info`,
  list:"/int-admin/sys/user/list",
  password:'/int-admin/sys/user/password',
  save:"/int-admin/sys/user/save",
  update:"/int-admin/sys/user/update"
};

/*删除用户*/
export function userDelete(data) {
  return request({
    url:userApi.delete,
    method: 'POST',
    data
  })
};
/**用户信息 */
export function userInfo({userId}) {
  return request({
    url: `${userApi.info}/${userId}`,
    method: 'GET',
  })
};
/**用户列表 */
export function userList(data) {
  return request({
    url:userApi.list,
    method: 'GET',
    params:data
  })
};
/**修改密码 */
export function userPassword(data) {
  return request({
    url:userApi.password,
    method: 'GET',
    params:data
  })
};
/**保存用户 */
export function userSave(data) {
  return request({
    url:userApi.save,
    method: 'GET',
    data
  })
};
/**修改用户 */
export function userUpdate(data) {
  return request({
    url:userApi.update,
    method: 'POST',
    data
  })
};