import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/store/auth';
import useRouteStore from '@/store/routes';
import Home from '@/pages/Auth/Home.vue';
import Login from '@/pages/NoAuth/Login.vue';

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
        children: [],
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

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const routeStore = useRouteStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        next({ name: 'Dashboard' });
    } else {
        routeStore.setRoute(to.fullPath);
        next();
    }
});

export default router;
