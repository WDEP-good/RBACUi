
// 学员信息接口请求参数 ---->一个学员用户基本的数据
export interface studentInfoData {
    _id: string |null,
    name: string,
    gender: string, //性别
    school?: string, //学校
    major?: string,  //专业
    grade?: string,  //年级
    education?: string,  //学历
    direction?: string,   //学习方向
    id_number?: string,  //身份证号
    phone?: string,   //电话号码
    parent?: string,   //家长姓名
    parent_phone?: string,  //家长联系电话
    address?: string,  //家庭住址
    qq?: string,  //QQ号码
    class: string,    //所在班级
    admission_date?: string, //入学时间
    teacher_id: string,  //教师id
    manager_id: string, //学管id
    pictures?: string[], //照片数量
    note?: string, //备注信息
    __v?:number
}

// 学员信息接口返回的数据类型   -----> 31. 更新学员信息返回示例的数据类型，返回的数据中成功有data无msg，失败有msg无data
export interface studentResponseData {
    status: number,
    data?:studentInfoData,
    msg?:string
}


// 获取学员列表（分页）接口请求参数  ---->32. 获取学员列表（分页）请求的三个参数 
export interface studentListFormData {
    page: number, //当前页码
    size: number,  //每页显示多少条数据
    searchMap:searchMapData   //查询条件
}

// 学生查询条件数据类型   --->查询条件，一些学员的基本的信息的数据类型
interface searchMapData {
    name:string,
    direction:string,
    teacher_id?:string,
    manager_id?:string,
    class:string
}
// 获取学员列表（分页）接口返回的参数  ---> 待定：只返回一条studentInfoData的学生基本信息
export interface studentResponseData {
    status: number,
    data?:studentInfoData,
    msg?:string
}
// 获取所有学生用户接口返回的数据类型   --->就是获取所有用户，但是对data的类型进行了约束是一个studentInfoData数组
export interface studentAllResponseData {
    status: number,
    data?: studentInfoData[],
    msg?: string,
  }
// 获取学生用户列表接口返回的数据类型  -->32. 获取学员列表（分页）返回示例 第一层数据类型---无msg
export interface studentListResponseData {
    status: number,
    total: number,
    data?: studentListData,
    msg?: string,
  }

//   学生列表data数据类型  ----->32. 获取学员列表（分页）返回示例 data数据的类型
interface studentListData{
total: number
    data:studentInfoData[],
    tottotal:number,
}
// 单月学员数量data数据类型
interface monthData{
    _id:string,
    count:number
}
// 查询某一年每月学员数量接口返回的数据类型  ---->36. 根据年份查询每月学生数量
export interface studentYearResponseData {
    status: string,
    data:monthData[]
}