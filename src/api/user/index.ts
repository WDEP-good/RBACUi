import req from '@/utils/request'

import type {
  loginFormData,
  loginResponseDate,
  userInfoReposeData,
  pwdData,
  checkPwdRespinseData,
  userListFormData,
  userListResponseData,
  userAllResponseData,
  userInfoData
} from './type'

//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
  CHECK_PWD_URL='/manage/user/pwd',
  UPDATE_PWD_URL="/manage/user/pwd",
  USER_ALL_URL = "/manage/user/all",
  USER_LIST_URL = "/manage/user/list",
  USER_ADD_URL = "/manage/user/add",
  USER_GET_ID_URL = "/manage/user/find",
  USER_UPDATE_URL = "/manage/user/update",
  USER_DELETE_URL = "/manage/user/delete"
}

// 登录接口
export const reqLogin = (data: loginFormData) =>
  req.post<any, loginResponseDate>(API.LOGIN_URL, data)

// 获取用户信息接口
export const reqUserInfo = () =>
  req.get<any, userInfoReposeData>(API.USERINFO_URL)
// 退出登录接口
export const reqLogout = () => req.post<any, any>(API.LOGOUT_URL)
// 校验原密码
export const reqCheckPwd=(data:pwdData) =>req.post<any,checkPwdRespinseData>(API.CHECK_PWD_URL,data)
// 修改密码
export const reqUpdatePwd = (data:pwdData) =>req.put<any,checkPwdRespinseData>(API.UPDATE_PWD_URL,data)
// 获取所有用户
export const  reqUserAll = () => req.get<any,userAllResponseData>(API.USER_ALL_URL)
// 获取用户列表（分页）
export const reqUserList = (data:userListFormData) => req.post<any,userListResponseData>(API.USER_LIST_URL,data)
// 添加用户
export const reqUserAdd = (data:userInfoData)=>req.post<any,loginResponseDate>(API.USER_ADD_URL,data)
// 根据_id查询用户信息
export const getUserById = (_id:string)=>req.get<any,loginResponseDate>(API.USER_GET_ID_URL+`?_id=${_id}`)
// 更新用户信息
export const reqUserUpdate = (data:userInfoData)=>req.post<any,loginResponseDate>(API.USER_UPDATE_URL,data)
// 删除用户
export const reqUserDelete = (userId:string)=>req.post<any,loginResponseDate>(API.USER_DELETE_URL,{userId})
