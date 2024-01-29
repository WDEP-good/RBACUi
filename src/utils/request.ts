// 导入element消息提示框
import { ElMessage } from 'element-plus'
import axios from 'axios'
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
    // 状态码是 2xx 的都会触发该函数
    // 在发送请求之前做什么，例如加入token
    return config
  },
  function (error) {
    // 状态码超出2xx 的都会触发这个函数
    // 请求错误做些什么

    return Promise.reject(error)
  },
)
// 响应拦截器
req.interceptors.response.use(
  function (response) {
    // 状态码是2xx 的都会触发
    // 在接收响应做些什么，例如跳转到登录页
    return response.data
  },
  function (error) {
    // 状态码超出2xx 的都会触发这个函数
    /// 响应错误做点什么
    // 定义一个字符串用于存储根据状态码的不同返回的信息
    let msg = ''
    // 当状态码超过2xx时触发这个函数，通过error.request.status获取状态码
    let status = error.request.status
    // 通过switch语句返回不同状态码返回的消息
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
    // 执行弹窗提示
    ElMessage({
      // 消息类型
      type: 'error',
      // 显示消息内容
      message: msg,
    })
    return Promise.reject(error)
  },
)
// 导出axios拦截
export default req
