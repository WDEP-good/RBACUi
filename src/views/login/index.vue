<template>
    <div class="login-container">
        <el-form :model="from" label-width="80px" class="login-from">
            <h2 class="login-title">登录</h2>
                    <el-form-item label="账号">
                        <el-input v-model="from.username" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="from.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="submit" @click="onSubmit">登录</el-button>
                    </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

const from = reactive({
    username: '',
    password: ''
})
const onSubmit = () => { }

</script>

<style scoped lang="less">
*{
    background-color: black;
}
.login-from {
    width: 350px;
    margin: 160px auto;
    background-color: rgb(255, 255, 255,0.8);
    padding: 30px;
    border-radius: 20px;
}
.login-container{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.login-title{
    text-align: center;
    color: #303133;
}
</style>