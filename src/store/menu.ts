import type { MenuItem } from '@/types/interfaces';
import { defineStore } from 'pinia';

export default defineStore('menu', {
    state: () => ({
        menuItems: {} as Record<string, MenuItem[]>,
    }),

    actions: {
        setMenuItems(items: Record<string, MenuItem[]>) {
            this.menuItems = items;
        },
    },

    getters: {
        topMenuItems: (state) => {
            return Object.values(state.menuItems)
                .flat()
                .filter((item) => item.parent_id === null);
        },
    },
});
