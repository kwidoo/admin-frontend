<template>
    <modal-component :is-modal-open="isModalOpen" @close-modal="closeAttachModal">
        <template #header>
            <h2 v-if="header" class="text-lg font-semibold mb-4">{{ header }}</h2>
        </template>
        <template #content>
            <div class="form-group mt-4 w-full relative">
                <search-input
                    ref="searchInputRef"
                    :label="label"
                    :endpoint="`/iam/api/v1/login/search`"
                    :display-fields="['loginValue']"
                    placeholder="Search..."
                    v-model="selectedLogin"
                />
            </div>
        </template>
        <template #buttons>
            <div class="flex justify-end mt-6">
                <button
                    type="button"
                    @click="closeAttachModal"
                    class="px-4 py-2 mr-2 text-xs rounded bg-secondary text-black hover:bg-error-dark"
                >
                    Cancel
                </button>
                <button
                    @click.prevent="attachLogin"
                    :disabled="loadingStore.isLoading"
                    :class="{ 'opacity-50 cursor-not-allowed': loadingStore.isLoading }"
                    class="px-4 py-2 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                >
                    Save
                </button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { DataItem } from '@/types/interfaces';
import type { PropType } from 'vue';
import ModalComponent from '@/components/ModalComponent.vue';
import SearchInput from '@/components/SearchInput.vue';

export default defineComponent({
    name: 'AttachLoginModal',
    components: {
        ModalComponent,
        SearchInput,
    },
    props: {
        header: {
            type: String,
            required: false,
            default: '',
        },
        label: {
            type: String,
            required: false,
            default: '',
        },
        isModalOpen: {
            type: Boolean,
            required: true,
        },
        modelValue: {
            type: Object as PropType<DataItem | null>,
            required: true,
            default: null,
            validator: (value) => {
                return value === null || typeof value === 'object';
            },
        },
    },
    emits: ['update:modelValue', 'close-attach-modal'],
    setup(props, { emit }) {
        const searchInputRef = ref(null);
        const loadingStore = ref({ isLoading: false });
        const selectedLogin = ref<DataItem>({} as DataItem);

        const closeAttachModal = () => {
            emit('close-attach-modal');
        };

        const attachLogin = () => {
            emit('update:modelValue', selectedLogin.value);
        };

        watch(selectedLogin, (newValue) => {
            if (newValue !== props.modelValue) {
                emit('update:modelValue', newValue);
            }
        });

        return {
            searchInputRef,
            loadingStore,
            closeAttachModal,
            attachLogin,
            selectedLogin,
        };
    },
});
</script>

<style scoped>
.fixed {
    z-index: 50;
}

@media (min-width: 640px) {
    .max-w-lg {
        width: 33.3333%;
    }
}

.cursor-not-allowed {
    cursor: not-allowed;
}
</style>
