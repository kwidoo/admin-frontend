<template>
    <div class="form-group mt-4" :class="formClass">
        <label :for="id" class="block mb-1 text-sm font-medium">{{ label }}</label>
        <div class="w-full">
            <div class="relative">
                <label :for="id" class="sr-only">{{ label }}</label>
                <input
                    :id="id"
                    type="text"
                    class="mt-1 block w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    v-model="inputValue"
                    :required="required"
                />
                <button
                    @click="copyToClipboard"
                    class="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 rounded-lg p-2 inline-flex items-center justify-center"
                >
                    <span v-if="!copied" id="default-icon">
                        <font-awesome-icon :icon="['fas', 'copy']" class="fa-xs" />
                    </span>
                    <span v-else id="success-icon" class="inline-flex items-center text-green-600">
                        <font-awesome-icon :icon="['fas', 'check-circle']" class="fa-xs" />
                    </span>
                </button>
                <div
                    v-if="showTooltip"
                    role="tooltip"
                    class="absolute z-10 inline-block px-1 py-1 text-xs font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 tooltip dark:bg-gray-700"
                >
                    <span v-if="!copied">Copy to clipboard</span>
                    <span v-else>Copied!</span>
                </div>
            </div>
        </div>
        <div v-if="hasErrors" class="text-xs text-red-500 dark:text-red-400">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'CopyToClipboardInput',
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
        const copied = ref(false);
        const showTooltip = ref(false);
        const inputValue = ref<string | number | null>(props.modelValue);

        const resetToDefault = () => {
            copied.value = false;
            showTooltip.value = false;
        };

        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(inputValue.value as string);
                copied.value = true;
                showTooltip.value = true;
                setTimeout(() => {
                    resetToDefault();
                }, 2000);
            } catch (error) {
                console.error('Failed to copy text: ', error);
            }
        };

        // Watch for asynchronous changes to modelValue and update inputValue accordingly
        watch(
            () => props.modelValue,
            (newValue) => {
                if (newValue !== inputValue.value) {
                    inputValue.value = newValue;
                }
            },
        );

        // Emit updates when inputValue changes
        watch(inputValue, (newValue) => {
            if (newValue !== props.modelValue) {
                emit('update:modelValue', newValue);
            }
        });

        return {
            copied,
            showTooltip,
            inputValue,
            copyToClipboard,
        };
    },
});
</script>

<style scoped>
.tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}
</style>
