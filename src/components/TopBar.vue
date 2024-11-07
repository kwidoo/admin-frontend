<template>
    <nav class="bg-topBar border-gray-200 px-4 py-1 dark:bg-gray-800 relative">
        <div class="container flex flex-wrap items-center justify-between mx-auto">
            <!-- Logo -->
            <a href="/" class="flex items-center">
                <img src="/src/assets/logo-inverse.svg" class="h-8 mr-3" alt="Logo" />
            </a>

            <!-- Search Bar (Centered) -->
            <div class="flex-1 mx-4 hidden md:flex justify-center">
                <input
                    type="text"
                    placeholder="Global search..."
                    class="w-full max-w-lg bg-secondary text-black px-4 py-0 rounded shadow focus:outline-none"
                />
            </div>

            <!-- Profile and Logout Dropdown -->
            <div class="flex items-center">
                <a
                    href="/personal-area/profile"
                    class="flex items-center space-x-2 text-blue-600"
                    aria-current="page"
                >
                    <div class="flex text-white">
                        <font-awesome-icon :icon="['fas', 'user-circle']" class="mr-2" />
                        <span class="font-medium text-xs text-white">My Profile</span>
                    </div>
                </a>
                <div class="text-white text-xs font-medium border-l-2 mx-2">&nbsp;</div>

                <button @click="logout" class="text-white text-xs font-medium">Log out</button>
            </div>

            <!-- Mobile Toggle Button -->
            <button
                class="md:hidden text-xs text-white p-2 rounded"
                @click="isNavOpen = !isNavOpen"
            >
                <font-awesome-icon :icon="isNavOpen ? 'times' : 'bars'" />
            </button>
        </div>

        <!-- Loader Bar Under the Top Bar -->
    </nav>
    <div v-if="loadingStore.isLoading" class="loading-bar-container">
        <div class="loading-bar-slide"></div>
    </div>
    <div v-if="!loadingStore.isLoading" class="not-loading"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLoadingStore } from '@/store';

export default defineComponent({
    components: {
        FontAwesomeIcon,
    },
    setup() {
        const isNavOpen = ref(false);
        const isDropdownOpen = ref(false);

        const loadingStore = useLoadingStore();

        const logout = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        return {
            isNavOpen,
            isDropdownOpen,
            logout,
            loadingStore,
        };
    },
});
</script>

<style scoped>
nav {
    transition: all 0.3s ease;
}
.loading-bar-container {
    height: 4px;
    background-color: #ff8a00; /* Base color */
    position: relative;
    overflow: hidden;
}

.loading-bar-slide {
    height: 100%;
    width: 0;
    background-color: #3b82f6; /* Tailwind blue-500 color for sliding overlay */
    animation: slide-right 1s ease-out forwards;
    position: absolute;
    left: 0;
    top: 0;
}

@keyframes slide-right {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}

.not-loading {
    height: 4px;
    width: 100%;
    background-color: #ff8a00; /* Tailwind blue-500 color */
}
</style>
