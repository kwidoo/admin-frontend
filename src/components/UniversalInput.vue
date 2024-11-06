<template>
    <div class="form-group w-1/3">
        <label :for="inputId" class="block mb-1 text-sm font-medium">{{ label }}:</label>
        <div class="flex items-center gap-2">
            <input
                type="text"
                :id="inputId"
                v-model="inputValue"
                :required="required"
                :readonly="readonly"
                class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
            />
            <button
                v-if="clearable"
                @click.prevent="clearInput"
                class="px-2 py-1 text-xs rounded-md bg-secondary text-on-primary hover:bg-secondary-dark"
            >
                Clear
            </button>
            <button
                v-if="!readonly && canGenerate"
                @click.prevent="generateInput"
                class="px-2 py-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-primary-dark"
            >
                Generate
            </button>
            <button
                v-if="!readonly"
                @click.prevent="updateInput"
                :disabled="readonly && inputValue !== ''"
                class="px-2 py-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-primary-dark"
            >
                Update
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent, onMounted } from 'vue';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { http } from '@/composables';

export default defineComponent({
    name: 'UniversalInput',
    props: {
        inputId: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        modelValue: {
            type: [String, Number, null],
            required: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: true,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        canGenerate: {
            type: Boolean,
            default: true,
        },
        fetchOnMount: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const inputValue = ref(props.modelValue);

        const clearInput = () => {
            inputValue.value = '';
            emit('update:modelValue', inputValue.value);
        };

        const updateInput = () => {
            emit('update:modelValue', inputValue.value);
        };

        const generateInput = async () => {
            try {
                const config: AxiosRequestConfig = {
                    url: '/iam/api/v1/generator',
                    method: 'get',
                    params: { type: props.inputId },
                };
                const response: AxiosResponse<{ code: string }> = await http(config);
                inputValue.value = response.data.code;
                emit('update:modelValue', inputValue.value);
            } catch (error) {
                console.error('Error generating value:', error);
            }
        };

        watch(
            () => props.modelValue,
            (newValue) => {
                inputValue.value = newValue;
            },
        );

        onMounted(() => {
            if (props.fetchOnMount) {
                generateInput();
            }
        });

        return {
            inputValue,
            clearInput,
            updateInput,
            generateInput,
        };
    },
});
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}
.flex {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
