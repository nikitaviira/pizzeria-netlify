import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import store from '@/store/index';
import { Trans } from '@/plugins/Translation';

Vue.use(VueRouter);

function loadPage(component: string) {
    return () => import(`@/views/${component}.vue`);
}

const routes = [
    {
        path: '/:locale',
        component: {
            template: '<router-view></router-view>'
        },
        beforeEnter: Trans.routeMiddleware,
        children: [
            {
                path: '',
                name: 'root',
                component: loadPage('Index')
            },
            {
                path: 'reviews',
                name: 'reviews',
                component: loadPage('Reviews')
            },
            {
                path: 'create',
                name: 'create-pizza',
                component: loadPage('Pizza/PizzaCreate')
            },
            {
                path: 'create/:template?',
                name: 'create-pizza-template',
                component: loadPage('Pizza/PizzaCreate'),
                beforeEnter: (to: any, from: any, next: any): any => {
                    if (!['hawaiian', 'romana', 'americana', 'margherita', 'mushroomsOnion', 'spicyChicken']
                        .includes(to.params.template)) {
                        return router.push({ name: 'root' });
                    }

                    return next();
                }
            },
            {
                path: 'edit/:index?',
                name: 'edit-pizza',
                component: loadPage('Pizza/PizzaEdit')
            },
            {
                path: 'checkout',
                name: 'checkout',
                component: loadPage('Checkout'),
                meta: { authRequired: true },
                beforeEnter: (to: any, from: any, next: any): any => {
                    if (store.getters['cart/getCartLength'] === 0) {
                        return router.push({ name: 'root' });
                    }

                    return next();
                }
            },
            {
                path: 'user/orders',
                name: 'user-orders',
                component: loadPage('Account/OrderHistory'),
                meta: { authRequired: true }
            },
            {
                path: 'user/delivery',
                name: 'user-delivery',
                component: loadPage('Account/Delivery'),
                meta: { authRequired: true },
                beforeEnter: (to: any, from: any, next: any): any => {
                    const roles = store.getters['user/getRoles'] as string[];
                    if (!roles.some(x => x === 'Admin' || x === 'Delivery')) {
                        return router.push({ name: 'root' });
                    }

                    return next();
                }
            },
            {
                path: 'login',
                name: 'login',
                component: loadPage('Account/Login'),
                meta: { disallowAuthed: true }
            },
            {
                path: 'register',
                name: 'register',
                component: loadPage('Account/Register'),
                meta: { disallowAuthed: true }
            },
            {
                path: '*',
                name: 'all',
                component: loadPage('Index')
            },
        ]
    },
    {
        path: '*',
        redirect() {
            return Trans.defaultLocale;
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = store.getters['user/isLoggedIn'] as boolean;
    const token = store.getters['user/getToken'] as string;

    if (!loggedIn && to.meta.authRequired) {
        return router.push({ name: 'login' });
    }

    if (loggedIn) {
        if (to.meta.authRequired) {
            Axios.defaults.headers.common.Authorization = 'Bearer ' + token;
        }
        if (to.meta.disallowAuthed) {
            return router.push({ name: 'root' });
        }
    }

    return next();
});

export default router;
