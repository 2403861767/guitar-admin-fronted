import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'view-ui-plus/dist/styles/viewuiplus.css'
import ViewUIPlus from 'view-ui-plus'

const app = createApp(App)
app.use(ViewUIPlus)
app.use(router)
app.use(Antd)
app.mount('#app')
