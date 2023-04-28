import {createApp} from 'vue'
import './assets/global.css'
import App from './App.vue'
import router from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@surely-vue/table/dist/index.less'
import STable from '@surely-vue/table';

const app = createApp(App)

app.use(router)
app.use(Antd)
app.use(STable)
app.mount('#app')
