import request from '@/utils/request'

// 查询各年龄段需打疫苗信息列表
export function listAgeVaccinesInfo(query) {
  return request({
    url: '/vaccines/ageVaccinesInfo/list',
    method: 'get',
    params: query
  })
}

// 查询各年龄段需打疫苗信息详细
export function getAgeVaccinesInfo(id) {
  return request({
    url: '/vaccines/ageVaccinesInfo/' + id,
    method: 'get'
  })
}

// 新增各年龄段需打疫苗信息
export function addAgeVaccinesInfo(data) {
  return request({
    url: '/vaccines/ageVaccinesInfo',
    method: 'post',
    data: data
  })
}

// 修改各年龄段需打疫苗信息
export function updateAgeVaccinesInfo(data) {
  return request({
    url: '/vaccines/ageVaccinesInfo',
    method: 'put',
    data: data
  })
}

// 删除各年龄段需打疫苗信息
export function delAgeVaccinesInfo(id) {
  return request({
    url: '/vaccines/ageVaccinesInfo/' + id,
    method: 'delete'
  })
}
