<template>
    <div class="p-2">
        <slot name="header">
            <label class="block my-2 text-lg font-medium text-gray-900 dark:text-white">
                {{ label }}
            </label>
        </slot>
        <div v-if="enableSearch || enableNew" class="flex justify-between mb-2">
            <slot name="search">
                <!-- Search Input -->
                <div v-if="enableSearch" class="flex gap-1">
                    <input
                        v-model="searchQuery"
                        type="text"
                        :placeholder="`Search by ${searchField}`"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                    <button
                        @click="
                            $emit('load-data', {
                                searchQuery,
                                sortBy: sortByField,
                                sortOrder,
                                perPage,
                            })
                        "
                        class="px-2 py-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                    >
                        <font-awesome-icon :icon="['fas', 'search']" /> Search
                    </button>
                </div>
                <button
                    v-if="enableNew"
                    @click="$emit('create-new')"
                    class="px-2 py-1 text-xs rounded-md bg-tertiary text-on-tertiary hover:bg-tertiary-dark"
                >
                    <font-awesome-icon :icon="['fas', 'plus']" /> New {{ label }}
                </button>
            </slot>
        </div>

        <!-- Per Page Selection -->
        <div v-if="enablePerPage" class="mb-2">
            <label for="perPage" class="mr-2 text-xs font-medium text-gray-900 dark:text-white"
                >Items per page:</label
            >
            <select
                v-model="perPage"
                id="perPage"
                @change="emitLoadData"
                class="text-xs border rounded-md"
            >
                <option :value="15">15</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
            </select>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto">
            <table
                v-if="!isLoading"
                class="min-w-full text-left border border-gray-300 rounded-md shadow text-xs bg-surface text-on-surface"
            >
                <thead>
                    <tr class="bg-surface-variant">
                        <th
                            v-for="header in headers"
                            :key="header.key"
                            @click="sortBy(header.key)"
                            class="cursor-pointer px-2 py-1"
                        >
                            {{ header.label }}
                        </th>
                        <th class="px-2 py-1 flex justify-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, index) in paginatedData"
                        :key="item.id || index"
                        class="border-b hover:bg-surface-hover"
                    >
                        <td v-for="header in headers" :key="header.key" class="px-2 py-1">
                            <slot name="cell" :item="item" :key="header.key">
                                {{ item[header.key] }}
                            </slot>
                        </td>
                        <td class="px-2 py-1 flex justify-end">
                            <slot name="actions-prepend" :item="item"></slot>
                            <slot name="actions" :item="item">
                                <button
                                    v-if="enableEdit && item.enableEdit !== false"
                                    @click="$emit('edit-item', item)"
                                    class="px-1 py-1 mr-1 text-xs rounded bg-primary text-black hover:bg-secondary-dark"
                                >
                                    <font-awesome-icon :icon="['fas', 'edit']" /> Edit
                                </button>
                                <button
                                    v-if="enableDelete && item.enableDelete !== false"
                                    @click="$emit('delete-item', item.id)"
                                    class="px-1 py-1 text-xs rounded bg-secondary text-black hover:bg-error-dark"
                                >
                                    <font-awesome-icon :icon="['fas', 'trash']" /> Delete
                                </button>
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="totalPages > 1" class="flex justify-center mt-4">
            <fwb-pagination
                v-model="page"
                :total-pages="totalPages"
                show-icons
                large
                @update:model-value="changePage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineComponent, computed, ref } from 'vue';
import type { DataItem } from '@/types/interfaces';
import { FwbPagination } from 'flowbite-vue';

interface Header {
    key: string;
    label: string;
}

export default defineComponent({
    components: {
        FontAwesomeIcon,
        FwbPagination,
    },
    name: 'IndexComponent',
    props: {
        label: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: true,
        },
        headers: {
            type: Array as () => Header[],
            required: true,
        },
        searchField: {
            type: String,
            required: true,
        },
        enableSearch: {
            type: Boolean,
            default: true,
        },
        enableNew: {
            type: Boolean,
            default: true,
        },
        enableEdit: {
            type: Boolean,
            default: true,
        },
        enableDelete: {
            type: Boolean,
            default: true,
        },
        enablePerPage: {
            type: Boolean,
            default: false,
        },
        tableData: {
            type: Array as () => DataItem[],
            required: true,
        },
        currentPage: {
            type: Number,
            required: false,
            default: 1,
        },
        totalPages: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    emits: ['load-data', 'create-new', 'edit-item', 'delete-item', 'changePage'],
    setup(props, { emit }) {
        const sortByField = ref<string>('id');
        const sortOrder = ref<'asc' | 'desc'>('desc');
        const searchQuery = ref<string>('');
        const perPage = ref<number>(15);
        const page = ref<number>(props.currentPage);

        const emitLoadData = () => {
            emit('load-data', {
                page: page.value,
                searchQuery: searchQuery.value,
                sortBy: sortByField.value,
                sortOrder: sortOrder.value,
                perPage: perPage.value,
            });
        };

        const sortBy = (field: string): void => {
            if (sortByField.value === field) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortByField.value = field;
                sortOrder.value = 'desc';
            }
            emitLoadData();
        };

        const paginatedData = computed(() => {
            return props.tableData;
        });

        const changePage = (newPage: number) => {
            emit('changePage', newPage);
        };

        return {
            sortByField,
            sortOrder,
            searchQuery,
            sortBy,
            paginatedData,
            perPage,
            emitLoadData,
            page,
            changePage,
        };
    },
});
</script>

<style scoped></style>
