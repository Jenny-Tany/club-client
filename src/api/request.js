import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8080/api', // 替换为你的后端接口地址
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可添加token等请求头信息
    // config.headers['token'] = localStorage.getItem('token')
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 可根据后端返回码统一处理，比如token过期
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  error => {
    console.error('响应错误:', error)
    ElMessage.error(error.message || '服务器错误')
    return Promise.reject(error)
  }
)

export default service