// 导入element消息提示框
import { ElMessage } from 'element-plus'
import axios from 'axios'
import useUserStore from '@/store/modules/user'



// 设置基本请求信息
// 创建axios实例
let req = axios.create({
  // 请求地址
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 请求时长
  timeout: 5000,
})
// 退出当前用户，并提示然后返回登录界面
const Logout = (userStore: any) => {
  userStore.removeUser()
  // 跳转到登录页
  ElMessage({
    message: '当前登录的用户权限被修改，请重新登录',
    type: 'warning',
  })
  setTimeout(() => {
    window.location.href = '/'
  }, 1000)
  

}
//获取权限列表
const getMenus = () => {
  let userStore = useUserStore()
  const roleId = userStore.user?.role_id
  // userMenus是仓库中的菜单列表
  let userMenus = userStore.user?.role?.menus
  if (userStore.user?.username == 'admin') return
  req({
    url: '/menus',
    method: 'post',
    data: {
      roleId
    }
  }).then(rep => {
    const res = rep
    if (res.status == 0) {
      const menus = res.data.menus
      // 仓库存储的权限列表如果和请求后端福权限列表相同则说明没有改，如果长度不同则说明被修改
      if (userMenus?.length == menus.length) {
        userMenus.forEach(item => {
          if (menus.indexOf(item) === -1) {
            Logout(userStore)
          }
        })

      } else {
        Logout(userStore)

      }
    }
  })

}



// 请求拦截器
req.interceptors.request.use(
  function (config) {
    // 状态码是 2xx 的都会触发该函数
    // 在发送请求之前做什么，例如加入token
    // 对获取权限列表及登录的请求进行拦截
    if (config.url != '/menus' && config.url != '/') getMenus();
    
      
    // console.log(config.);
    
    return config

  },
  function (error) {
    // 状态码超出2xx 的都会触发这个函数
    // 请求错误做些什么

    return Promise.reject(error)
  }
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
