<template>
    <div class="studentupdata" style="margin-top:20px">
        <el-form :model="studentformInfo" ref="addstudentFormRef" abel-width="100px" style="width:400px">
            <!-- 姓名 -->
            <el-form-item label="学员姓名" prop="name">
                <el-input v-model="studentformInfo.name" placeholder="请输入学员名称" />
            </el-form-item>
            <!-- 性别 -->
            <el-form-item label="性别" prop="gender">
                <el-select v-model="studentformInfo.gender" placeholder="请选择性别">
                    <el-option v-for="options in genderOpions" :key="options._id" :label="options.name" :value="options._id" />
                </el-select>
            </el-form-item>
            <!-- 所在学校 -->
            <el-form-item label="所在学校" prop="school"> 
                <el-autocomplete v-model="studentformInfo.school" :fetch-suggestions="querySearchSchool" placeholder="请输入学校" />
            </el-form-item>
            <!-- 所在专业 -->
            <el-form-item label="专业" prop="major">
                <el-autocomplete v-model="studentformInfo.major" :fetch-suggestions="querySearchMajor" placeholder="所在学校" />
            </el-form-item>
            <!-- 年级 -->
            <el-form-item label="年级">
                <el-input v-model="studentformInfo.grade" placeholder="请输入年级" />
            </el-form-item>
            <!-- 学历 -->
            <el-form-item label="学历">
                <el-input v-model="studentformInfo.education" placeholder="请输入学历" />
            </el-form-item>
            <!-- 学习方向 -->
            <el-form-item label="学习方向">
                <el-input v-model="studentformInfo.direction" placeholder="请输入学习方向" />
            </el-form-item>
            <!-- 身法证号码 -->
            <el-form-item label="身份证号">
                <el-input v-model="studentformInfo.id_number" placeholder="请输入身份证号" />
            </el-form-item>
            <!-- 电话号码 -->
            <el-form-item label="电话号码">
                <el-input v-model="studentformInfo.phone" placeholder="请输入电话号码" />
            </el-form-item>
            <!-- 家长姓名 -->
            <el-form-item label="家长姓名">
                <el-input v-model="studentformInfo.parent" placeholder="请输入家长姓名" />
            </el-form-item>
            <!-- 家长联系电话 -->
            <el-form-item label="家长联系电话">
                <el-input v-model="studentformInfo.parent_phone" placeholder="请输入家长联系电话" />
            </el-form-item>
            <!-- 家庭住址 -->
            <el-form-item label="家庭住址">
                <el-input v-model="studentformInfo.address" placeholder="请输入家庭住址" />
            </el-form-item>
            <!-- QQ -->
            <el-form-item label="QQ">
                <el-input v-model="studentformInfo.qq" placeholder="请输入QQ" />
            </el-form-item>
            <!-- 所在班级 -->
            <el-form-item label="所在班级">
                <el-input v-model="studentformInfo.class" placeholder="请输入所在班级" />
            </el-form-item>
            <!-- 入学时间 -->
            <el-form-item label="入学时间">
                <el-input v-model="studentformInfo.admission_date" placeholder="请输入入学时间" />
            </el-form-item>
            <!-- 所在班级 -->
            <el-form-item label="所在班级">
                <el-input v-model="studentformInfo.name" placeholder="请输入所在班级" />
            </el-form-item>
            <!-- 教师名称 -->
            <el-form-item label="教师名称">
                <el-select v-model="studentformInfo.teacher_id" placeholder="请选择授课教师">
                    <el-option v-for="options in teacherOptions" :label="options.name" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <!-- 学管 -->
            <el-form-item label="学管" prop="manager_id">
                <el-select v-model="studentformInfo.manager_id" placeholder="请选择学管">
                    <el-option v-for="options in managerOptions" :label="options.name" :value="options._id"
                        :key="options._id" />
                </el-select>
            </el-form-item>
            <!-- 照片 -->
            <el-form-item label="照片">
                <el-input v-model="studentformInfo.pictures" placeholder="请输入照片" />
            </el-form-item>
            <!-- 备注信息 -->
            <el-form-item label="备注信息">
                <el-input v-model="studentformInfo.note" placeholder="请输入备注信息" />
            </el-form-item>
            <!-- 确定/取消按钮 -->
            <el-form-item>
                <el-button @click="quxiao">取消</el-button>
                <el-button type="primary" @click="addDate(addstudentFormRef)">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from 'vue'
import type { userInfoData } from '@/api/user/type';
import type { roleInfoData } from '@/api/role/type';
import { schoolInfoData } from '@/api/school/type';
// 导入路由对象
import { useRouter } from 'vue-router';
// 定义路由对象
let router = useRouter();
// 导入学校小仓库
import useSchoolStore from '@/store/modules/school';
const schoolStore = useSchoolStore();
// 消息提示框导入
import { ElMessage, type FormInstance } from 'element-plus'
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
let roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 引入班级小仓库
import useClassStore from '@/store/modules/class'
let classStore = useClassStore();
// 引入专业小仓库
import useMajorStore from '@/store/modules/major';
const majorStore = useMajorStore();
// 引入学员小仓库
import useStudentStore from '@/store/modules/student'
import { studentInfoData } from '@/api/student/type';
import { classInfoData } from '@/api/class/type';
let studentStore = useStudentStore();
// 初始化底部分页栏
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(1)
const totalPage = ref(0)
// 添加学员表单对象
const addstudentFormRef = ref<FormInstance>()
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
// 学校列表
let schoolOptions = ref<schoolInfoData[]>([])
// 学员列表
const students = ref<studentInfoData[] | undefined>([])
// 角色为教师的id
let teacher_role_id = ref('')
// 角色为学管的id
let manager_role_id = ref('')
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
const getMajorAll = () => {
    if (majorStore.majors?.length) {
        majorOpions.value = majorStore.majors
    } else {
        majorStore.getMajorAll().then(() => {
            majorOpions.value = majorStore.majors
        })
    }
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
// 获取所有学校
const getSchoolAll = () => {
    if (schoolStore.schools?.length) {
        schoolOptions.value = schoolStore.schools
    } else {
        schoolStore.getSchoolAll().then(() => {
            schoolOptions.value = schoolStore.schools
        })
    }
}
// 点击确定按钮
const addDate = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            studentStore.addStudent(studentformInfo.value).then(() => {
                handleAdd()
                formEl.resetFields()
                getStudentList()
                router.replace()
            })
        } else {
            return false
        }
    })

}
// 点击取消按钮：返回上一个页面
const quxiao = () => {
    router.replace()
}

const handleAdd = () => {
    router.push('/student/update/-1')
    getStudentList()
    nextTick(() => {
        addstudentFormRef.value.resetFields()
    });
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

// 查询按钮
// const searchData = () => {
//     currentPage.value = 1
//     getStudentList()
// }
// // 重置按钮
// const resetForm = (formEl: FormInstance | undefined) => {
//     if (!formEl) return
//     formEl.resetFields()
// }
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

// // 年级数据格式化列表
// let gradeOpions = ref<FilterData[]>([
//     { _id: "1", name: "大一" },
//     { _id: "2", name: "大二" },
//     { _id: "3", name: "大三" },
//     { _id: "4", name: "大四" },
//     { _id: "5", name: "在职研究生" },
// ])
// // 学历数据格式化列表
// let education = ref<FilterData[]>([
//     { _id: "1", name: "大专" },
//     { _id: "2", name: "本科" },
//     { _id: "3", name: "硕士" },
//     { _id: "4", name: "社会" },
// ])
// //学习方向数据格式化列表
// let directionOpions = ref<FilterData[]>([
//     { _id: "1", name: "前端" },
//     { _id: "2", name: "后端" },
//     { _id: "3", name: "运维" },
//     { _id: "4", name: "测试" },
//     { _id: "5", name: "其他" },
// ])
// 要过滤的显示数据
// const dataFilter = (_id: string, options: any) => {
//     const obj = options?.find(item => item._id == _id)
//     return obj ? obj.name : ''
// }
// // 过滤班级数据
// const classFilter = (_id: string, options: any) => {
//     const obj = options?.find(item => item._id == _id)
//     return obj ? obj.classname : ''
// }

const searchMap = reactive({
    name: '',
    direction: '',
    teacher_id: '',
    manager_id: '',
    class: ''
})
// 更新学员信息
// const updateStudent = (formEl: FormInstance | undefined) => {
//     if (!formEl) return
//     formEl.validate((valid) => {
//         if (valid) {
//             studentStore.updateStudent(studentformInfo.value).then(() => {
//                 studenteditFormVisible.value = false
//                 formEl.resetFields()
//                 getStudentList()
//                 ElMessage({
//                     type: 'success',
//                     message: '更新信息成功！'
//                 })
//             })
//         } else {
//             return false
//         }
//     })

// }
// 处理学校自动补全输入框
const querySearchSchool = (queryString: string, cb: any) => {

    
    schoolOptions.value.forEach(item => {
        console.log(item);
        return item.vaule = item.schoolname
    })
    const results = queryString
        ? schoolOptions.value.filter(createFilter(queryString))
        : schoolOptions.value
    cb(results)
}
// 处理专业自动补全输入框
const querySearchMajor = (queryString: string, cb: any) => {
    majorOpions.value.forEach(item => {
        return item.vaule = item.majorname
    })
    const results = queryString ? majorOpions.value.filter(createFilter(queryString)) : majorOpions.value
    cb(results)
}
const createFilter = (queryString: string) => {
    return (restaurant: any) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
}

onMounted(() => {
    getClassList()
    getRoleList()
    getUserList()
    getSchoolAll()
    getStudentList()
    getMajorAll()
})

</script>

<style scoped>
.el-form {

    width: 300px;
}
</style>