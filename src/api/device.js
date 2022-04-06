import request from '@/utils/request';

const deviceApi={
  query:'/int-admin/web/sys/device/list',
  save:'/int-admin/web/sys/device/save',
  update:'/int-admin/web/sys/device/update',
  info:'/int-admin/web/sys/device/info',
  deleteBatch:'/int-admin/web/sys/device/deleteBatch',
  delete:'/int-admin/web/sys/device/delete/',
};

/*删除设备*/
export function deviceDelete(id) {
  return request({
    url:`${deviceApi.delete}/${id}`,
    method: 'GET',
  })
};
/**设备列表 */
export function deviceList(data,headers) {
  return request({
    url:deviceApi.query,
    method: 'POST',
    data,
    headers
  })
};
/**保存设备 */
export function deviceSave(data) {
  return request({
    url:deviceApi.save,
    method: 'POST',
    data
  })
};
/**修改设备 */
export function deviceUpdate(data) {
  return request({
    url:deviceApi.update,
    method: 'POST',
    data
  })
};
/**设备信息 */
export function deviceInfo(id) {
  return request({
    url:`${deviceApi.info}/${id}`,
    method: 'GET',
  })
};
/**批量删除设备 */
export function deviceDeleteBatch(data) {
  return request({
    url:deviceApi.deleteBatch,
    method: 'POST',
    data
  })
};