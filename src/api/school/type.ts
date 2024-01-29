// 返回单个学校的信息
export interface schoolInfoData {
    _id?:string,
    schoolname:string,
    __v?:number,
}
// 15. 获取学校列表（分页）接口传递的参数
export interface schoolListFormData{
    page:number,
    size:number
}

// 13. 根据id查询学校 接口返回的类型 ----->成功返回data没有msg，失败返回msg没有data
export interface schoolResponseData{
    status:number,
    data?:schoolInfoData,
    msg?:string
}

// 获取所有用户接口返回的数据类型
export interface schoolAllResponseData{
    status:number,
    data?:schoolInfoData[],
    msg?:string
}
// 15. 获取学校列表（分页）返回的数据类型
export interface schoolListResponseData{
    status:number,
    data?:schoolListData,
    msg?:string
}

// 15. 获取学校列表（分页）返回的数据类型中的二级data数据类型
interface schoolListData{
    data:schoolInfoData[],
    total:number
}



