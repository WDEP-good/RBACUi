<template>
  <div class="navbar">
    <template v-for="item in menuList" :key="item.index">
      <el-menu-item v-if="!item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <!-- 递归调用子组件 -->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>
<script lang="ts">
// 因为使用递归要循环调用所以要导出
export default {
  name: 'Menu',
  // 接收从父组件传过来的菜单列表
  props: ['menuList'],
}
</script>

<style scoped></style>
