<template>
  <div class="header">
    <a href="#/">
      <img src="@/assets/vue.svg" class="logo" />
      <span class="title">RBAC学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand" trigger="click" class="a">
      <span class="el-dropdown-link">
        {{ useStore.user?.username }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="date">{{ currentTime }}</span>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" v-model="dialogTableVisible" width="500px">
      <el-form ref="userFormRef" :model="userForm" label-position="right" :rules="rules" label-width="100px"
        style="width: 400px;">
        <el-form-item label="原始密码" prop="oldpass">
          <el-input v-model="userForm.oldpass" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input v-model="userForm.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePwd(userFormRef)">确定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    
  </div>
</template>
<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { formateTime } from '@/utils/dataUtils'
import { ref, onMounted, reactive, nextTick } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { FormInstance, FormRules } from 'element-plus'
import { reqCheckPwd, reqUpdatePwd } from '@/api/user'
// 使用路由
const router = useRouter()
// 使用仓库
let useStore = useUserStore()

const handleCommand = (command: string | number | object) => {
  switch (command) {
    case 'a':
      handlePwd()
      break;
    case 'b':
      // 如果是b则表示点击了退出登录，调用退出登录函数
      handleLogout()
      break;
    default:
      break;
  }
}
// 退出登录函数
const handleLogout = () => {
  // 调用store仓库中的删除方法删除登录信息
  useStore.removeUser()
  // 退出登录的该用户信息数据为空则返回到登录页面，注意因为使用的是replace
  if (!useStore.user) {
    router.push('/')
  }
}
// 定义一个currentTime响应数据显示时间
let currentTime = ref<string>('')
const getTime = () => {
  // 使用setInterval计数器，每隔1000秒重新赋值
  setInterval(() => {
    // ref响应数要赋值给value
    // formateTime传入当前的时间戳
    currentTime.value = formateTime(Date.now())
  }, 1000)
}
// 在组件挂载后开启getTime函数显示时间
onMounted(() => {
  getTime()
})


// 修改密码弹出框是否显示
const dialogTableVisible = ref(false)
// 表单元素对象，需要和el-form的ref属性值对应
const userFormRef = ref<FormInstance>()

// 收集表单内容
const userForm = reactive({
  oldpass: '',
  pass: '',
  checkPass: ''
})

// 自定义校验规则：检测旧密码
var validateOldPass = (rule: any, value: any, callback: any) => {
  rule = rule
  reqCheckPwd({ userId: (useStore.user?._id as string), password: value }).then((response) => {
    if (response.status == 0) {
      callback()
    } else {
      callback(new Error(response.msg))
    }

  })
}
// 自定义校验规则：检测新密码
var validatePass = (rule: any, value: any, callback: any) => {
  rule = rule
  if (value !== userForm.pass) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }

}

// 配置校验规则
const rules = reactive<FormRules>({
  // 旧密码
  oldpass: [
    {
      required: true,
      validator: validateOldPass,
      trigger: ['blur', 'change']
    }
  ],
  // 新密码
  newpass: [{
    required: true,
    message: "请输入新密码",
    trigger: 'blur'
  }],
  // 重复新密码
  checkPass: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change'
    }
  ]
})

// 打开修改密码弹窗
const handlePwd = () => {
  dialogTableVisible.value = true
  nextTick(() => {
    //@ts-ignore
    userFormRef.value.resetFields()
    console.log("userFormRef.value", userFormRef.value);

  })
}


// 更新密码
// 点击确定按钮
// formEl表单元素对象
const updatePwd = (formEl: FormInstance | undefined) => {
  // 如果
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      reqUpdatePwd({ userId: (useStore.user?._id as string), password: userForm.pass }).then((response) => {
        if (response.status == 0) {
          handleLogout();
          // 关闭弹窗
          dialogTableVisible.value = false
        }
      }

      )
    } else {
      return false
    }
  })
}




</script>

<style scoped>
.logo {
  width: 25px;
  height: 25px;
  padding: 12px 10px 0 40px;
}

.title {
  position: absolute;
  color: #fff;
}

.a {
  float: right;
  margin-right: 40px;
  height: 50px;
  line-height: 50px;
 
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.date {
  float: right;
  margin-right: 20px;
}
</style>
