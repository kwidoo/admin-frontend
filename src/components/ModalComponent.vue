<template>
    <teleport to="#modal-container">
        <div
            v-if="isModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            @click.self="closeModal"
        >
            <div class="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                <button
                    @click="closeModal"
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                    <span class="text-xl">&times;</span>
                </button>
                <h2 class="text-lg font-semibold mb-4">
                    <slot name="header">Default Header</slot>
                </h2>
                <div class="mb-6">
                    <slot name="content">Default Content</slot>
                </div>
                <div class="flex justify-end">
                    <slot name="buttons">
                        <button
                            type="button"
                            @click="closeModal"
                            class="px-4 py-2 mr-2 text-sm rounded bg-secondary text-black hover:bg-secondary-dark"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            @click="emitAction"
                            :disabled="loadingStore.isLoading"
                            :class="actionClass"
                            class="px-4 py-2 text-sm rounded"
                        >
                            {{ actionText }}
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLoadingStore } from '@/store';

export default defineComponent({
    name: 'ModalComponent',
    props: {
        actionText: {
            type: String,
            default: 'Save',
        },
        actionClass: {
            type: String,
            default: 'bg-primary text-on-secondary hover:bg-primary-dark',
        },
        isModalOpen: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    emits: ['action', 'closeModal'],
    setup(_, { emit }) {
        const loadingStore = useLoadingStore();

        const closeModal = () => {
            emit('closeModal');
        };

        const emitAction = () => {
            emit('action');
        };

        return {
            loadingStore,
            closeModal,
            emitAction,
        };
    },
});
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
