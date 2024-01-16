import req from '@/utils/request'

import type {
  loginFormData,
  loginResponseDate,
  userInfoReposeData,
} from './type'

//
enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
}

export const reqLogin = (data: loginFormData) =>
  req.post<any, loginResponseDate>(API.LOGIN_URL, data)

export const reqUserInfo = () =>
  req.get<any, userInfoReposeData>(API.USERINFO_URL)
export const reqLogout = () => req.post<any, any>(API.LOGOUT_URL)
