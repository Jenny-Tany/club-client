// src/api/user.js
import {
  userRegisterMock,
  userLoginMock,
  currentUserMock,
  updateUserMock,
  logoutMock,
  mockRequest
} from '../mock/userMock'

// 用户注册
export function userRegister(data) {
  return mockRequest(userRegisterMock)
}

// 用户登录
export function userLogin(data) {
  return mockRequest(userLoginMock)
}

// 获取当前用户信息
export function getCurrentUser() {
  return mockRequest(currentUserMock)
}

// 更新用户信息
export function updateUser(data) {
  return mockRequest(updateUserMock)
}

// 退出登录
export function userLogout() {
  return mockRequest(logoutMock)
}