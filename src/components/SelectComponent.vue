<template>
    <div :class="['form-group mt-4', formClass]">
        <label :for="id" class="block mb-1 text-sm font-medium">{{ label }}</label>
        <select
            v-model="inputValue"
            :id="id"
            :disabled="readonly"
            class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
        >
            <option v-for="(optionLabel, value) in options" :key="value" :value="value">
                {{ optionLabel }}
            </option>
        </select>
        <p v-if="hasErrors" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue';

export default defineComponent({
    name: 'LoginValueTypeSelect',
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
        options: {
            type: Object as () => Record<string, string>,
            required: false,
            default: () => ({
                PHONE: 'Phone',
                EMAIL: 'Email',
                TELEGRAM: 'Telegram',
                WHATSAPP: 'Whatsapp',
            }),
        },
        modelValue: {
            type: [String, Number, null],
            required: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        formClass: {
            type: String,
            required: false,
            default: '',
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
        readonly: {
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
