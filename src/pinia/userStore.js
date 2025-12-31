import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  // 状态：Token和用户信息
  const token = ref(Cookies.get('token') || '')
  const userInfo = ref({})

  // 动作：登录（保存Token和用户信息）
  const login = (tokenVal, userInfoVal) => {
    token.value = tokenVal
    userInfo.value = userInfoVal
    // Token持久化（有效期7天）
    Cookies.set('token', tokenVal, { expires: 7 })
  }

  // 动作：退出登录（清除状态和Cookie）
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    Cookies.remove('token')
  }

  return { token, userInfo, login, logout }
})