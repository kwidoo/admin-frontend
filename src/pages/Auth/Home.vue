<template>
    <div v-if="!loading" class="flex flex-col lg:flex-col">
        <top-bar />
        <div class="flex-1 flex">
            <sidebar :menu-data="menuData" />

            <main class="flex-1 p-4">
                <router-view />
            </main>
        </div>
    </div>
    <div v-else class="loading-spinner">Loading...</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Sidebar, TopBar } from '@/components';
import { http } from '@/composables';
import { useMenuStore, useMsStore } from '@/store';
import router from '@/router';
import type { MenuItem, MicroService } from '@/types/interfaces';
import type { RouteRecordRaw } from 'vue-router';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FwbSpinner } from 'flowbite-vue';

export default defineComponent({
    name: 'Dashboard',
    components: { Sidebar, TopBar, FwbSpinner },

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
                        if (!microService.url) {
                            return;
                        }
                        const config: AxiosRequestConfig = {
                            url: `${microService.url}/menu`,
                            method: 'get',
                        };

                        const response: AxiosResponse<MenuItem[]> = await http(config);
                        menuData.value[microService.name] = response.data;
                        menuStore.setMenuItems(menuData.value);
                        menuData.value = menuStore.menuItems;

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
