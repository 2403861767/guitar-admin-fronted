<template>
    <div>
        <a-layout>
            <a-layout-sider style="height: 100vh;" v-model:collapsed="collapsed" :trigger="null" collapsible>
                <div class="logo"/>
                <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                    <a-menu-item key="1" @click="router.push('/index')">
                        <user-outlined/>
                        <span>主页</span>
                    </a-menu-item>
                    <a-menu-item key="2" @click="router.push('/user')">
                        <user-outlined/>
                        <span>用户管理</span>
                    </a-menu-item>
                    <a-menu-item key="3">
                        <upload-outlined/>
                        <span>nav 3</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-header style="background: #fff; padding: 0">
                    <div style="margin-left: 16px;display: flex;justify-content: space-between">
                        <div style="box-sizing: border-box;">
                            <menu-unfold-outlined
                                    v-if="collapsed"
                                    class="trigger"
                                    @click="() => (collapsed = !collapsed)"
                            />
                            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)"/>
                        </div>
                        <div>
                            <h1>欢迎来到枫叶吉他谱分享平台后台系统</h1>
                        </div>
                        <div style="margin-right: 66px;">
                            <a-popover placement="topLeft">
                                <a-avatar size="large">
                                    <template #icon>
                                        <UserOutlined/>
                                    </template>
                                </a-avatar>
                                <span style="margin-left: 10px;">用户名</span>
                                <down-outlined/>
                                <template #content>
                                    <a-button type="text" block>当前用户为：普通用户</a-button>
                                    <a-button type="text" block>个人信息</a-button>
                                    <a-button type="text" block>登录</a-button>
                                    <a-button @click="logout" type="text" block>退出</a-button>
                                </template>
                            </a-popover>
                        </div>
                    </div>
                </a-layout-header>
                <a-layout style="padding: 0 24px 24px">
                    <a-breadcrumb style="margin: 16px 0">
                        <a-breadcrumb-item>Home</a-breadcrumb-item>
                        <a-breadcrumb-item>List</a-breadcrumb-item>
                        <a-breadcrumb-item>App</a-breadcrumb-item>
                    </a-breadcrumb>
                    <a-layout-content
                            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
                    >
                        <router-view />
                    </a-layout-content>
                </a-layout>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined
} from '@ant-design/icons-vue';
import {defineComponent, reactive, ref, watch} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {useRouter} from "vue-router";
const router = useRouter()
const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);
const collapsed = ref<boolean>(false)

const toggleCollapsed = () => {
    console.log(collapsed.value)
    collapsed.value = !collapsed.value;
};
const logout = async () => {
    const res = await myAxios.post('/user/logout')
    if (res.code === 0){
        router.replace('/login')
        localStorage.removeItem('user')
    }
}

</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}

.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}

.site-layout .site-layout-background {
    background: #fff;
}

</style>