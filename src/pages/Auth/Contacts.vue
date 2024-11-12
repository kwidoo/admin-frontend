<template>
    <div>
        <index-component
            :is-loading="loading"
            :label="'Contacts'"
            :headers="headers"
            :search-field="''"
            :enable-search="!inline"
            :enable-new="true"
            :enable-edit="true"
            :enable-delete="true"
            :table-data="contactValues"
            :current-page="currentPage"
            :total-pages="lastPage"
            :enable-per-page="!inline"
            @load-data="loadData"
            @create-new="createNewItem"
            @edit-item="editItem"
            @delete-item="confirmDelete"
            @change-page="changePage"
        >
            <template v-if="!inline" #actions-prepend="{ item }">
                <button
                    @click="toCustomer(item)"
                    class="px-1 py-1 mr-1 text-xs rounded bg-primary text-black hover:bg-secondary-dark"
                >
                    <font-awesome-icon :icon="['fas', 'user']" />Profile
                </button>
            </template>
        </index-component>

        <!-- Modal for New/Edit Contact -->
        <modal-component v-if="isModalOpen" :is-modal-open="isModalOpen" @close-modal="closeModal"
            ><template #header></template>
            <template #content>
                <div
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
                >
                    <div class="bg-white rounded-lg shadow-lg w-1/2 p-6">
                        <router-view :key="$route.fullPath" @close-modal="closeModal" />
                    </div>
                </div>
            </template>
        </modal-component>

        <confirm-modal
            :is-modal-open="isDeleteModalOpen"
            text="Are you sure you want to delete this contact?"
            @close-modal="cancelDelete"
            @action="deleteContact"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useContactService } from '@/composables';
import router from '@/router';
import { useToast } from 'vue-toastification';
import type { Contact } from '@/types/interfaces';
import { useRoute } from 'vue-router';
import { ConfirmModal, IndexComponent, ModalComponent } from '@/components';

interface Header {
    key: string;
    label: string;
}

interface LoadDataParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchQuery?: string;
    page: number | null;
    perPage?: number;
}

export default defineComponent({
    components: {
        IndexComponent,
        ConfirmModal,
        ModalComponent,
    },
    name: 'ContactsComponent',
    props: {
        contacts: {
            type: Array as () => Contact[],
            required: false,
            default: null,
        },
        customerId: {
            type: String,
            required: false,
            default: null,
        },
    },
    emits: ['close-modal'],
    setup(props, { emit }) {
        const isModalOpen = ref(false);
        const isDeleteModalOpen = ref(false);
        const toDeleteId = ref<number | null>(null);
        const loading = ref(false);
        const currentPage = ref(1);
        const lastPage = ref(1);
        const perPage = ref<number>(15);

        const headers = ref<Header[]>([
            { key: 'contactValue', label: 'Contact Value' },
            { key: 'contactType', label: 'Contact Type' },
        ]);

        const contactValues = ref<Contact[]>([]);
        const sortByField = ref<string>('contactValue');
        const sortOrder = ref<'asc' | 'desc'>('desc');
        const searchQuery = ref<string>('');
        const toast = useToast();

        const route = useRoute();
        const inline = computed((): boolean => {
            return !!props.contacts;
        });

        const loadData = async (params: LoadDataParams | null) => {
            if (route.meta.modal) {
                isModalOpen.value = true;
            }
            if (inline.value) {
                contactValues.value = props.contacts;
            } else {
                try {
                    sortByField.value = params?.sortBy || sortByField.value;
                    sortOrder.value = params?.sortOrder || sortOrder.value;
                    searchQuery.value = params?.searchQuery || searchQuery.value;
                    perPage.value = params?.perPage || perPage.value;

                    const response = await useContactService.fetch(
                        currentPage.value,
                        {
                            orderBy: sortByField.value,
                            order: sortOrder.value,
                        },
                        searchQuery.value,
                        perPage.value,
                        false,
                    );
                    contactValues.value = response.contacts;
                    lastPage.value = response.lastPage;
                    headers.value.unshift({ key: 'name', label: 'Name' });
                } catch (error) {
                    toast.error('Failed to load contacts');
                }
            }
        };

        const createNewItem = () => {
            if (inline.value) {
                isModalOpen.value = true;
                router.push({
                    name: 'CustomerContactDetail',
                    params: {
                        customerId: props.customerId,
                    },
                });
            } else {
                router.push({ name: 'ContactDetail' });
            }
        };

        const editItem = (contact: Contact) => {
            if (inline.value) {
                isModalOpen.value = true;
                router.push({
                    name: 'CustomerContactDetail',
                    params: {
                        customerId: contact.customerId,
                        contactId: contact.id,
                    },
                });
            } else {
                router.push({
                    name: 'ContactDetail',
                    params: {
                        contactId: contact.id,
                    },
                });
            }
        };

        const confirmDelete = (contactId: number) => {
            isDeleteModalOpen.value = true;
            toDeleteId.value = contactId;
        };

        const deleteContact = async () => {
            try {
                if (!toDeleteId.value) {
                    throw new Error('Contact ID is not set');
                }
                isDeleteModalOpen.value = false;
                await useContactService.delete(toDeleteId.value);
                contactValues.value = contactValues.value.filter(
                    (contact) => contact.id !== toDeleteId.value,
                );
                toast.success('Contact deleted successfully');
            } catch (error) {
                toast.error('Failed to delete contact');
                throw error;
            }
        };

        const cancelDelete = () => {
            isDeleteModalOpen.value = false;
            toDeleteId.value = null;
        };

        const closeModal = async () => {
            isModalOpen.value = false;
            emit('close-modal');
        };

        const toCustomer = (contact: Contact) => {
            router.push({
                name: 'CustomerDetail',
                params: {
                    customerId: contact.customerId,
                },
            });
        };

        const changePage = async (page: number) => {
            currentPage.value = page;
            loading.value = true;
            await loadData({
                page,
                sortBy: sortByField.value,
                sortOrder: sortOrder.value,
                searchQuery: searchQuery.value,
                perPage: perPage.value,
            });
            loading.value = false;
        };

        onMounted(loadData);

        return {
            loading,
            headers,
            contactValues,
            currentPage,
            lastPage,
            loadData,
            createNewItem,
            editItem,
            confirmDelete,
            deleteContact,
            cancelDelete,
            isDeleteModalOpen,
            isModalOpen,
            closeModal,
            inline,
            toCustomer,
            changePage,
        };
    },
});
</script>

<style scoped></style>
