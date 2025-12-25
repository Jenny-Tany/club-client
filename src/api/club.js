// import request from './request'

// // 分页查询社团列表
// export function getClubList(params) {
//   return request({
//     url: '/clubs',
//     method: 'get',
//     params
//   })
// }

// // 查询社团详情
// export function getClubDetail(id) {
//   return request({
//     url: `/clubs/${id}`,
//     method: 'get'
//   })
// }

// // 查询我加入的社团
// export function getMyClubs() {
//   return request({
//     url: '/clubs/my',
//     method: 'get'
//   })
// }

// // 申请加入社团
// export function applyJoinClub(data) {
//   return request({
//     url: '/clubs/apply',
//     method: 'post',
//     data
//   })
// }

// // 查询社团成员列表
// export function getClubMembers(id) {
//   return request({
//     url: `/clubs/${id}/members`,
//     method: 'get'
//   })
// }

// // 查询我的申请记录
// export function getMyApplyRecords() {
//   return request({
//     url: '/clubs/apply/records',
//     method: 'get'
//   })
// }


// Mock
// 注释掉真实接口请求，改用mock数据
// import request from './request'
import {
  clubListMock,
  clubDetailMock,
  myClubsMock,
  applyJoinClubMock,
  clubMembersMock,
  applyRecordsMock
} from '../mock/clubMock'

// 模拟异步请求（延迟500ms，模拟网络请求）
const mockRequest = (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, 500)
  })
}

// 分页查询社团列表
export function getClubList(params) {
  // return request({
  //   url: '/clubs',
  //   method: 'get',
  //   params
  // })
  return mockRequest(clubListMock)
}

// 查询社团详情
export function getClubDetail(id) {
  // return request({
  //   url: `/clubs/${id}`,
  //   method: 'get'
  // })
  return mockRequest(clubDetailMock)
}

// 查询我加入的社团
export function getMyClubs() {
  // return request({
  //   url: '/clubs/my',
  //   method: 'get'
  // })
  return mockRequest(myClubsMock)
}

// 申请加入社团
export function applyJoinClub(data) {
  // return request({
  //   url: '/clubs/apply',
  //   method: 'post',
  //   data
  // })
  return mockRequest(applyJoinClubMock)
}

// 查询社团成员列表
export function getClubMembers(id) {
  // return request({
  //   url: `/clubs/${id}/members`,
  //   method: 'get'
  // })
  return mockRequest(clubMembersMock)
}

// 查询我的申请记录
export function getMyApplyRecords() {
  // return request({
  //   url: '/clubs/apply/records',
  //   method: 'get'
  // })
  return mockRequest(applyRecordsMock)
}