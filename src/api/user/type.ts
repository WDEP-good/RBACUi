export interface loginFormData {
  username: string
  password: string
}
//
interface dataType {
  token: string
}

//
export interface loginResponseDate {
  status: number
  data: dataType
}
interface userInfoData {
  _id: string
  username: string
  name: string
  password: string
  phone: string
  role_id: string
  create_time: number
  token: string
  __v: number
}

export interface userInfoReposeData {
  status: number
  data: userInfoData
}
