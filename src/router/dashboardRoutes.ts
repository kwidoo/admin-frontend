import type { RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Auth/Home.vue';
import Contacts from '@/pages/Auth/Contacts.vue';
import Customers from '@/pages/Auth/Customers.vue';
import CustomerDetail from '@/pages/Auth/CustomerDetail.vue';
import ContactDetail from '@/pages/Auth/ContactDetail.vue';

const dashboardRoutes: RouteRecordRaw[] = [
    {
        path: '/dashboard',
        component: Home,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'customers',
                name: 'Customers',
                component: Customers,
                meta: {
                    requiresAuth: true,
                },
                children: [],
            },
            {
                path: 'customers/:customerId',
                name: 'CustomerDetail',
                component: CustomerDetail,
                meta: {
                    requiresAuth: true,
                },
                props: true,
                children: [
                    {
                        path: 'contact/:contactId?',
                        name: 'CustomerContactDetail',
                        component: ContactDetail,
                        props: true,
                        meta: {
                            modal: true,
                            requiresAuth: true,
                        },
                    },
                ],
            },

            {
                path: 'contacts',
                name: 'Contacts',
                component: Contacts,
                meta: { requiresAuth: true },

            },
            {
                path: 'contact/:contactId?',
                name: 'ContactDetail',
                component: ContactDetail,
                meta: { requiresAuth: true },
                props: true,
            },
        ],
    },
];

export default dashboardRoutes;
