<template>
  <div>
    <!-- 设置路由出口 -->
    <router-view></router-view>
    <!-- <h1>测试axios封装</h1> -->
    <!-- <button @click="getURLInfo">获取用户信息</button> -->
  </div>
</template>
<script setup lang="ts">
// 导入vue生命周期
// import { onMounted } from 'vue'
// 导入配置好的axios
// import req from '@/utils/request.ts'
// 定义一个空字符串用于存储token用户身份标识
// let token = '';
// 在组件挂载后自动获取用户的标识
// import { reqLogin } from './api/user'
// onMounted(() => {
  // reqLogin({ username: 'test1', password: '1234' }).then((req) => {
  //   console.log('登录', req.data)
  // })
  // 使用封装好的axios进行请求
  //   req({
  //     // 请求地址
  //     url: '/login',
  //     // 请求方式
  //     method: 'post',
  //     // 请求数据
  //     data: {
  //       username: 'test1',
  //       password: '1234'
  //     }
  //   }).then(item => {
  //     // 请求成功则返回请求成功的数据，
  //     console.log(item);
  //     token = item.data.token
  //   })
// })
// 获取用户信息
// const getURLInfo = () => {
//   req({
//     url: '/user/info',
//     method: 'get',
//     headers: {
//       token
//     }
//   }).then(item => {
//     console.log("获取用户信息", item);

//   })
// }
</script>

<style scoped>
.box {
  width: 400px;
  height: 400px;
  background-color: skyblue;
}

h1 {
  color: blue;
}
</style>
