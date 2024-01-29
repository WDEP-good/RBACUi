<template>
    <div>
        <!-- 选择器 -->
        <el-form :inline="true" :model="searchMap" style="margin: 20px 0;" ref="searchFormRef">
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="根据姓名查询" style="width: 200px;" />
            </el-form-item>
            <el-form-item prop="direction" style="width: 200px;">
                <el-select v-model="searchMap.direction" placeholder="根据学习方向查询">
                    <el-option v-for="options in directionOpions" :label="options.name" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="class" style="width: 200px;">
                <el-select v-model="searchMap.class" placeholder="根据班级查询">
                    <el-option v-for="options in classOptions" :label="options.classname" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="teacher_id" style="width: 200px;">
                <el-select v-model="searchMap.teacher_id" placeholder="根据授课教师查询">
                    <el-option v-for="options in teacherOptions" :label="options.name" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="manager_id" style="width: 200px;">
                <el-select v-model="searchMap.manager_id" placeholder="根据学管查询">
                    <el-option v-for="options in managerOptions" :label="options.name" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button @click="resetForm(searchFormRef)">重置</el-button>
                <el-button type="primary" @click="handleAdd">添加学生</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="students" style="width: 100%" border>
            <el-table-column type="expand">
                <template #default="props">
                    <div>
                        <p>学生姓名: {{ props.row.name }}</p>
                        <p>性别: {{ dataFilter(props.row.gender, genderOpions) }}</p>
                        <p>所在学校: {{ props.row.school }}</p>
                        <p>专业: {{ props.row.major }}</p>
                        <p>年级: {{ dataFilter(props.row.grade, gradeOpions) }}</p>
                        <p>学历: {{ dataFilter(props.row.education, education) }}</p>
                        <p>学习方向: {{ dataFilter(props.row.direction, directionOpions) }}</p>
                        <p>身份证号码: {{ props.row.id_number }}</p>
                        <p>电话号码: {{ props.row.phone }}</p>
                        <p>家长姓名: {{ props.row.parent }}</p>
                        <p>家长联系电话: {{ props.row.parent_phone }}</p>
                        <p>家庭住址: {{ props.row.address }}</p>
                        <p>QQ: {{ props.row.qq }}</p>
                        <p>所在班级: {{ classFilter(props.row.class, classOptions) }}</p>
                        <p>入学时间: {{ props.row.admission_date }}</p>
                        <p>授课教师: {{ dataFilter(props.row.teacher_id, teacherOptions) }}{{ teacherOptions }}</p>
                        <p>学管: {{ dataFilter(props.row.manager_id, managerOptions) }}</p>
                        <p>照片: {{ props.row.pictures }}</p>
                        <p>备注信息: {{ props.row.note }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="学员姓名" prop="name"></el-table-column>
            <el-table-column label="性别" prop="gender">
                <template #default="scope">
                    {{ dataFilter(scope.row.gender, genderOpions) }}
                </template>
            </el-table-column>
            <el-table-column label="学习方向" prop="direction">
                <template #default="scope">
                    {{ dataFilter(scope.row.direction, directionOpions) }}
                </template>
            </el-table-column>
            <el-table-column label="联系电话" prop="phone"></el-table-column>
            <el-table-column label="所在班级" prop="class">
                <template #default="scope">
                    {{ classFilter(scope.row.class, classOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="入学时间" prop="admission_date"></el-table-column>
            <el-table-column label="授课教师" prop="teacher_id">
                <template #default="scope">
                    {{ dataFilter(scope.row.teacher_id, teacherOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="学管" prop="manager_id">
                <template #default="scope">
                    {{ dataFilter(scope.row.manager_id, managerOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :totalPage="totalPage"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { userInfoData } from '@/api/user/type';
import type { roleInfoData } from '@/api/role/type';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
let roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 引入班级小仓库
import useClassStore from '@/store/modules/class'
let classStore = useClassStore();
// 引入学员小仓库
import useStudentStore from '@/store/modules/student'
import { studentInfoData } from '@/api/student/type';
import { classInfoData } from '@/api/class/type';
let studentStore = useStudentStore();
// 表单内容
const searchFormRef = ref()
// 初始化底部分页栏
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(1)
const totalPage = ref(0)
// 添加学员表单对象
// const addstudentFormRef = ref<FormInstance>()
// 添加表单对象内容
const studentformInfo = ref<studentInfoData>({
    _id: null,
    name: '',
    gender: '', //性别
    school: '', //学校
    major: '',  //专业
    grade: '',  //年级
    education: '',  //学历
    direction: '',   //学习方向
    id_number: '',  //身份证号
    phone: '',   //电话号码
    parent: '',   //家长姓名
    parent_phone: '',  //家长联系电话
    address: '',  //家庭住址
    qq: '',  //QQ号码
    class: '',    //所在班级
    admission_date: '', //入学时间
    teacher_id: '',  //教师id
    manager_id: '', //学管id
    pictures: [], //照片数量
    note: '', //备注信息
    __v: null
})
// 弹窗默认关闭
const studentFormVisible = ref(false)
// 编辑弹窗默认关闭
const studenteditFormVisible = ref(false)
// 角色列表
let roleOptions = ref<roleInfoData[]>([])
// 班级列表
let classOptions = ref<classInfoData[]>([])
// 用户列表
let userOptions = ref<userInfoData[]>([])
// 教师列表
let teacherOptions = ref<userInfoData[]>([])
// 学管列表
let managerOptions = ref<userInfoData[]>([])
// 学员列表
const students = ref<studentInfoData[] | undefined>([])
// 引入专业小仓库
import useMajorStore from '@/store/modules/major';
const majorStore = useMajorStore();
// 角色为教师的id
let teacher_role_id = ref('')
// 角色为学管的id
let manager_role_id = ref('')
// 专业列表
let majorOpions = ref<majorInfoData[]>([])
// 获取角色列表
const getRoleList = () => {
    if (roleStore.roles?.length) {
        roleOptions.value = roleStore.roles
        roleOptions.value?.forEach(item => {
            if (item.name == '教师') {
                teacher_role_id.value = item._id
            } else if (item.name == '学管') {
                manager_role_id.value = item._id
            }
        })
    } else {
        roleStore.roleList().then(() => {
            roleOptions.value = roleStore.roles
            roleOptions.value?.forEach(item => {
                if (item.name == '教师') {
                    teacher_role_id.value = item._id
                } else if (item.name == '学管') {
                    manager_role_id.value = item._id
                }
            })
        })
    }
}
// 获取所有专业
const getMajorAll = ()=>{
    if(majorStore.majors?.length){
        majorOpions.value = majorStore.majors
    }else{
        majorStore.getMajorAll().then(()=>{
            majorOpions.value = majorStore.majors
        })
    }
} 


// 定义路由对象
import {useRouter} from 'vue-router';
import { majorInfoData } from '@/api/major/type';
let router = useRouter();
const handleAdd = () => {
    router.push('/student/update/-1')
    getStudentList()
    studentformInfo.value = {
        _id: null,
        name: '',
        gender: '', //性别
        school: '', //学校
        major: '',  //专业
        grade: '',  //年级
        education: '',  //学历
        direction: '',   //学习方向
        id_number: '',  //身份证号
        phone: '',   //电话号码
        parent: '',   //家长姓名
        parent_phone: '',  //家长联系电话
        address: '',  //家庭住址
        qq: '',  //QQ号码
        class: '',    //所在班级
        admission_date: '', //入学时间
        teacher_id: '',  //教师id
        manager_id: '', //学管id
        pictures: [], //照片数量
        note: '', //备注信息
        __v: null
    }
    studentFormVisible.value = true
}
// 获取学员列表
const getStudentList = () => {
    studentStore.getStudentList({ page: currentPage.value, size: pageSize.value, searchMap }).then(response => {
        students.value = studentStore.students
        total.value = response.total as number
        totalPage.value = total.value / pageSize.value
    })
}
// 获取用户列表
const getUserList = () => {
    if (userStore.users?.length) {
        userOptions.value = userStore.users
        userOptions.value?.forEach(item => {
            if (item.role_id == teacher_role_id.value) {
                teacherOptions.value.push(item)
            } else if (item.role_id == manager_role_id.value) {
                managerOptions.value.push(item)
            }
        })
    } else {
        userStore.getUserAll().then(() => {
            userOptions.value = userStore.users
            userOptions.value?.forEach(item => {
                if (item.role_id == teacher_role_id.value) {
                    teacherOptions.value.push(item)
                } else if (item.role_id == manager_role_id.value) {
                    managerOptions.value.push(item)
                }
            })
        })

    }
}
// 查询按钮
const searchData = () => {
    currentPage.value = 1
    getStudentList()
}
// 重置按钮
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
// 获取班級数据
const getClassList = () => {
    if (classStore.classes?.length) {
        classOptions.value = classStore.classes
    } else {
        classStore.getClassAll().then(() => {
            classOptions.value = classStore.classes
        })
    }
}
// 性別/年级/学历/学习方向数据类型
interface FilterData {
    _id: string,
    name: string
}
// 性别数据格式化列表
let genderOpions = ref<FilterData[]>([
    { _id: "0", name: "男" },
    { _id: "1", name: "女" },
])

// 年级数据格式化列表
let gradeOpions = ref<FilterData[]>([
    { _id: "1", name: "大一" },
    { _id: "2", name: "大二" },
    { _id: "3", name: "大三" },
    { _id: "4", name: "大四" },
    { _id: "5", name: "在职研究生" },
])
// 学历数据格式化列表
let education = ref<FilterData[]>([
    { _id: "1", name: "大专" },
    { _id: "2", name: "本科" },
    { _id: "3", name: "硕士" },
    { _id: "4", name: "社会" },
])
//学习方向数据格式化列表
let directionOpions = ref<FilterData[]>([
    { _id: "1", name: "前端" },
    { _id: "2", name: "后端" },
    { _id: "3", name: "运维" },
    { _id: "4", name: "测试" },
    { _id: "5", name: "其他" },
])
// 要过滤的显示数据
const dataFilter = (_id: string, options: any) => {
    const obj = options?.find(item => item._id == _id)
    return obj ? obj.name : ''
}
// 过滤班级数据
const classFilter = (_id: string, options: any) => {
    const obj = options?.find(item => item._id == _id)
    return obj ? obj.classname : ''
}

const searchMap = reactive({
    name: '',
    direction: '',
    teacher_id: '',
    manager_id: '',
    class: ''
})

onMounted(() => {
    getClassList()
    getRoleList()
    getUserList()
    getStudentList()
    getMajorAll()
})
// 点击编辑按钮
const handleEdit = (_id: string) => {
    studentStore.getStudentById(_id).then(response => {
        studentformInfo.value = response
        studenteditFormVisible.value = true
    })

}

// 删除按钮
const handleDelete = (_id: string) => {
    ElMessageBox.confirm(
        '确定要删除这条数据吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
            studentStore.deleteStudent(_id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功！',

                })
                getStudentList()
            })
        })

}

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
</script>
<style scoped></style>