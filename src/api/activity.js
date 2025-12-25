// import request from './request'

// // 浏览活动列表
// export function getActivityList(params) {
//   return request({
//     url: '/activities',
//     method: 'get',
//     params
//   })
// }

// // 查看活动详情
// export function getActivityDetail(id) {
//   return request({
//     url: `/activities/${id}`,
//     method: 'get'
//   })
// }

// // 报名活动
// export function signUpActivity(data) {
//   return request({
//     url: '/activities/signup',
//     method: 'post',
//     data
//   })
// }

// // 取消报名
// export function cancelSignUp(id) {
//   return request({
//     url: `/activities/signup/${id}`,
//     method: 'delete'
//   })
// }

// // 查看我的报名记录
// export function getMySignUpRecords() {
//   return request({
//     url: '/activities/signup/records',
//     method: 'get'
//   })
// }



// Mock
// 注释掉真实接口请求，改用mock数据
// import request from './request'
import {
  activityListMock,
  activityDetailMock,
  signUpActivityMock,
  cancelSignUpMock,
  mySignUpRecordsMock
} from '../mock/activityMock'

// 模拟异步请求（延迟500ms）
const mockRequest = (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, 500)
  })
}

// 浏览活动列表
export function getActivityList(params) {
  // return request({
  //   url: '/activities',
  //   method: 'get',
  //   params
  // })
  return mockRequest(activityListMock)
}

// 查看活动详情
export function getActivityDetail(id) {
  // return request({
  //   url: `/activities/${id}`,
  //   method: 'get'
  // })
  return mockRequest(activityDetailMock)
}

// 报名活动
export function signUpActivity(data) {
  // return request({
  //   url: '/activities/signup',
  //   method: 'post',
  //   data
  // })
  return mockRequest(signUpActivityMock)
}

// 取消报名
export function cancelSignUp(id) {
  // return request({
  //   url: `/activities/signup/${id}`,
  //   method: 'delete'
  // })
  return mockRequest(cancelSignUpMock)
}

// 查看我的报名记录
export function getMySignUpRecords() {
  // return request({
  //   url: '/activities/signup/records',
  //   method: 'get'
  // })
  return mockRequest(mySignUpRecordsMock)
}