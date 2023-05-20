import {createApp} from 'vue'
import './assets/global.css'
import App from './App.vue'
import router from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import * as Icons from '@element-plus/icons'
import * as Icons from '@element-plus/icons-vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(Antd)
app.mount('#app')
// 注册全局组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons])
})