import { defineStore } from 'pinia';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { MicroService } from '@/types/interfaces';
import type { MicroServiceState } from '_store';
import useAuthStore from '@/store/auth';
import http from '@/composables';


export default defineStore('ms', {
    state: (): MicroServiceState => ({
        microServices: [],
        error: null,
    }),
    actions: {
        async fetch() {
            const authStore = useAuthStore();

            try {

                if (!authStore.isAuthenticated) {
                    throw new Error('User is not authenticated');
                }
                const config: AxiosRequestConfig = {
                    url: '/iam/api/v1/micro-services',
                    method: 'get',
                };

                const response: AxiosResponse<MicroService[]> = await http(config);
                this.microServices = response.data;
            } catch (err) {
                this.error = err instanceof Error ? err.message : 'An error occurred while fetching documents';
            }
        },
    },
    getters: {
        get: (state) => state.microServices,
    },
});
