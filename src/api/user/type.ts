// 登录接口需要携带参数ts类型
export interface loginFormData {
  username: string
  password: string
}
// //登录接口返回数据类型中data选项的数据类型
// interface dataType {
//   token?: string | null
// }

//登录接口返回的数据类型
export interface loginResponseDate {
  status: number
  data?: userInfoData
  msg?: string
}
// 角色数据类型
export interface userRoleData {
  id?: string
  name?: string
  menus: string[]
  create_time?: number
  __V?: number
  auth_time?: number
  auth_name?: string
}

// 服务器返回用户信息中data选项的数据类型
export interface userInfoData {
  _id: string
  username: string
  name: string
  password: string
  phone?: string
  role_id?: string
  create_time?: number
  token?: string
  __v?: number
  role?: userRoleData
}
// 服务器返回用户信息的数据类型
export interface userInfoReposeData {
  status: number
  data: userInfoData
}
// 校验与修改密码携带参数ts类型
export interface pwdData{
  userId:string,
  password:string
}
// 校验密码接口返回类型
export interface checkPwdRespinseData{
  status:number,
  data?:userInfoData,
  msg?:string
}
// 获取用户列表接口需要携带参数的ts类型
export interface userListFormData {
  page: number,
  size: number
}
// 获取所有用户接口返回的数据类型
export interface userAllResponseData {
  status: number,
  data?: userInfoData[],
  msg?: string,
}
// 获取用户列表接口返回的数据类型
export interface userListResponseData {
  status: number,
  data?:userListData,
  msg?:string,
}
interface userListData{
  data:userInfoData[],
  roles:[],
  total:number
}