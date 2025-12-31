import request from '@/utils/request'

// 浏览活动列表（支持关键词和社团筛选）
export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

// 查看活动详情
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

// 报名参加活动
export function signupActivity(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: 'post'
  })
}

// 取消活动报名
export function cancelActivitySignup(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: 'delete'
  })
}

// 查看我的活动报名记录
export function getMyActivitySignups() {
  return request({
    url: '/activity/my-signups',
    method: 'get'
  })
}