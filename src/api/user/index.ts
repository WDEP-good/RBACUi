import req from '@/utils/request'

import type {loginFormData,loginResponseDate,userInfoReposeData,} from './type'

//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
}

// 登录接口
export const reqLogin = (data: loginFormData) =>
  req.post<any, loginResponseDate>(API.LOGIN_URL, data)

  // 获取用户信息接口
export const reqUserInfo = () =>
  req.get<any, userInfoReposeData>(API.USERINFO_URL)
  // 退出登录接口
export const reqLogout = () => req.post<any, any>(API.LOGOUT_URL)
