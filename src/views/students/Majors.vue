<template>
    <div>
        <div>
            <el-button type="primary" @click="handelAdd">新增专业</el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="majors" style="width: 100%;height: 380px;" border>
            <el-table-column label="序号" type="index" prop="date" />
            <el-table-column label="专业名称" prop="majorname" />
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
        <!-- 添加或编辑对话框 -->
        <el-dialog v-model="majorFormVisible" title="添加专业" width="500px">
            <el-form :model="major" ref="majorFormRef" label-width="100px" label-position="right" style="width: 400px;"
                :rules="rules">
                <el-form-item label="专业名称" prop="majorname">
                    <el-input v-model="major.majorname" placeholder="请输入专业名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="majorFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="major._id ==null?addData(majorFormRef):majorUpdata(majorFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, nextTick, onMounted } from 'vue';
// 引入专业仓库
import useMajorStore from '@/store/modules/major.ts';
import type { FormInstance, FormRules } from 'element-plus'
import { majorInfoData } from '@/api/major/type';
import { ElMessage, ElMessageBox } from 'element-plus'
const majorFormRef = ref<FormInstance>()
let majorStore = useMajorStore();
// 专业数据列表
const majors = ref<majorInfoData[] | undefined>([])
// 新增/编辑专业数据:表单数据
let major = ref<majorInfoData | undefined>({
    _id: null,
    majorname: '',
})
// 添加用户弹窗默认不显示
const majorFormVisible = ref(false)

// 当前页面
const currentPage = ref(1)
// 一页显示多少条数据
const pageSize = ref(5)
// 总条数
const total = ref(0)
// 总页数
const totalPage = ref(1)
// 表单2校验规则
const rules = reactive<FormRules>({
    majorname: [{ required: true, message: '请输入专业名称', trigger: 'blur' }]
})
// 打开添加用户对话框
const handelAdd = () => {
    majorFormVisible.value = true
    major.value = {
        _id: null,
        majorname: ''
    }
    nextTick(() => {
        majorFormRef.value?.resetFields()
    });
}

// 获取专业列表
const getMajorList = () => {
    majorStore.getMajorList({ page: currentPage.value, size: pageSize.value }).then(respones => {
        majors.value = majorStore.majors
        total.value = respones?.total as number
        totalPage.value = total.value / pageSize.value

    })
}
const handleSizeChange = (val: number) => {
   pageSize.value = val
   getMajorList()

}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getMajorList()
}
onMounted(() => {
    getMajorList()
})


const majorUpdata = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            majorStore.updateMajor(major.value as majorInfoData).then(() => {
                majorFormVisible.value = false
                getMajorList()

            })
        }
    })

}

// 编辑按钮
const handleEdit = (_id: string) => {
    handelAdd()
    majorStore.getMajorById(_id).then(response => {
        major.value = response
    })
}
// 删除按钮
const handleDelete = (_id: string) => {
    ElMessageBox.confirm(
        '是否要删除此条数据',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            majorStore.deleteMajor(_id).then(() => {
                ElMessage.success('删除成功')
                getMajorList()

            })
        })
        .catch(() => {
            return false
        })
}
// 点击按钮确定添加
const addData = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            majorStore.addMajor(major.value as majorInfoData).then(() => {
                majorFormVisible.value = false
                getMajorList()

            })
        }
    })

}
</script>

<style scoped></style>