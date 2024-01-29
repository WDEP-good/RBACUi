<template>
    <div>
        <!-- 查询条件 -->
        <el-form :inline="true" :model="searchMap" style="margin: 20px;" ref="searchFormRef">
            <el-form-item prop="teacher_id">
                <el-select v-model="searchMap.teacher_id" placeholder="请选择教师" style="width: 160px;">
                    <el-option v-for="option in teacherOptions" :key="option._id" :label="option.name"
                        :value="option._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="manager_id">
                <el-select v-model="searchMap.manager_id" type="date" placeholder="请选择学管" style="width: 160px;">
                    <el-option v-for="option in managerOptions" :key="option._id" :label="option.name"
                        :value="option._id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button @click="resetForm(searchFormRef)">重置</el-button>
                <el-button type="primary" @click="handlerAdd">添加班级</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="classes" style="width: 100%;height: 360px;">
            <el-table-column label="序号" type="index" width="180"></el-table-column>
            <el-table-column label="班级名称" width="180" prop="classname"></el-table-column>
            <el-table-column label="教师名称" width="180" prop="teacher_id" :formatter="formatTeacher"></el-table-column>
            <el-table-column label="学管名称" width="180" prop="manager_id" :formatter="formatManager"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total,sizes,prev,pager,next,jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 添加弹出框 -->
        <el-dialog v-model="classFormVisible" title="添加班级" width="500px">
            <el-form :model="classformInfo" ref="classFormRef" label-width="100px" style="width:400px" :rules="rules">
                <el-form-item label="班级名称" prop="classname">
                    <el-input v-model="classformInfo.classname" />
                </el-form-item>
                <el-form-item label="教师名称" prop="teacher_id">
                    <el-select v-model="classformInfo.teacher_id" placeholder="请选择教师名称">
                        <el-option v-for="option in teacherOptions" :label="option.name" :key="option._id"
                            :value="option._id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="学管名称" prop="manager_id">
                    <el-select v-model="classformInfo.manager_id" placeholder="请选择学管名称">
                        <el-option v-for="option in managerOptions" :label="option.name" :key="option._id"
                            :value="option._id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="classFormVisible = false">取消</el-button>
                    <el-button type="primary"
                        @click="classformInfo._id == null ? addClass(classFormRef) : updateClass(classFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
// 引入班级仓库
import useClassStore from '@/store/modules/class';
// 引入用户小仓库
import useUserStore from '@/store/modules/user';
// 引入角色小仓库
import useRoleStore from '@/store/modules/role';
import { classInfoData } from '@/api/class/type';
import { roleInfoData } from '@/api/role/type';
import { userInfoData } from '@/api/user/type';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

let calssStore = useClassStore();
let UserStore = useUserStore()
let roleStore = useRoleStore()
let classes = ref<classInfoData[] | undefined>([])
const searchFormRef = ref<FormInstance>()
// 添加班级弹窗默认关闭
const classFormVisible = ref(false)
// 初始化表单数据
let classformInfo = ref({
    _id: null,
    classname: '',
    teacher_id: '',
    manager_id: ''
})
// 角色列表
let roleOptions = ref<roleInfoData[] | undefined>([])
let userOptions = ref<userInfoData[] | undefined>([])
// 角色为教师的id
const teacher_role_id = ref<string | undefined>('')
// 角色为学管的id
const manager_role_id = ref<string | undefined>('')
// 教师列表
const teacherOptions = ref<userInfoData[]>([])
const managerOptions = ref<userInfoData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const totalPage = ref(1)
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getClassList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getClassList()
}
const handleEdit = (_id: string) => {
    handlerAdd()
    calssStore.getClassById(_id).then(response => {
        (classformInfo.value as classInfoData) = response
        getClassList()

    })
}
// 点击删除按钮
const handleDelete = (classId: string) => {
    ElMessageBox.confirm(
        '确定要删除此条数据吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            console.log(classId);

            calssStore.deleteClass(classId).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                getClassList()
            })
        })
        .catch(() => {
            return false
        })

}
// 查询条件对象
const searchMap = reactive({
    teacher_id: "",
    manager_id: ""
})
// 获取班级信息
const getClassList = () => {
    calssStore.getClassList({ page: currentPage.value, size: pageSize.value, searchMap }).then((response) => {
        classes.value = calssStore.classes
        total.value = response?.total as number
        totalPage.value = total.value / pageSize.value
    })
}
// 获取角色列表
const getRoleList = () => {
    if (roleStore.roles?.length) {
        roleOptions.value = roleStore.roles
        roleOptions.value?.forEach(item => {
            if (item.name == "教师") {
                teacher_role_id.value = item._id
            } else if (item.name == "学管") {
                manager_role_id.value = item._id
            }
        })
    } else {
        roleStore.roleList().then(() => {
            roleOptions.value = roleStore.roles
            roleOptions.value?.forEach((item) => {
                if (item.name == "教师") {
                    teacher_role_id.value = item._id
                } else if (item.name == "学管") {
                    manager_role_id.value = item._id
                }
            })
        })
    }
}
// 获取用户列表
const getUserList = () => {
    if (UserStore.users?.length) {
        userOptions.value = UserStore.users
        userOptions.value?.forEach((item) => {
            if (item.role_id == teacher_role_id.value) {
                teacherOptions.value.push(item)
            } else if (item.role_id == manager_role_id.value) {
                managerOptions.value.push(item)
            }
        })
    } else {
        UserStore.getUserAll().then(() => {
            userOptions.value = UserStore.users
            userOptions.value?.forEach((item) => {
                if (item.role_id == teacher_role_id.value) {
                    teacherOptions.value.push(item)
                } else if (item.role_id == manager_role_id.value) {
                    managerOptions.value.push(item)
                }
            })
        })

    }
}
// 表单校验规则


//格式化教师
const formatTeacher = (_row: any, _colum: any, cellValue: any) => {
    let teacher = teacherOptions?.value?.find((item) => item._id == cellValue)
    console.log(teacher);

    return teacher.name
}
// 格式化学管名称
const formatManager = (_row: any, _colum: any, cellValue: any) => {
    let manger = managerOptions?.value?.find((item) => item._id == cellValue)
    return manger.name
}
const searchData = () => {
    getClassList()

}
// 重置按钮
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
// 初始化表单对象
const classFormRef = ref<FormInstance>()
// 点击添加按钮
const handlerAdd = () => {
    // 添加窗口显示
    classFormVisible.value = true
    nextTick(() => {
        // 清空表单数据，nextTick在Dom元素加载完毕后执行
        classFormRef.value.resetFields()
    });
    classformInfo.value = {
        _id: null,
        classname: "",
        teacher_id: "",
        manager_id: ""

    }
}
// 更新班级
const updateClass = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            calssStore.updateClass(classformInfo.value as classInfoData).then(() => {
                classFormVisible.value = false
                getClassList()
            })
        } else {
            return false
        }
    })

}
const rules = reactive<FormRules>({
    classname: [{ required:true,message:"请输入班级名称", trigger: 'blur' }],
    teacher_id: [{ required:true,message:"请选择授课教师", trigger: 'blur' }],
    manager_id: [{ required:true,message:"请选择学管名称", trigger: 'blur' }],
})
// 添加班级
const addClass = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            calssStore.addClass(classformInfo.value as classInfoData).then(() => {
                classFormVisible.value = false
                getClassList()
            }).catch(err => {
                ElMessage({
                    message: err.message,
                    type: 'error',
                })

            })
        } else {
            return false
        }
    })

}
onMounted(() => {
    getRoleList()
    getUserList()
    getClassList()
})
</script>

<style scoped></style>@/store/modules/class