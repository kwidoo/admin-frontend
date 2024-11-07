import type { RouteRecordRaw } from 'vue-router';
import Login from '@/pages/NoAuth/Login.vue';

const authRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
];

export default authRoutes;
