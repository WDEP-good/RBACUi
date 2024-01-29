<template>
    <div>
        <el-button type="primary" @click="handelAdd">添加学校</el-button>
        <!-- 显示表格 -->
        <el-table :data="schools" style="width: 100%;height: 380px;" border>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="schoolname" label="学校名称" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row._id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total,sizes,prev,next,jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 添加学校对话框 -->
        <el-dialog v-model="schoolFormVisible" title="添加学校" width="500px">
            <el-form :model="school" label-width="100px" label-position="right" style="width: 400px;" :rules="rules"
                ref="schoolFormRef">
                <el-form-item label="用户名" prop="schoolname">
                    <el-input v-model="school.schoolname" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"
                        @click="school._id == null ? addData(schoolFormRef) : updateData(schoolFormRef)">确定</el-button>
                    <el-button @click="schoolFormVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
// import type {Form} from 'module';
// import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
// 引入数据类型
import type { schoolInfoData } from '@/api/school/type';
// 引入学校小仓库
import useSchoolStore from '@/store/modules/school';
import { ElMessage, ElMessageBox } from 'element-plus'
let schoolStore = useSchoolStore()
// 学校数据列表
const schools = ref<schoolInfoData[] | undefined>([])
// 表单获取的数据类型
let school = ref<schoolInfoData | undefined>({
    _id: null,
    schoolname: ''
})
// 当前页面
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)   //总条数
const totalPage = ref(1)   //总页数

onMounted(() => {
    getSchoolList()
})

// 默认弹窗不显示
const schoolFormVisible = ref(false)
// 表单对象
const schoolFormRef = ref<FormInstance>()


// 获取学校列表
const getSchoolList = () => {
    schoolStore.getSchoolList({ page: currentPage.value, size: pageSize.value }).then(res => {
        schools.value = schoolStore.schools
        total.value = res?.total as number
        totalPage.value = total.value / pageSize.value

    })
}

// 显示条数发生变化的时候执行
const handleSizeChange = (val: number) => {
    pageSize.value = val
    getSchoolList()
}
const rules = reactive<FormRules>({
    schoolname: [{ required: true, message: "请输入学校名称", trigger: 'blur' }]
})

const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getSchoolList()

}

// 编辑按钮
const handleEdit = (_id: string) => {
    handelAdd()
    schoolStore.getSchoolById(_id).then(res => {
        school.value = res
    })
}
// 删除按钮
const handleDelete = (_id: string) => {
    ElMessageBox.confirm(
        "确定要删除此条数据吗？",
        "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }
    ).then(() => {
        schoolStore.deleteSchool(_id).then(() => {
            schoolFormVisible.value = false
            ElMessage.success('删除成功')
            getSchoolList()
        }).catch(() => {
            return false
        })

    })

}
const handelAdd = () => {
    schoolFormVisible.value = true
    school.value = {
        _id: null,
        schoolname: ''
    }
    nextTick(() => {
        schoolFormRef.value?.resetFields()
    })
}
const addData = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            schoolStore.addSchool(school.value as schoolInfoData).then(() => {
                ElMessage.success('添加成功')
                schoolFormVisible.value = false
                getSchoolList()
            })

        }
    })

}

const updateData = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {


        }
    })

}


</script>

<style scoped></style>