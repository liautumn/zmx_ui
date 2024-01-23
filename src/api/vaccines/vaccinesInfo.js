import request from '@/utils/request'

// 查询疫苗信息列表
export function listVaccinesInfo(query) {
  return request({
    url: '/vaccines/vaccinesInfo/list',
    method: 'get',
    params: query
  })
}

// 查询疫苗信息详细
export function getVaccinesInfo(id) {
  return request({
    url: '/vaccines/vaccinesInfo/' + id,
    method: 'get'
  })
}

// 新增疫苗信息
export function addVaccinesInfo(data) {
  return request({
    url: '/vaccines/vaccinesInfo',
    method: 'post',
    data: data
  })
}

// 修改疫苗信息
export function updateVaccinesInfo(data) {
  return request({
    url: '/vaccines/vaccinesInfo',
    method: 'put',
    data: data
  })
}

// 删除疫苗信息
export function delVaccinesInfo(id) {
  return request({
    url: '/vaccines/vaccinesInfo/' + id,
    method: 'delete'
  })
}
