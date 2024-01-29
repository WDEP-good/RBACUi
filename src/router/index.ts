// 通过vue-router插件实现路由配置
import { createRouter,createWebHistory } from "vue-router";

let router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/login',
            component:()=>import("@/views/login/index.vue"),
            name:'login'
        },
        {
            path:'/',
            component:()=>import("@/views/layout/index.vue"),
            name:'layout'
        },
        {
            path:'/404',
            component:()=>import("@/views/404/index.vue"),
            name:'404'
        },
        {
            // 任意路由，配置所有路由都没有配置上的时候展示的路由
            path:'/:pathMatch(.*)*',
            redirect:'/404',
            name:'Any'
        }
    ]
})
export default router;