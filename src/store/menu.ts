import type { MenuItem } from '@/types/interfaces';
import { defineStore } from 'pinia';

export default defineStore('menu', {
    state: () => ({
        menuItems: {} as Record<string, MenuItem[]>,
    }),

    actions: {
        setMenuItems(items: Record<string, MenuItem[]>) {
            const plainItems = JSON.parse(JSON.stringify(items));

            this.menuItems = {
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
                    }, {
                        id: 1,
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
