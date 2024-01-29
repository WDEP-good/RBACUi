<template>
  <div class="navbar">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      :router="true"
      :default-active="route.path"
      :default-openeds='["/students"]'
    >
      <Menu :menuList="menuNodes"></Menu>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
// 引入菜单列表数据
import menuList from '@/config/menuConfig'
// 引入菜单组件
import Menu from './menu/index.vue'
// 引入数据类型
import type {MenuData,MenuChildrenData} from './type/type'
// 引入用户小仓库
import useUserStore from '@/store/modules/user';
let useStore = useUserStore()
// 引入路由
import {useRoute} from 'vue-router';
const route = useRoute()


// 判断是否拥有当前权限
const hashAuth = (item:MenuData) =>{
  // menuList中的某一个元素
  // 解构
  const {index,isPublic} = item
  // 当前登录的用户权限列表
  const menus = useStore.user?.role.menus
  // 当前登录的用户名
  const username = useStore.user?.username
  // 1.当前登录的用户是否是超级管理员
  // 2.当前的item是否为公开的（isPublic）
  // 3.当前登录的用户权限列表(menus)中是否包含item的index
  if(username === 'admin'||isPublic||menus?.indexOf(index) != -1){
    return true
  }else if(item.children){
    return !!item.children.find(
      (child:MenuChildrenData) =>menus.indexOf(child.index) != -1,
      )
  }else{

    return false
  }
}
// 存储要展示的菜单项
let menuNodes:any[] = []
// 计算需要展示的菜单项
const getMenuNodes = ()=>{
  menuList.forEach((item)=>{
    if(!item.children){
      if(hashAuth(item)){
        menuNodes.push(item)
      }
    }else{
      // 用于存储与当前登录用户权限列表匹配的二级菜单
      let tempArr = []
      // 循环遍历二级菜单项数组
      
      item.children.forEach(i=>{
        // 如果当前循环遍历到的二级菜单项在登录的用户权限列表中存在，就添加到临时数组中
        if(hashAuth(i)){
          tempArr.push(i)
        }
      })
      let obj = {...item,children:tempArr}
      if(obj && obj.children && obj.children.length) menuNodes.push(obj)
      // 将拥有二级菜单项添加到menuNodes
    }
  })
}
getMenuNodes()
</script>

<style scoped>
.el-menu {
  border-right: 0;
}
</style>
