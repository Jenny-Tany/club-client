import request from '@/utils/request'

// 分页查询社团列表（支持关键词搜索）
export function getClubList(params) {
  return request({
    url: '/club/list',
    method: 'get',
    params
  })
}

// 查询社团详情
export function getClubDetail(id) {
  return request({
    url: `/club/${id}`,
    method: 'get'
  })
}

// 申请加入社团
export function applyJoinClub(data) {
  return request({
    url: '/club/apply',
    method: 'post',
    data
  })
}

// 查询我加入的社团
export function getMyClub() {
  return request({
    url: '/club/my',
    method: 'get'
  })
}

// 查询社团成员列表
export function getClubMembers(id) {
  return request({
    url: `/club/${id}/members`,
    method: 'get'
  })
}

// 查询我的社团申请记录
export function getMyClubApplications() {
  return request({
    url: '/club/my/applications',
    method: 'get'
  })
}