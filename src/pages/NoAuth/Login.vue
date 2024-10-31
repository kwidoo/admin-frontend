<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold text-center">Login</h2>

            <form @submit.prevent="login">
                <!-- Email Field -->
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        v-model="email"
                        id="email"
                        type="email"
                        class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        autocomplete="email"
                        required
                    />
                </div>

                <!-- Password Field -->
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700"
                        >Password</label
                    >
                    <input
                        v-model="password"
                        id="password"
                        type="password"
                        class="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required
                    />
                </div>

                <!-- Login Button -->
                <button
                    type="submit"
                    class="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Login
                </button>

                <!-- Error Message -->
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useAuthStore from '@/store/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'LoginPage',
    setup() {
        const email = ref<string>('');
        const password = ref<string>('');
        const errorMessage = ref<string | null>(null);

        const authStore = useAuthStore();
        const router = useRouter();

        const login = async () => {
            try {
                await authStore.login(email.value, password.value);
                await router.push({ name: 'Dashboard' });
            } catch (error) {
                errorMessage.value =
                    error instanceof Error ? error.message : 'An unknown error occurred';
            }
        };

        return {
            email,
            password,
            login,
            errorMessage,
        };
    },
});
</script>

<style scoped>
/* Add your styles here */
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
