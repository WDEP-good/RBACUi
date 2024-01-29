// type.ts
import { userInfoData } from '@/api/user/type'

// 定义用户小仓库类型
export interface UserState {
  user: userInfoData | null,
  users:userInfoData[]
}
import {schoolInfoData} from '@/api/school/type'
import { majorInfoData } from '@/api/major/type'
import { classInfoData } from '@/api/class/type'
import { studentInfoData } from '@/api/student/type'
// 定义学校小仓库数据类型
export interface SchoolState {
  schools:schoolInfoData[] | undefined
}

// 定义专业小仓库数据类型
export interface MajorState {
  majors:majorInfoData[] | undefined
}
// 定义班级小仓库数据类型
export interface ClassState {
  classes:classInfoData[] | undefined
}
// 定义学生小仓库数据类型
export interface StudentState {
  students:studentInfoData[] | undefined
}