import req from '@/utils/request';
import type {
    getRoleListResponseData, roleInfoData
} from './type'

export const getRoleList = () =>req.get<any,getRoleListResponseData>("/manage/role/list")

export const addRole = (data: roleInfoData) =>req.post<any,getRoleListResponseData>("/manage/role/add",data)

export const updatRole = (data: roleInfoData) =>req.post<any,getRoleListResponseData>("/manage/role/update",data)