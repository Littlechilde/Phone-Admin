import request from '@/utils/request';

const departApi={
  getList:'/int-admin/sys/dept/list',
}

//获取部门列表
export function partList(data) {
  return request({
    url:departApi.getList,
    method: 'GET',
  })
};