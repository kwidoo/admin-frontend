import type { MenuItem } from '@/types/interfaces';
import { defineStore } from 'pinia';

export default defineStore('menu', {
    state: (): { menuItems: Record<string, MenuItem[]> } => ({
        menuItems: {
            'Customers': [
                {
                    id: 1,
                    name: 'Manage',
                    slug: 'manage',
                    url: '/dashboard/customers',
                    icon: null,
                    parentId: null,
                    order: 3,
                    permissions: '[]',
                    children: [],
                },
                {
                    id: 2,
                    name: 'Contacts',
                    slug: 'contacts',
                    url: '/dashboard/contacts',
                    icon: null,
                    parentId: null,
                    order: 3,
                    permissions: '[]',
                    children: [],
                },
            ],
        },
    }),

    actions: {
        setMenuItems(items: Record<string, MenuItem[]>) {
            const plainItems = JSON.parse(JSON.stringify(items));

            this.menuItems = {
                ...this.menuItems,

                ...plainItems,
            };
        },
    },

    getters: {
        topMenuItems: (state) => {
            return Object.values(state.menuItems)
                .flat()
                .filter((item) => item.parentId === null);
        },
    },
});
