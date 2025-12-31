import request from '@/utils/request'

// 统一前缀
const BASE_URL = '/club'

// 分页查询社团列表
export function getClubList(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: 'get',
    params
  })
}

// 查询社团详情
export function getClubDetail(id) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  })
}

// 申请加入社团（核心：必须导出 joinClub）
export function applyJoinClub(data) {
  return request({
    url: `${BASE_URL}/apply`,
    method: 'post',
    data
  })
}
// 关键：添加 joinClub 别名导出（和Vue中导入的名称一致）
export const joinClub = applyJoinClub

// 退出社团（新增：必须导出 quitClub，接口路径需和后端对齐）
export function quitClub(id) {
  return request({
    url: `${BASE_URL}/quit/${id}`, // 后端退出接口路径，若未实现可先mock
    method: 'post' // 或 delete，以后端为准
  })
}

// 查询我加入的社团
export function getMyClub() {
  return request({
    url: `${BASE_URL}/my`,
    method: 'get'
  })
}

// 查询社团成员列表
export function getClubMembers(id) {
  return request({
    url: `${BASE_URL}/${id}/members`,
    method: 'get'
  })
}

// 查询我的社团申请记录
export function getMyClubApplications() {
  return request({
    url: `${BASE_URL}/my/applications`,
    method: 'get'
  })
}