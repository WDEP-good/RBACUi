export interface majorInfoData{
    _id?:string|null,
    majorname:string,
    _v?:number
}

export interface majorListFormData{
    page:number,
    size:number
}
export interface majorResponseData{
    status:number,
    data?:majorInfoData,
    msg?:string

}
export interface majorAllResponseData{
    status:number,
    data?:majorInfoData[],
    msg?:string
}

export interface majorListResponseData{
    status:number,
    data?:majorListData,
    msg?:string 
}
interface majorListData{
    data:majorInfoData[],
    total:number
}