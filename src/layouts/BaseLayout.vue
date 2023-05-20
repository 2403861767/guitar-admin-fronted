<template>
    <div>
        <a-layout>
            <a-layout-sider style="height: 100vh;" v-model:collapsed="collapsed" :trigger="null" collapsible>
                <div class="logo"/>
                <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                    <a-menu-item key="index" @click="router.push('/index')">
                        <home-outlined/>
                        <span>主页</span>
                    </a-menu-item>
                    <a-menu-item key="user" @click="router.push('/user')">
                        <user-outlined/>
                        <span>用户管理</span>
                    </a-menu-item>
                    <a-menu-item key="guitar" @click="router.push('/guitar')">
                        <customer-service-outlined />
                        <span>吉他谱管理</span>
                    </a-menu-item>
                    <a-menu-item key="image" @click="router.push('/image')">
                        <picture-outlined />
                        <span>谱子图片管理</span>
                    </a-menu-item>
                    <a-menu-item key="examine" @click="router.push('/examine')">
                        <picture-outlined />
                        <span>审核列表</span>
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
                                <a-avatar :src="user.userAvatar" size="large">
                                    <template #icon>
                                        <UserOutlined/>
                                    </template>
                                </a-avatar>
                                <span style="margin-left: 10px;">{{ user.userName }}</span>
                                <down-outlined/>
                                <template #content>
                                    <a-button type="text" block>当前用户为：{{ user.userRole }}</a-button>
                                    <a-button type="text" block>个人信息</a-button>
                                    <a-button @click="logout" type="text" block>退出</a-button>
                                </template>
                            </a-popover>
                        </div>
                    </div>
                </a-layout-header>
                <a-layout style="padding: 0 24px 24px">
                    <div style="margin: 16px 0;">
                        <Breadcrumb />
                    </div>
                        <a-layout-content
                                :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
                        >
                            <router-view/>
                        </a-layout-content>
                </a-layout>
            </a-layout>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import {
    UserOutlined,
    HomeOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    CustomerServiceOutlined,
    PictureOutlined
} from '@ant-design/icons-vue';
import {defineComponent, onMounted, reactive, ref, watch} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {useRoute, useRouter} from "vue-router";
import {message} from "ant-design-vue";
import Breadcrumb from "../components/Breadcrumb.vue";

const router = useRouter()
const selectedKeys = ref<string[]>(['index']);
const openKeys = ref<string[]>(['sub1']);
const collapsed = ref<boolean>(false)
const route = useRoute()

// 面包屑
const breadList = ref([])
const getBreadcrumb = () => {
    route.matched.filter((item) => {
        breadList.value.push(item)
    })
    // route.matched.forEach(item => {
    //     breadList.value.push(item)
    // })
    // if (breadList.value[0].meta.title!=='首页'){
    //     breadList.value.unshift({
    //         path: '/index',
    //         meta: {
    //             title: '收益也'
    //         }
    //     })
    // }
}

const toggleCollapsed = () => {
    console.log(collapsed.value)
    collapsed.value = !collapsed.value;
};
const logout = async () => {
    const res = await myAxios.post('/user/logout')
    if (res.code === 0) {
        await router.replace('/login')
        sessionStorage.removeItem('user')
    } else {
        message.error('出现错误')
    }
}
watch(() => router.currentRoute.value.path, (newValue, oldValue) => {
    let temp = newValue.replace('/', '')
    console.log('watch', temp);
    selectedKeys.value = [temp]
    getBreadcrumb()

}, {immediate: true})
const user = ref({})
onMounted(() => {
    user.value = JSON.parse(sessionStorage.getItem('user'));

    if (user.value.userRole === 'user') {
        user.value.userRole = '普通用户'
    } else if (user.value.userRole === 'admin') {
        user.value.userRole = '管理员'
    } else if (user.value.userRole === 'superAdmin') {
        user.value.userRole = '超级管理员'
    } else if (user.value.userRole === 'sharer') {
        user.value.userRole = '分享者'
    } else {
        user.value.userRole = '制谱师'
    }
    console.log(user)
})

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