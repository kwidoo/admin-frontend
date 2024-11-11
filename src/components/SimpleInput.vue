<template>
    <div class="form-group mt-4" :class="formClass">
        <label :for="id" class="block mb-1 text-sm font-medium">{{ label }}</label>
        <input
            v-model="inputValue"
            type="text"
            :id="id"
            class="mt-1 block w-full px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
            :required="required"
        />
        <div v-if="hasErrors" class="text-xs text-red-500 dark:text-red-400">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'SimpleInput',
    props: {
        label: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
            default: 'copy-to-clipboard-input',
        },
        modelValue: {
            type: [String, Number, null],
            required: true,
        },
        formClass: {
            type: String,
            required: false,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
        error: {
            type: String,
            required: false,
            default: '',
        },
        hasErrors: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const inputValue = ref<string | number | null>(props.modelValue);

        watch(
            () => props.modelValue,
            (newValue: string | number | null) => {
                if (newValue !== inputValue.value) {
                    inputValue.value = newValue;
                }
            },
        );

        watch(inputValue, (newValue: string | number | null) => {
            if (newValue !== props.modelValue) {
                emit('update:modelValue', newValue);
            }
        });

        return { inputValue };
    },
});
</script>
