<template>
    <modal-component :is-modal-open="isModalOpen" @close-modal="closeConfirmModal">
        <template #header>
            <slot name="header">
                <p>{{ header }}</p>
            </slot>
        </template>
        <template #content>
            <slot name="content">
                <p>{{ text }}</p>
            </slot>
        </template>
        <template #buttons>
            <div class="mt-4">
                <button
                    type="button"
                    @click="closeConfirmModal"
                    class="px-2 py-1 mt-4 mr-2 text-xs rounded bg-secondary text-black hover:bg-error-dark"
                >
                    No
                </button>
                <button
                    @click.prevent="confirmAction"
                    :disabled="loadingStore.isLoading"
                    :class="{ 'opacity-50': loadingStore.isLoading }"
                    class="px-2 py-1 mt-4 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                >
                    Yes
                </button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLoadingStore } from '@/store';
import ModalComponent from './ModalComponent.vue';

export default defineComponent({
    name: 'ConfirmModal',
    components: {
        ModalComponent,
    },
    props: {
        isModalOpen: {
            type: Boolean,
            required: true,
        },
        header: {
            type: String,
            required: false,
            default: '',
        },
        text: {
            type: String,
            required: true,
        },
    },
    emits: ['closeModal', 'action'],
    setup(_, { emit }) {
        const loadingStore = useLoadingStore();

        const closeConfirmModal = () => {
            emit('closeModal');
        };

        const confirmAction = () => {
            if (!loadingStore.isLoading) {
                emit('action');
            }
        };

        return {
            loadingStore,
            closeConfirmModal,
            confirmAction,
        };
    },
});
</script>

<style scoped>
/* You can add any custom styles for your modal here */
</style>
