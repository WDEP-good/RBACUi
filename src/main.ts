import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import zhCn from '../node_modules/element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入前置路由
import "./permission"


// 测试mock
// 导入axios
import axios from 'axios'
// 使用axios进行请求
axios({
  // 请求地址
  url: '/mock/login',
  // 请求方式
  method: 'post',
  // 请求携带的数据
  data: {
    // 用户名
    username: 'test1',
    // 密码
    password: '123456',
  },
})
const app = createApp(App)
// 引入路由
import router from './router'
// 引入 pinia
import pinia from '@/store/index'
app.use(pinia)
// 注册路由
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
