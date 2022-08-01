import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import { createDiscreteApi } from 'naive-ui'
import { router } from './common/router'
import { createPinia } from "pinia";
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'
import "element-plus/dist/index.css"

// 服务端地址
axios.defaults.baseURL = "http://120.46.184.130/"
// 独立API
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])


const app = createApp(App)
// 全局注册element plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 全局提供属性
app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL )

app.use(naive)
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

const adminStore = AdminStore()
// axios拦截器
axios.interceptors.request.use((config)=>{
    //每次请求都在headers中添加token
    config.headers.token = adminStore.token
    return config
})

app.mount('#app')
