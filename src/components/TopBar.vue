<template>
    <nav class="bg-topBar border-gray-200 px-4 py-1 dark:bg-gray-800">
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
    </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const isNavOpen = ref(false);
const isDropdownOpen = ref(false);

const logout = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style scoped>
nav {
    transition: all 0.3s ease;
}
</style>
