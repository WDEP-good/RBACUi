import axios from 'axios'
import { ElMessage } from 'element-plus'
// 设置基本请求信息
let req = axios.create({
  // 请求地址
  baseURL: '/mock',
  // 请求时长
  timeout: 5000,
})

// 请求拦截器
req.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// 响应拦截器
req.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let msg = ''
    let status = error.request.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无访问权限'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出错'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default req
