import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/store/auth';
import Home from '@/pages/Auth/Home.vue';
import Login from '@/pages/NoAuth/Login.vue';
import Customers from '@/pages/Auth/Customers.vue';
import CustomerDetail from '@/pages/Auth/CustomerDetail.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Home,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/dashboard/customers',
                name: 'Customers',
                component: Customers,
                meta: { requiresAuth: true },
                children: [],
            },
            {
                path: '/dashboard/customer/:id?',
                name: 'CustomerDetail',
                component: CustomerDetail,
                meta: { requiresAuth: true },
                props: true,
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/dashboard',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router;
