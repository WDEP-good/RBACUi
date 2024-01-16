<template>
  <div>
    <h1>测试axios封装</h1>
    <!-- <button @click="getURLInfo">获取用户信息</button> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
// import req from '@/utils/request.ts'
import { reqLogin } from '@/api/user/index.ts'

onMounted(() => {
  reqLogin({ username: 'test1', password: '1234' }).then((req) => {
    console.log('登录', req.data)
  })
})
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
