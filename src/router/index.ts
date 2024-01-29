// 通过vue-router插件实现路由配置
import { createRouter, createWebHistory } from 'vue-router'

let router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/login',
    //   component: () => import('@/views/login/index.vue'),
    //   name: 'login',
    // },
    {
      path: '/',
      component: () => import('@/views/login/index.vue'),
      name: 'login',
    },
    {
      path: '/layout',
      component: () => import('@/views/layout/index.vue'),
      name: 'layout',
      redirect:'/home',
      // 配置子路由
      children:[
        {
          path:'/home',
          component: () => import('@/views/home/home.vue'),
          meta:{title:'首页'}
        },
        {
          path:'/user',
          component: () => import('@/views/user/user.vue'),
          meta:{title:'用户管理'}
        },
        {
          path:'/role',
          component: () => import('@/views/role/role.vue'),
          meta:{title:'角色管理'}
        },
        {
          path:'/school',
          component: () => import('@/views/students/School.vue'),
          meta:{title:'角色管理'}
        },
        {
          path:'/class',
          component: () => import('@/views/students/Class.vue'),
          meta:{title:'班级管理'}
        },
        {
          path:'/majors',
          component: () => import('@/views/students/Majors.vue'),
          meta:{title:'专业管理'}
        },
        {
          path:'/student',
          component: () => import('@/views/students/Students.vue'),
          meta:{title:'学生管理'}
        },
        {
          path:'/student/update/:_id',//_id为路由占位符
          component: () => import('@/views/students/components/StudentsUpdate.vue'),
          meta:{title:'学生添加/编辑'}
        },
      ]
    },

    {
      path: '/404',
      component: () => import('@/views/404/index.vue'),
      name: '404',
    },
    {
      // 任意路由，配置所有路由都没有配置上的时候展示的路由
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      name: 'Any',
    },
  ],
})
export default router
