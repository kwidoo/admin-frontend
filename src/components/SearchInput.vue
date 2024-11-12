<template>
    <div class="form-group mt-4 w-full relative">
        <label v-if="label" class="block mb-1 text-sm font-medium">{{ label }}</label>
        <div class="relative">
            <input
                v-model="searchQuery"
                @input="debounceSearch"
                @change="updateSelected"
                list="itemsList"
                :placeholder="placeholder"
                class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
            />
            <datalist id="itemsList" class="absolute w-full">
                <option
                    v-for="item in filteredItems"
                    :key="item.id as PropertyKey"
                    :value="formatItem(item)"
                >
                    {{ formatItem(item) }}
                </option>
            </datalist>
            <div v-if="loading" class="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg
                    class="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash';
import { http } from '@/composables';
import type { DataItem } from '@/types/interfaces';
import type { PropType } from 'vue';
import type { AxiosResponse } from 'axios';

export default defineComponent({
    name: 'SearchInput',
    props: {
        endpoint: {
            type: String,
            required: true,
        },
        displayFields: {
            type: Array as PropType<string[]>,
            required: true,
        },
        placeholder: {
            type: String,
            default: 'Search...',
        },
        label: {
            type: String,
            default: '',
        },
        modelValue: {
            type: Object as PropType<DataItem | null>,
            required: true,
            default: null,
            validator: (value) => {
                return value === null || typeof value === 'object';
            },
        },
        additional: {
            type: Object as PropType<Record<string, unknown>>,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const searchQuery = ref<string>('');
        const filteredItems = ref<DataItem[]>([]);
        const loading = ref<boolean>(false);

        const search = async () => {
            if (searchQuery.value.length >= 3) {
                loading.value = true;
                try {
                    const response = await http.get<AxiosResponse<DataItem[]>>(props.endpoint, {
                        params: {
                            searchQuery: searchQuery.value,
                            noPagination: true,
                            ...props.additional,
                        },
                    });

                    filteredItems.value = response.data.data;
                } catch (error) {
                    console.error('Error fetching items:', error);
                } finally {
                    loading.value = false;
                }
            } else {
                filteredItems.value = [];
            }
        };

        const debounceSearch = debounce(search, 300);

        const formatItem = (item: DataItem): string => {
            if (!item || typeof item !== 'object') {
                return '';
            }

            return props.displayFields
                .map((field) => item[field] ?? '')
                .filter((value) => value)
                .join(' ');
        };

        const selectedItem = ref<DataItem | null>(null);

        const updateSelected = (event: Event) => {
            const input = event.target as HTMLInputElement;
            const selected = filteredItems.value.find((item: DataItem) => {
                return formatItem(item).toLowerCase() === input.value.toLowerCase();
            });
            if (selected) {
                selectedItem.value = selected;
                emit('update:modelValue', [selected]);
            }
        };

        // Watch selectedItem for changes and emit if different from props.modelValue
        watch(selectedItem, (newValue) => {
            if (newValue !== props.modelValue) {
                emit('update:modelValue', newValue);
            }
        });

        onMounted(() => {
            if (props.modelValue) {
                selectedItem.value = props.modelValue;
                searchQuery.value = formatItem(props.modelValue);
            }
        });

        return {
            searchQuery,
            filteredItems,
            loading,
            debounceSearch,
            updateSelected,
            formatItem,
            selectedItem,
        };
    },
});
</script>

<style scoped>
/* Ensure the datalist has the same width as the input */
input[list] {
    width: 100%;
}

datalist {
    width: 100%;
}
</style>
