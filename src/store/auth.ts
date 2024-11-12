import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { http } from '@/composables';
import type { AuthResponse, AuthState } from '@/types/interfaces';
import router from '@/router';

export default defineStore('auth', {
    state: (): AuthState => ({
        user: {
            token: null,
        },
        isAuthenticated: false,
    }),

    actions: {
        async login(login: string, password: string) {
            const config: AxiosRequestConfig = {
                baseURL: import.meta.env.VITE_API_URL,
                url: '/iam/api/v1/login',
                method: 'post',
                data: {
                    phone: login,
                    password,
                },
            };

            const authData = ref<AuthResponse | null>(null);
            const error = ref<null | string>(null);

            try {
                const response: AxiosResponse<AuthResponse> = await http(config);
                authData.value = response.data;

                if (authData.value?.success) {
                    const { token } = authData.value;

                    this.user = { token };
                    this.isAuthenticated = true;

                    // Store token in local storage for persistence
                    localStorage.setItem('authToken', token);

                    // Set token in Axios headers for future requests
                    http.defaults.headers.common.Authorization = `Bearer ${token}`;
                }

            } catch (err) {
                error.value = err instanceof Error ? err.message : 'An unknown error occurred';
                throw new Error('Login failed');
            }

        },

        // Log out and clear token
        logout() {
            this.user = { token: null };
            this.isAuthenticated = false;

            // Clear token from local storage and axios headers
            localStorage.removeItem('authToken');
            delete http.defaults.headers.common.Authorization;
            router.push('/login');
        },

        // Initialize the store (e.g., on app start)
        initializeAuth() {
            const token = localStorage.getItem('authToken');

            if (token) {
                this.user = { token };
                this.isAuthenticated = true;

                // Set Axios authorization header
                http.defaults.headers.common.Authorization = `Bearer ${token}`;
            }
        },
    },
});
