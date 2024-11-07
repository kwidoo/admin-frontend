<template>
    <div v-if="!loading">
        <index-component
            :label="'Customer'"
            :headers="headers"
            :search-field="''"
            :enable-search="true"
            :enable-new="true"
            :enable-edit="true"
            :enable-delete="true"
            :table-data="customers"
            :current-page="currentPage"
            :total-pages="lastPage"
            @load-data="loadData"
            @create-new="createNewItem"
            @edit-item="editItem"
            @delete-item="deleteItem"
            @change-page="changePage"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IndexComponent from '@/components/IndexComponent.vue';
import { useCustomerService } from '@/composables';
import router from '@/router';
import { useToast } from 'vue-toastification';
import type { Customer } from '@/types/interfaces';

interface Header {
    key: string;
    label: string;
}

export default defineComponent({
    components: {
        IndexComponent,
    },
    name: 'ParentTableComponent',
    setup() {
        const { t } = useI18n();
        const loading = ref<boolean>(false);
        const currentPage = ref<number>(1);
        const lastPage = ref<number>(1);

        const headers = ref<Header[]>([
            { key: 'id', label: t('ID') },
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'referralCode', label: 'Referral Code' },
            { key: 'type', label: 'Type' },
        ]);

        const customers = ref<Customer[]>([]);
        const sortByField = ref<string>('id');
        const sortOrder = ref<'asc' | 'desc'>('desc');
        const searchQuery = ref<string>('');
        const toast = useToast();

        const loadData = async () => {
            try {
                const response = await useCustomerService.fetch(
                    currentPage.value,
                    {
                        sortBy: sortByField.value,
                        sortOrder: sortOrder.value,
                    },
                    searchQuery.value,
                );
                customers.value = response.customers;
                lastPage.value = response.lastPage;
                currentPage.value = response.currentPage;
            } catch (error) {
                toast.error('Failed to load customers');
                throw error;
            }
        };

        const createNewItem = () => {
            router.push({
                name: 'CustomerDetail',
            });
        };

        const editItem = (customer: Customer) => {
            if (!customer.id) {
                throw new Error('Customer ID is not set');
            }
            router.push({
                name: 'CustomerDetail',
                params: { customerId: customer.id },
            });
        };

        const deleteItem = (itemId: number) => {
            console.log('Deleting item with ID:', itemId);
            // Handle deleting the item
        };

        const changePage = async (page: number) => {
            currentPage.value = page;
            loading.value = true;
            await loadData();
            loading.value = false;
        };

        onMounted(() => {
            loadData();
        });

        return {
            loading,
            headers,
            customers,
            currentPage,
            lastPage,
            loadData,
            createNewItem,
            editItem,
            deleteItem,
            changePage,
        };
    },
});
</script>

<style scoped></style>
