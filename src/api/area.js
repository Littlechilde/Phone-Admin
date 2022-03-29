import request from '@/utils/request';

const areaApi={
  getList:'/int-admin/web/sys/area/list',
  deleteArea:'/int-admin/web/sys/area/delete',
  getInfo:'/int-admin/web/sys/area/info',
  areaSave:'/int-admin/web/sys/area/save',
  areaUpdate:'/int-admin/web/sys/area/update',
  deleteMore:'/int-admin/web/sys/area/deleteBatch'
}

//获取地区列表
export function partList(params,headers) {
  return request({
    url:areaApi.getList,
    method: 'POST',
    params,
    headers
  })
};
//删除地区
export function deleteArea(params) {
  return request({
    url:`${areaApi.deleteArea}/${params}`,
    method: 'GET',
  })
};
//地区查询
export function getInfo(params) {
  return request({
    url:`${areaApi.getInfo}/${params}`,
    method: 'GET',
  })
};
//保存
export function areaSave(data) {
  return request({
    url:areaApi.areaSave,
    method: 'POST',
    data
  })
};
//修改
export function areaUpdate(data) {
  return request({
    url:areaApi.areaUpdate,
    method: 'POST',
    data
  })
};
//批量删除
export function deleteMore(data) {
  return request({
    url:areaApi.deleteMore,
    method: 'POST',
    data
  })
};