// src/mock/userMock.js
// 模拟用户注册返回
export const userRegisterMock = {
  code: 200,
  message: '注册成功'
}

// 模拟用户登录返回（包含token）
export const userLoginMock = {
  code: 200,
  message: '登录成功',
  data: {
    token: 'mock-token-123456',
    username: 'zhangsan'
  }
}

// 模拟当前用户信息
export const currentUserMock = {
  code: 200,
  message: '获取成功',
  data: {
    username: 'zhangsan',
    realName: '张三',
    studentId: '20230001',
    email: 'zhangsan@campus.com',
    phone: '13800138000'
  }
}

// 模拟更新用户信息返回
export const updateUserMock = {
  code: 200,
  message: '更新成功'
}

// 模拟异步请求（延迟500ms）
export const mockRequest = (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, 500)
  })
}