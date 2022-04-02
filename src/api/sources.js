import request from '@/utils/request';

const sourceApi={
  delete:'/int-admin/web/sys/numberresources/delete',
  deleteAll:'/int-admin/web/sys/numberresources/deleteBatch',
  getInfo:'/int-admin/web/sys/numberresources/info',
  getList:'/int-admin/web/sys/numberresources/list',
  save:'/int-admin/web/sys/numberresources/save',
  edit:'/int-admin/web/sys/numberresources/update',
};

/*删除号段*/
export function userDelete(bigint) {
  return request({
    url:`${sourceApi.delete}/${bigint}`,
    method: 'GET',
  })
};
/*批量删除号段*/  
export function userDeleteAll(data) {
  return request({
    url:sourceApi.deleteAll,
    method: 'POST',
    data
  })
};
/*获取单个号段*/
export function getInfo(bigint) {
  return request({
    url:`${sourceApi.getInfo}/${bigint}`,
    method: 'GET',
    data
  })
};
/*获取号段列表*/
export function getList(data,headers) {
  return request({
    url:sourceApi.getList,
    method: 'POST',
    params: data,
    headers
  })
};
/*保存号段*/
export function saveList(data) {
  return request({
    url:sourceApi.save,
    method: 'POST',
    data
  })
};
/*修改号段*/
export function editList(data) {
  return request({
    url:sourceApi.edit,
    method: 'POST',
    data
  })
};