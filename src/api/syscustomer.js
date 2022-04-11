import request from '@/utils/request';

const customerApi={
  query:'/int-admin/web/sys/syscustomer/list',
  info:'/int-admin/web/sys/syscustomer/info',
  save:'/int-admin/web/sys/syscustomer/save',
  edit:'/int-admin/web/sys/syscustomer/update',
  delete:'/int-admin/web/sys/syscustomer/delete',
  deleteAll:'/int-admin/web/sys/syscustomer/deleteBatch',
};
/**查询 */
export function queryCustomer(data,headers) {
  return request({
    url:customerApi.query,
    method: 'POST',
    data,
    headers
  })
};
/**获取单个客户信息 */
export function getCustomerInfo(id) {
  return request({
    url:`${customerApi.info}/${id}`,
    method: 'GET',
  })
};
/**保存客户信息 */
export function saveCustomer(data) {
  return request({
    url:customerApi.save,
    method: 'POST',
    data
  })
};
/**修改客户信息 */
export function editCustomer(data) {
  return request({
    url:customerApi.edit,
    method: 'POST',
    data
  })
}
/**删除客户信息 */
export function deleteCustomer(id) {
  return request({
    url:`${customerApi.delete}/${id}`,
    method: 'GET',
  })
}
/**批量删除客户信息 */
export function deleteAllCustomer(data) {
  return request({
    url:customerApi.deleteAll,
    method: 'POST',
    data
  })
}
