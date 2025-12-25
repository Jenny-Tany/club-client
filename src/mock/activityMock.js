// 模拟活动列表数据
export const activityListMock = {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        id: 1,
        name: 'Python编程入门讲座',
        clubName: '编程爱好者协会',
        time: '2025-01-10 14:00-16:00',
        status: '未开始',
        hasSignUp: false,
        location: '教学楼A301',
        signUpDeadline: '2025-01-08 23:59:59'
      },
      {
        id: 2,
        name: '秋季羽毛球友谊赛',
        clubName: '羽毛球社',
        time: '2025-01-15 09:00-12:00',
        status: '未开始',
        hasSignUp: true,
        location: '体育馆2号场地',
        signUpDeadline: '2025-01-12 23:59:59'
      },
      {
        id: 3,
        name: '经典文学作品分享会',
        clubName: '文学社',
        time: '2025-01-05 19:00-21:00',
        status: '进行中',
        hasSignUp: false,
        location: '图书馆会议室',
        signUpDeadline: '2025-01-04 23:59:59'
      }
    ],
    total: 3
  }
}

// 模拟活动详情数据
export const activityDetailMock = {
  code: 200,
  message: 'success',
  data: {
    id: 1,
    name: 'Python编程入门讲座',
    clubName: '编程爱好者协会',
    time: '2025-01-10 14:00-16:00',
    location: '教学楼A301',
    signUpDeadline: '2025-01-08 23:59:59',
    description: '面向零基础同学的Python入门讲座，讲解Python基础语法和简单项目实战'
  }
}

// 模拟我的报名记录数据
export const mySignUpRecordsMock = {
  code: 200,
  message: 'success',
  data: [
    {
      id: 1001,
      activityName: '秋季羽毛球友谊赛',
      clubName: '羽毛球社',
      signUpTime: '2025-12-20 09:15:00',
      activityStatus: '未开始'
    },
    {
      id: 1002,
      activityName: '经典文学作品分享会',
      clubName: '文学社',
      signUpTime: '2025-12-18 16:30:00',
      activityStatus: '进行中'
    }
  ]
}

// 模拟报名活动返回结果
export const signUpActivityMock = {
  code: 200,
  message: '报名成功'
}

// 模拟取消报名返回结果
export const cancelSignUpMock = {
  code: 200,
  message: '取消报名成功'
}