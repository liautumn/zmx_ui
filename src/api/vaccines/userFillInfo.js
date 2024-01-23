import request from '@/utils/request'

// 查询用户填报信息列表
export function listUserFillInfo(query) {
  return request({
    url: '/vaccines/userFillInfo/list',
    method: 'get',
    params: query
  })
}

// 查询用户填报信息详细
export function getUserFillInfo(id) {
  return request({
    url: '/vaccines/userFillInfo/' + id,
    method: 'get'
  })
}

// 新增用户填报信息
export function addUserFillInfo(data) {
  return request({
    url: '/vaccines/userFillInfo',
    method: 'post',
    data: data
  })
}

// 修改用户填报信息
export function updateUserFillInfo(data) {
  return request({
    url: '/vaccines/userFillInfo',
    method: 'put',
    data: data
  })
}

// 删除用户填报信息
export function delUserFillInfo(id) {
  return request({
    url: '/vaccines/userFillInfo/' + id,
    method: 'delete'
  })
}
