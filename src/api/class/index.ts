import req from "@/utils/request";


import { classInfoData,calssAllResponseData,classListFormData,classListResponseData,classResponseData } from "./type";

enum API{
    SCHOOL_ALL_URL = "/manage/class/all",
    SCHOOL_LIST_URL = "/manage/class/list",
    SCHOOL_ADD_URL = "/manage/class/add",
    SCHOOL_GET_ID_URL = "/manage/class/find",
    SCHOOL_UPDATE_URL = "/manage/class/update",
    SCHOOL_DELETE_URL = "/manage/class/delete"
}

export const reqClassAll = () => req.get<any,calssAllResponseData>(API.SCHOOL_ALL_URL);

export const reqClassList = (data: classListFormData) => req.post<any,classListResponseData>(API.SCHOOL_LIST_URL, data);

export const reqClassAdd = (data: classInfoData) => req.post<any,classResponseData>(API.SCHOOL_ADD_URL,data);

export const reqClassById = (_id: string) => req.get<any,classResponseData>(API.SCHOOL_GET_ID_URL + `?_id=${_id}`);

export const reqClassUpdate = (data: classInfoData) => req.post<any,classResponseData>(API.SCHOOL_UPDATE_URL, data);

export const reqClassDelete = (classId: string) => req.post<any,classResponseData>(API.SCHOOL_DELETE_URL,{classId})