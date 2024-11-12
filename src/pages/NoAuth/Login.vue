<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <div class="container flex flex-wrap items-center justify-center mx-auto">
                <!-- Logo -->
                <a href="/" class="flex items-center">
                    <img src="/src/assets/logo.svg" class="h-8 mr-3" alt="Logo" />
                </a>
            </div>
            <form @submit.prevent="login">
                <simple-input v-model="email" label="Email" id="email" type="email" required />
                <simple-input
                    v-model="password"
                    label="Password"
                    id="password"
                    type="password"
                    required
                />
                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-2 py-1 mt-4 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                    >
                        Login
                    </button>
                </div>

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
import SimpleInput from '@/components/SimpleInput.vue';

export default defineComponent({
    name: 'LoginPage',
    components: {
        SimpleInput,
    },
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
