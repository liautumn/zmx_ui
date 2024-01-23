import request from '@/utils/request'

// 查询接种方法信息列表
export function listVaccinationMethodInfo(query) {
  return request({
    url: '/vaccines/vaccinationMethodInfo/list',
    method: 'get',
    params: query
  })
}

// 查询接种方法信息详细
export function getVaccinationMethodInfo(id) {
  return request({
    url: '/vaccines/vaccinationMethodInfo/' + id,
    method: 'get'
  })
}

// 新增接种方法信息
export function addVaccinationMethodInfo(data) {
  return request({
    url: '/vaccines/vaccinationMethodInfo',
    method: 'post',
    data: data
  })
}

// 修改接种方法信息
export function updateVaccinationMethodInfo(data) {
  return request({
    url: '/vaccines/vaccinationMethodInfo',
    method: 'put',
    data: data
  })
}

// 删除接种方法信息
export function delVaccinationMethodInfo(id) {
  return request({
    url: '/vaccines/vaccinationMethodInfo/' + id,
    method: 'delete'
  })
}
