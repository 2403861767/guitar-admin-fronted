import {createRouter, createWebHashHistory} from "vue-router";
import {message} from "ant-design-vue";


const routes = [
    {
        path: '/', redirect: '/index',component: () => import('../layouts/BaseLayout.vue'),
        children: [
            {
                path: '/index', component: () => import('../views/IndexPage.vue'),
                meta: {title: '首页',requiresAuth:true}
            },
            {path: '/user',component: () => import('../views/UserManagePage.vue'),
                 meta: {title: '用户管理',requiresAuth:true}
            },
            {path: '/guitar', component: () => import('../views/GuitarManagePage.vue'),
                meta: {title: '谱子管理',requiresAuth:true}
            },
            {path: '/image', component: () => import('../views/ImageManagePage.vue'),
                meta: {title: '图片管理',requiresAuth:true}
            },
            {path: '/examine', component: () => import('../views/ExamineMusicPage.vue'),
                meta: {title: '审核列表',requiresAuth:true}
            },
        ],

    },
    {path: '/login', component: () => import('../views/LoginPage.vue')},
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
router.beforeEach((to, from ,next) => {
    const isAuthenticated = sessionStorage.getItem('user') // 获取用户session
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated){
        message.error('请先登录!')
        next('/login')
    }else {
        next() // 放行路由
    }
})

export default router