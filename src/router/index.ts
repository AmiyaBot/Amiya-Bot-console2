import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const indexChildren: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: () => import('../views/app/dashboard.vue')
    },
    {
        path: '/instance',
        name: 'instance',
        component: () => import('../views/app/instance.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/app/admin.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('../views/app/user.vue')
    },
    {
        path: '/replace',
        name: 'replace',
        component: () => import('../views/app/replace.vue')
    },
    {
        path: '/operator',
        name: 'operator',
        component: () => import('../views/app/operator.vue')
    },
    {
        path: '/gacha',
        name: 'gacha',
        component: () => import('../views/app/gacha.vue')
    },
    {
        path: '/plugin',
        name: 'plugin',
        component: () => import('../views/app/plugin.vue')
    },
    {
        path: '/shop',
        name: 'shop',
        component: () => import('../views/app/shop.vue')
    }
]

const routes: Array<RouteRecordRaw> = [
    {
        path: '/main',
        name: 'main',
        component: () => import('../views/main/main.vue'),
        children: indexChildren
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export {
    indexChildren
}

export default router
