<template>
    <div>
        <el-button type="primary" @click="handlerAdd">添加用户</el-button>
        <el-table :data="users" style="width: 100%;height: 360px;" border>
            <el-table-column prop="username" label="用户名" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <!-- formatter：用来格式方法 -->
            <el-table-column prop="create_time" label="创建时间" :formatter="getTime"></el-table-column>
            <el-table-column prop="role_id" label="所属角色" :formatter="formateRole"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部页数 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total,sizes, prev, pager, next,jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 添加用户弹窗 -->
        <el-dialog v-model="userFormVisible" :title="user._id == null ? '添加用户':'编辑用户'"  width="500px">
            <el-form ref="userFormRef" :model="user" label-width="100px" :rules=rules>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password" type="password">
                    <el-input v-model="user.password" type="password" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.name" />
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select v-model="user.role_id" placeholder="请点击选择">
                        <el-option v-for="option in roleOptions" :key="option._id" :label="option.name"
                            :value="option._id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="user.phone" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"
                        @click="user._id == null ? addData(userFormRef) : updateData(userFormRef)">确定</el-button>
                    <el-button @click="userFormVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, reactive } from 'vue';
import { formateTime } from "@/utils/dataUtils";
import useRoleStore from "@/store/modules/role";
import { userInfoData } from '@/api/user/type';
const roleStore = useRoleStore()
import useUserStore from '@/store/modules/user';
import { FormInstance, FormRules } from 'element-plus';
let userStore = useUserStore()



// 删除消息提示框导入
import { ElMessage, ElMessageBox } from 'element-plus'


// 角色列表
let roleOptions = ref([])
// 用户数据列表
const users = ref<userInfoData[] | undefined>([])
// 用户数据列表
const user = ref<userInfoData | undefined>({
    _id: null,
    username: '',
    password: "",
    name: "",
    phone: "",
    role_id: ""
})

// 时间
const getTime = (_row: any, _column: any, cellValue: number) => {
    return formateTime(cellValue)
}

// 格式化角色名称
const formateRole = (_row: any, _column: any, cellValue: number) => {
    let role = roleOptions?.value?.find((item) => item._id == cellValue) || {}
    return role.name
}

// 获取角色列表
const getRoleList = () => {
    if (roleStore.roles?.length) {
        roleOptions.value = roleStore.roles
    } else {
        roleStore.roleList().then(() => {
            roleOptions.value = roleStore.roles
        })
    }
}


onMounted(() => {
    getRoleList(),
        getUserList()
})

// 点击编辑按钮返回的点击事件
const handleEdit = (_id: string) => {
    handlerAdd()
    userStore.getUserById(_id).then(reponse => {
        // 显示默认数据
        user.value = reponse

    })
}
// 编辑用户
const updateData = (formEl: FormInstance) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            userStore.updateUser(user.value as userInfoData).then(() => {
                userFormVisible.value = false
                getUserList()
            })
        }
    })
}
// 点击删除按钮
const handleDelete = (_id: string) => {
    ElMessageBox.confirm(
        // 提示的消息
        '确定要删除这个用户吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            // 成功走then
            userStore.deleteUser(_id).then(() => {
                getUserList()
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            })
        }).catch(() => {
            // 失败走catch
            return false
        })



}

const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
// const totalPage = ref(1)

const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getUserList()
}
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getUserList()

}
// 获取用户列表
const getUserList = () => {
    userStore.getUserList({ page: currentPage.value, size: pageSize.value }).then(response => {
        users.value = userStore.users
        total.value = (response?.total as number)
        // totalPage.value = Math.ceil(userStore.total/pageSize.value)
    })
}
const valuename = (rule: any, value: any, callback: any) => {
    rule = rule
    value = value.trim()
    const length = value && value.length
    const reg = /^[a-zA-Z0-9_]+$/
    if (value === '') {
        callback(new Error('请输入账号'))
    } else if (length < 4 || length > 12) {
        callback(new Error('长度在4到12个字符'))
    } else if (!reg.test(value)) {
        callback(new Error('账号只有英文字母数字及下划线组成'))
    } else {
        callback()
    }
}
// // 电话号码校验规则
const validatePhtne = (_rule: any, value: any, callback: any) => {
    value = value.trim()
    const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (value === '') {
        callback(new Error('请输入手机号码'))
    } else if (!phoneReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
    } else {
        callback()
    }

}


const rules = reactive<FormRules>({
    username: [
        { required: true, validator: valuename, trigger: ['blur', 'change'] },
    ],
    password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] },],
    name: [{ required: true, message: '请输入名称', trigger: ['blur', 'change'] },],
    role_id: [{ required: true, message: '请选择所属角色', trigger: ['blur', 'change'] },],
    phone: [{ required: true, validator: validatePhtne, trigger: ['blur', 'change'] },],
})

// 表单对象
const userFormRef = ref<FormInstance>()
const userFormVisible = ref(false)
// 点击添加按钮返回的点击事件
const handlerAdd = () => {
    // 重置user数据，防止添加了一个用户后不能再添加了
    user.value = {
        _id: null,
        username: "",
        password: "",
        name: "",
        phone: "",
        role_id: ""
    }
    // 表单显示
    userFormVisible.value = true
    // vue提供的方法，在DOM更新后再调用
    nextTick(() => {
        // 清除表单字段的值
        userFormRef.value.resetFields()
    });
}
// 添加用户：调用仓库的addUser方法
const addData = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            userStore.addUser(user.value as userInfoData).then(() => {
                userFormVisible.value = false
                getUserList()
            })
        }
    })

}
</script>


<style scoped></style>