import request from '@/utils/request';

const manageApi={
  delete:'/int-admin/web/sys/numberresources/delete',
  deleteBatch:'/int-admin/web/sys/numberresources/deleteBatch',
  query:'/int-admin/web/sys/numberresources/info/',
  list:'/int-admin/web/sys/numberresources/list',
  save:'/int-admin/web/sys/numberresources/save',
  update:'/int-admin/web/sys/numberresources/update',
};

/**删除 */
export function deleteManage(bigint) {
  return request({
    url:`${manageApi.delete}/${bigint}`,
    method: 'GET',
  });
};
/**批量删除 */
export function deleteBatchManage(data) {
  return request({
    url:manageApi.deleteBatch,
    method: 'POST',
    data
  });
};
/**查询 */
export function queryManage(bigint) {
  return request({
    url:`${manageApi.query}${bigint}`,
    method: 'GET',
  });
};
/**列表 */
export function listManage(data,headers) {
  return request({
    url:manageApi.list,
    method: 'POST',
    data,
    headers
  });
};
/**保存 */
export function saveManage(data) {
  return request({
    url:manageApi.save,
    method: 'POST',
    data
  });
};
/**修改 */
export function updateManage(data) {
  return request({
    url:manageApi.update,
    method: 'POST',
    data
  });
};
