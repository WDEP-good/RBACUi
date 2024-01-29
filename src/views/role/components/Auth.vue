<template>
    <div>
        <el-form ref="roleForm" :model="updateRole" :rules="rules" label-width="100px" style="width: 400px;">
            <el-form-item label="角色名称:" prop="name">
                <el-input v-model="updateRole.name" placeholder="请输入角色名称" />
            </el-form-item>
        </el-form>
        <el-tree :data="authList" :props="props" node-key="index" default-expand-all show-checkbox
            :default-checked-keys="checkedKeys" @check-change="handleCheckChange" />
    </div>
</template>
<script setup lang="ts">
import type { roleInfoData } from "@/api/role/type.ts"
import menuList from "@/config/menuConfig";
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, onMounted, ref } from "vue";

// 引入菜单项

const arrnot = ref([])
const huoqutree = ()=>{
    menuList.forEach((item:any)=>{
        if(item.children){
            arrnot.value.push(item.index)
        }
    })
}
huoqutree()
// 树形控件数据列表
const authList = ref([])
let updateRole: roleInfoData = reactive({
    name: ''
})
const roleForm = ref<FormInstance>()
// 接收从父组件传递过来开的数据
const props = defineProps(['role'])
const rules = reactive<FormRules>({
    name: [{ required: true, message: "请输入角色名称", trigger: 'blur' }]
})
interface Tree {
    index: string,
}
// 树形控件选中项
let checkedKeys = reactive([])
// 获取树形控件元素
const getAuthNodes = (mesnuList: any) => {
    return mesnuList.map((item: any) => {
        if (!item.children) {
            return {
                index: item.index,
                label: item.title,
            }
        } else {
            return {
                index: item.index,
                label: item.title,
                children: getAuthNodes(item.children),
            }
        }
    })
}
onMounted(() => {
    authList.value = getAuthNodes(menuList)
    updateRole = reactive({ ...props.role })
    checkedKeys = props.role.menus
})
const getMenus = () => {
    updateRole.menus = checkedKeys
    return updateRole
}
// 组件中的数据对外默认是关闭的，需要暴露出去
defineExpose({
    getMenus,
})

// 树形控件点击回调
const handleCheckChange = (data: Tree, checked: boolean, _indeterminate: boolean) => {
    if (checked) {
        if (arrnot.value.indexOf(data.index) == -1 && checkedKeys.indexOf(data.index) == -1) {
            checkedKeys.push(data.index)
        }
    } else {
        if (checkedKeys.indexOf(data.index) != -1) {
            checkedKeys.splice(checkedKeys.indexOf(data.index), 1)
        }
    }
}

</script>

<style scoped></style>