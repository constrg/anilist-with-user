import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import AuthForms from '../pages/auth/AuthForms.vue';
import NotFound from '../pages/NotFound.vue';
import User from '../pages/user/User.vue';
import { AuthService } from '../services/auth';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/auth-forms',
        name: 'auth-forms',
        component: AuthForms,
    },
    {
        path: '/user/:username',
        name: 'user',
        component: User,
        params: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!AuthService.isAuthenticated()) {
            next({ name: 'auth-forms' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
