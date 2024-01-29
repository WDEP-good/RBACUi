<template>
  <div class="login-container">
    <!-- 通过rules属性传入验证规则 -->
    <!-- model：表单的数据对象 -->
    <!-- 这里的ref的作用：Vue 为简化DOM获取方法提出了ref 属性和$refs 对象。
      一般的操作流程是:ref 绑定控件，$refs 获取控件，ruleFormRef就是我们定义并使用各个属性的必要条件 -->
    <el-form
      :model="from"
      ref="ruleFormRef"
      label-width="80px"
      class="login-from"
      :rules="rules"
    >
      <h2 class="login-title">登录</h2>
      <!-- prop属性设置需要校验的字段名 -->
      <el-form-item label="用户名" prop="username">
        <!-- v-model:绑定输入的数据 -->
        <el-input v-model="from.username" placeholder="请输入账号"></el-input>
      </el-form-item>
       <!-- v-model:绑定输入的数据 -->
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="from.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
// 引入Element提供的数据类型
import type { FormInstance, FormRules } from 'element-plus'
// 实例化这些接口，表单元素对象，FormInstance就是一个接口，用来规定每一项属性
const ruleFormRef = ref<FormInstance>()
// 路由
import { useRouter } from 'vue-router'
let router = useRouter()
// 仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()

// 定义响应式数据绑定表单输入的内容
const from = reactive({
  username: '',
  password: '',
})
// 引入Element提示框
import { ElMessage } from 'element-plus'

// console.log("ruleFormRef",ruleFormRef);

// 验证器
const valuename = (rule: any, value: any, callback: any) => {
  rule = rule
  // 去掉输入内容字符串前后的空格
  value = value.trim()
  // 当前输入框输入内容的长度：value存在然后再查找他的长度
  const length = value && value.length
  // 定义正则表达式
  const reg = /^[a-zA-Z0-9_]+$/
  // 如果输入的内容为空
  if (value === '') {
    callback(new Error('请输入账号'))
    // 如果输入的长度小于4或大于12
  } else if (length < 4 || length > 12) {
    callback(new Error('长度在4到12个字符'))
    //test用于判断是否符合某个模式，在这里用来检查value是否匹配reg正则表达式 
    // 如果不满足reg正则表达式
  } else if (!reg.test(value)) {
    callback(new Error('账号只有英文字母数字及下划线组成'))
  } else {
    callback()
  }
}
// 自定义校验规则
const rules = reactive<FormRules>({
  // 要校验的字段名
  username: [
    //required：是否为必填， trigger：验证逻辑的触发方式，validator：设置验证器，message：提示信息
    // blur失去焦点的时候校验，change改变的时候检验
    { required: true, validator: valuename, trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
  ],
})

// 点击登录按钮触发的方法
// formEl：表单对象
const onSubmit = (formEl: FormInstance | undefined) => {
  // 如果表单对象不存在则直接return
  if (!formEl) return
  // 如果表单对象存在则调用表单对象的validate方法，使用异步操作，获取回调函数中的valid的值
  formEl.validate(async (valid) => {
    // 如果valid为true则表示表单校验成功
    if (valid) {
      // 表单校验成功就将表单的数据向登录接口发送请求
      try {
        await useStore.userLogin(from)
        // 如果请求成功则跳转基本管理页面
        router.push('/layout')
        // 显示提示框
        ElMessage({
          type: 'success',
          message: '登录成功',
        })
        // 如果发送请求失败则捕获错误信息，并弹窗提示
      } catch (error) {
        console.log('catch')
        ElMessage({
          type: 'error',
          message: (error as Error).message,
        })
      }
      // 否则就是表单校验失败
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="less">
html {
  margin: 0;
  padding: 0;
}

.login-from {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255);
  padding: 30px;
  border-radius: 20px;
}

.login-container {
  background: url('../../../public/2.jpeg') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: none;
}

.login-title {
  text-align: center;
  color: #303133;
}
</style>
