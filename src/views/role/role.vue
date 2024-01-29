<template>
  <div>
    <div style="padding: 20px;">
      <el-button type="primary" @click="handleadd">创建角色</el-button>
      <el-button type="primary" :disabled="currentpanduan == null ? true : false"
        @click="authroleData">设置角色权限</el-button>
    </div>
    <el-table :data="roleList" style="width: 100%;" height="380" highlight-current-row
      @current-change="handleCurrentChange" border>
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column property="name" label="角色名称" />
      <el-table-column property="create_time" label="创建时间" :formatter="resetDate" />
      <el-table-column property="auth_time" label="授权时间" :formatter="resetDate" />
      <el-table-column property="auth_name" label="授权人" />
    </el-table>
    <!-- 创建角色对话框 -->
    <el-dialog v-model="roleFormVisible" title="添加角色" width="500px">
      <el-form ref="roleFormRef" :model="role" :rules="rules" label-width="100px" style="width: 400px;">
        <el-form-item label="角色名称:" prop="role_name">
          <el-input v-model="role.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addData(roleFormRef)">确定</el-button>
          <el-button @click="roleFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 设置权限弹窗 -->
    <el-dialog v-model="authroleFormVisible" title="设置权限" width="500px">
      <Auth :role="currentRow" v-if="authroleFormVisible" ref="authRef" />
      <el-form-item>
        <el-button type="primary" @click="updateData">确定</el-button>
        <el-button @click="authroleFormVisible = false">取消</el-button>
      </el-form-item>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Auth from './components/Auth.vue'
import { ref, onMounted, nextTick, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import useUserStore from '@/store/modules/user';
let userStore = useUserStore()
import useRoleStore from '@/store/modules/role';
let roleStore = useRoleStore()
// 权限组件Ref对象
const authRef = ref()

const authroleFormVisible = ref(false)
let roleList = ref([])
let currentRow = reactive<roleInfoData>(null) 
let currentpanduan = ref()
// 添加角色内容
const role = reactive({
  role_name: ''
})

// 引入格式化日期的方法
import { formateTime } from "@/utils/dataUtils";
import { roleInfoData } from '@/api/role/type';
// 调用仓库中获取角色列表的方法
const getRoleList = () => {
  roleStore.roleList().then(() => {
    roleList.value = roleStore.roles
  })
}
onMounted(() => {
  getRoleList()
})
const handleCurrentChange = (val: any) => {
  currentRow = val
  currentpanduan.value = val
}
// 
const resetDate = (_row, _column, cellvalue, _index) => {
  return formateTime(cellvalue)
}





// 表单校验规则
const rules = reactive<FormRules>({
  role_name: [{ required: true, message: "请输入角色名称", trigger: 'blur' }]
})
// 添加角色弹出是否显示
const roleFormVisible = ref(false)
// 表单元素对象，需要和el-form的ref属性值对应
const roleFormRef = ref<FormInstance>()

// 添加角色弹窗展示
const handleadd = () => {
  roleFormVisible.value = true
  nextTick(() => {
    roleFormRef.value.resetFields()
  })
}

const addData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      roleStore.roleAdd({ name: role.role_name }).then(() => {
        // 关闭弹窗
        roleFormVisible.value = false
        // 刷新角色列表
        getRoleList()
      })
    } else {
      return false
    }
  })
}

// 点击设置权限的确定按钮
const updateData = () => {
  const newRoles = authRef.value.getMenus()
  currentRow.menus = newRoles.menus
  currentRow.name = newRoles.name
  currentRow.auth_name = userStore.user?.username
  roleStore.useUpdateRole(currentRow).then(() => {
    authroleFormVisible.value = false
    getRoleList()
  })



}
// 设置权限弹窗是否显示

const authroleData = () => {
  authroleFormVisible.value = true
}
</script>