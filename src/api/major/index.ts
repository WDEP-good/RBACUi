import req from '@/utils/request';

import type {
    majorInfoData, majorAllResponseData, majorListFormData, majorListResponseData, majorResponseData
} from './type'

enum API {
    SCHOOL_ALL_URL = "/manage/major/all",
    SCHOOL_LIST_URL = "/manage/major/list",
    SCHOOL_ADD_URL = "/manage/major/add",
    SCHOOL_GET_ID_URL = "/manage/major/find",
    SCHOOL_UPDATE_URL = "/manage/major/update",
    SCHOOL_DELETE_URL = "/manage/major/delete",
}

// 获取所有专业
export const reqMajorAll = () => req.get<any,majorAllResponseData>(API.SCHOOL_ALL_URL);
// 获取专业列表
export const reqMajorList = (data:majorListFormData)=> req.post<any,majorListResponseData>(API.SCHOOL_LIST_URL,data);
// 添加专业
export const reqMajorAdd = (data:majorInfoData)=> req.post<any,majorResponseData>(API.SCHOOL_ADD_URL,data);
// 根据id获取专业信息
export const reqMajorById = (_id:string)=> req.get<any,majorResponseData>(API.SCHOOL_GET_ID_URL+`?_id=${_id}`);
// 更新专业信息
export const reqMajorUpdate = (data:majorInfoData)=>req.post<any,majorResponseData>(API.SCHOOL_UPDATE_URL,data);
// 删除专业
export const reqMajorDelete = (majorId:string)=> req.post<any,majorResponseData>(API.SCHOOL_DELETE_URL,{majorId});
