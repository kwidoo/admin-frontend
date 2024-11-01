<template>
    <div v-if="!loading" class="flex">
        <Sidebar :menu-data="menuData" />
        <main class="flex-1">
            <router-view :some="menuData" />
        </main>
    </div>
    <div v-else class="loading-spinner">Loading...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import { http } from '@/composables';
import { useMenuStore, useMsStore } from '@/store';
import router from '@/router';
import type { MenuItem, MicroService } from '@/types/interfaces';
import type { RouteRecordRaw } from 'vue-router';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export default defineComponent({
    name: 'Dashboard',
    components: { Sidebar },

    setup() {
        const menuData = ref<Record<string, MenuItem[]>>({});
        const loading = ref(true);
        const error = ref<string | null>(null);
        const menuStore = useMenuStore();
        const microServiceStore = useMsStore();

        const loadMicroservices = async (): Promise<void> => {
            await microServiceStore.fetch();
        };

        const fetchMenuData = async () => {
            const fetchPromises = microServiceStore.microServices.map(
                async (microService: MicroService) => {
                    try {
                        const config: AxiosRequestConfig = {
                            url: `${microService.url}/menu`,
                            method: 'get',
                        };

                        const response: AxiosResponse<MenuItem[]> = await http(config);
                        menuData.value[microService.name] = response.data;
                        menuStore.setMenuItems(menuData.value);

                        // Create routes for each menu item in this microservice
                        response.data.forEach((menuItem) => {
                            const route: RouteRecordRaw = {
                                path: menuItem.url,
                                name: menuItem.slug,
                                meta: {
                                    requiresAuth: true,
                                    name: menuItem.name,
                                    microservice: microService.name,
                                },
                                component: () => import('@/pages/Auth/Microservice.vue'),
                            };
                            router.addRoute('Dashboard', route);
                        });
                    } catch (err) {
                        error.value =
                            err instanceof Error ? err.message : 'An unknown error occurred';
                    }
                },
            );

            // Execute all requests concurrently
            await Promise.all(fetchPromises);
        };

        onMounted(async () => {
            try {
                await loadMicroservices();
                await fetchMenuData();
            } finally {
                loading.value = false;
            }
        });

        return { menuData, loading, error };
    },
});
</script>
