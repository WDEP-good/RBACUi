import { defineStore } from "pinia";
import { addRole, getRoleList, updatRole } from "@/api/role";
import { RoleState } from "./types/roleType";
import { getRoleListResponseData, roleInfoData } from "@/api/role/type";


let useRoleStore = defineStore("Role",{
    state:():RoleState=>{
        return{
            roles:[]
        }
    },
    actions:{
        async roleList(){
            let result:getRoleListResponseData = await getRoleList();
            if(result.status ==0 ){
                this.roles = result.data
                return "OK"
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        async roleAdd(data:roleInfoData){
            let result :getRoleListResponseData = await addRole(data);
            if(result.status === 0){
                return "OK"
            }
            else{
                return Promise.reject(new Error(result.msg))
            }

        },
        async useUpdateRole(data:roleInfoData){
            let result :getRoleListResponseData = await updatRole(data);
            if(result.status === 0){
                return "OK"
            }
            else{
                return Promise.reject(new Error(result.msg))
            }

        }
    }
})
export default useRoleStore