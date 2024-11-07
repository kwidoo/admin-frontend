import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/store/auth';
import dashboardRoutes from './dashboardRoutes';
import authRoutes from './authRoutes';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    ...authRoutes,
    ...dashboardRoutes,
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
