<template>
    <aside class="w-64 h-screen bg-gray-800 text-white">
        <nav class="flex flex-col p-4 space-y-4">
            <template v-for="(items, microService) in menuData" :key="microService">
                <div class="group">
                    <div
                        class="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-200 rounded cursor-pointer hover:bg-gray-700"
                        @click="toggleGroup(microService)"
                    >
                        <span>{{ microService }}</span>
                        <i
                            :class="
                                groupStates[microService]
                                    ? 'fa fa-chevron-up'
                                    : 'fa fa-chevron-down'
                            "
                        ></i>
                    </div>
                    <div v-if="groupStates[microService]" class="pl-4 space-y-2">
                        <router-link
                            v-for="item in items"
                            :key="item.id"
                            :to="item.url"
                            class="block px-4 py-2 text-sm font-medium text-gray-200 rounded hover:bg-gray-700"
                        >
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
            </template>
        </nav>
    </aside>
</template>

<script lang="ts">
import type { MenuItem } from '@/types/interfaces';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Sidebar',
    props: {
        menuData: {
            type: Object as () => Record<string, MenuItem[]>,
            required: true,
        },
    },
    setup() {
        const groupStates = ref<Record<string, boolean>>({});

        const toggleGroup = (groupName: string) => {
            groupStates.value[groupName] = !groupStates.value[groupName];
        };

        return {
            groupStates,
            toggleGroup,
        };
    },
});
</script>

<style scoped>
/* Add specific styles if needed */
</style>
