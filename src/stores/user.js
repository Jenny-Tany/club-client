import { defineStore } from 'pinia'
import jsCookie from 'js-cookie'
import { loginApi, getUserInfoApi, logoutApi } from '../api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: jsCookie.get('club_token') || '', // Token
    userInfo: JSON.parse(localStorage.getItem('club_userInfo')) || null // 用户信息
  }),
  actions: {
    // 登录
    async login(loginForm) {
      const res = await loginApi(loginForm)
      const token = res.data.token // 假设后端返回的 Token 在 data.token 中
      this.token = token
      // 存储 Token 到 Cookie（有效期7天）
      jsCookie.set('club_token', token, { expires: 7 })
      // 获取并存储用户信息
      await this.getUserInfo()
      return res
    },

    // 获取用户信息
    async getUserInfo() {
      const res = await getUserInfoApi()
      this.userInfo = res.data
      localStorage.setItem('club_userInfo', JSON.stringify(res.data))
      return res
    },

    // 退出登录
    logout() {
      // 调用后端退出接口（可选）
      logoutApi().catch(() => {})
      // 清除状态
      this.token = ''
      this.userInfo = null
      // 清除存储
      jsCookie.remove('club_token')
      localStorage.removeItem('club_userInfo')
    }
  }
})