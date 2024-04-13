import request from '@/utils/request'

// 查询护士信息列表
export function listNurseInfo(query) {
  return request({
    url: '/vaccines/nurseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询护士信息详细
export function getNurseInfo(id) {
  return request({
    url: '/vaccines/nurseInfo/' + id,
    method: 'get'
  })
}

// 新增护士信息
export function addNurseInfo(data) {
  return request({
    url: '/vaccines/nurseInfo',
    method: 'post',
    data: data
  })
}

// 修改护士信息
export function updateNurseInfo(data) {
  return request({
    url: '/vaccines/nurseInfo',
    method: 'put',
    data: data
  })
}

// 删除护士信息
export function delNurseInfo(id) {
  return request({
    url: '/vaccines/nurseInfo/' + id,
    method: 'delete'
  })
}
