<template>
    <aside
        :class="[
            'lg:w-64 h-screen bg-secondary text-black lg:block hidden',
            isCollapsed ? 'w-16' : 'w-full',
        ]"
        class="fixed lg:relative transition-all duration-300 ease-in-out"
    >
        <nav class="flex flex-col p-4 space-y-4 h-screen">
            <template v-for="(items, microService) in menuData" :key="microService">
                <div class="group">
                    <div
                        class="flex items-center justify-between px-4 py-2 text-sm font-medium text-accent rounded cursor-pointer hover:bg-primary transition-colors"
                        @click="toggleGroup(microService)"
                    >
                        <span>{{ microService }}</span>
                        <font-awesome-icon
                            :icon="groupStates[microService] ? 'chevron-up' : 'chevron-down'"
                            class="text-sm"
                        />
                    </div>
                    <div v-if="groupStates[microService]" class="pl-4 space-y-2">
                        <router-link
                            v-for="item in items"
                            :key="item.id"
                            :to="item.url"
                            class="block px-4 py-2 text-sm font-medium text-accent rounded hover:bg-primary transition-colors"
                        >
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
            </template>
        </nav>
    </aside>
    <button
        class="lg:hidden fixed top-4 right-4 z-50 bg-primary text-white p-2 rounded"
        @click="toggleSidebar"
    >
        <font-awesome-icon :icon="isCollapsed ? 'bars' : 'times'" />
    </button>
</template>

<script lang="ts">
import type { MenuItem } from '@/types/interfaces';
import { defineComponent, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
    name: 'Sidebar',
    components: {
        FontAwesomeIcon,
    },
    props: {
        menuData: {
            type: Object as () => Record<string, MenuItem[]>,
            required: true,
        },
    },
    setup() {
        const groupStates = ref<Record<string, boolean>>({});
        const isCollapsed = ref(false);

        const toggleGroup = (groupName: string) => {
            groupStates.value[groupName] = !groupStates.value[groupName];
        };

        const toggleSidebar = () => {
            isCollapsed.value = !isCollapsed.value;
        };

        return {
            groupStates,
            toggleGroup,
            isCollapsed,
            toggleSidebar,
        };
    },
});
</script>

<style scoped>
@media (max-width: 1024px) {
    aside {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 40;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    aside.lg\:block {
        transform: translateX(0);
    }
}
</style>
