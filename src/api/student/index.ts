import req from '@/utils/request'
import type {studentYearResponseData,studentAllResponseData,studentInfoData,studentListFormData,studentListResponseData,studentResponseData} from './type'


enum API{
    STUDENT_ALL_URL = '/manage/student/all',
    STUDENT_LIST_URL = '/manage/student/list',
    STUDENT_ADD_URL = '/manage/student/add',
    STUDENT_GET_ID_URL = '/manage/student/find',
    STUDENT_UPDATE_URL = '/manage/student/update',
    STUDENT_DELETE_URL = '/manage/student/delete',
    STUDENT_MONTH_DATA_URL = '/manage/student/date',
}


// 获取所有学生
export const reqStudentAll = () => req.get<any,studentAllResponseData>(API.STUDENT_ALL_URL)
// 获取学生列表(分页)
export const reqStudentList = (data:studentListFormData) => req.post<any,studentListResponseData>(API.STUDENT_LIST_URL,data)
// 添加学生
export const reqStudentAdd = (data:studentInfoData) => req.post<any,studentResponseData>(API.STUDENT_ADD_URL,data)
// 根据id获取学生信息
export const reqStudentById = (_id:string) => req.get<any,studentResponseData>(API.STUDENT_GET_ID_URL+`?_id=${_id}`)
// 修改学生信息
export const reqStudentUpdate = (data:studentInfoData) => req.post<any,studentResponseData>(API.STUDENT_UPDATE_URL,data)
// 删除学生
export const reqStudentDelete = (studentId:string) => req.post<any,studentResponseData>(API.STUDENT_DELETE_URL,{studentId})





export const reqStudentsForYear = (year:number) => req.post<any,studentYearResponseData>(API.STUDENT_MONTH_DATA_URL,{year})