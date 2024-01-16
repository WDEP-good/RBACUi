import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-ui/lib/theme-chalk/index.css'
import zhCn from '../node_modules/element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 测试mock
import axios from 'axios'
axios({
  url: '/mock/login',
  method: 'post',
  data: {
    username: 'test1',
    password: '123456',
  },
})

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
