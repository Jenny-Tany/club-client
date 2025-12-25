// 模拟社团列表数据
export const clubListMock = {
  code: 200,
  message: 'success',
  data: {
    list: [
      {
        id: 1,
        name: '编程爱好者协会',
        description: '专注于编程学习、技术交流的社团，定期举办编程竞赛和技术分享会',
        memberCount: 120,
        createTime: '2024-01-15',
        manager: '张三'
      },
      {
        id: 2,
        name: '羽毛球社',
        description: '以球会友，每周组织羽毛球活动，提升球技，锻炼身体',
        memberCount: 89,
        createTime: '2024-02-20',
        manager: '李四'
      },
      {
        id: 3,
        name: '文学社',
        description: '热爱文学创作与阅读，定期开展读书分享、写作交流活动',
        memberCount: 65,
        createTime: '2024-03-10',
        manager: '王五'
      }
    ],
    total: 3 // 总条数
  }
}

// 模拟社团详情数据
export const clubDetailMock = {
  code: 200,
  message: 'success',
  data: {
    id: 1,
    name: '编程爱好者协会',
    description: '专注于编程学习、技术交流的社团，定期举办编程竞赛和技术分享会',
    createTime: '2024-01-15',
    manager: '张三',
    memberCount: 120
  }
}

// 模拟我加入的社团数据
export const myClubsMock = {
  code: 200,
  message: 'success',
  data: [
    {
      id: 1,
      name: '编程爱好者协会',
      description: '专注于编程学习、技术交流的社团，定期举办编程竞赛和技术分享会'
    }
  ]
}

// 模拟社团成员数据
export const clubMembersMock = {
  code: 200,
  message: 'success',
  data: [
    { id: 101, name: '张三', role: '管理员' },
    { id: 102, name: '小明', role: '普通成员' },
    { id: 103, name: '小红', role: '普通成员' }
  ]
}

// 模拟我的申请记录数据
export const applyRecordsMock = {
  code: 200,
  message: 'success',
  data: [
    {
      clubName: '羽毛球社',
      applyTime: '2025-12-01 10:30:00',
      status: '审核中'
    },
    {
      clubName: '文学社',
      applyTime: '2025-11-25 14:20:00',
      status: '通过'
    }
  ]
}

// 模拟申请加入社团的返回结果
export const applyJoinClubMock = {
  code: 200,
  message: '申请提交成功，请等待审核'
}