<template>
    <div v-if="!loading">
        <index-component
            :label="'Contacts'"
            :headers="headers"
            :search-field="''"
            :enable-search="false"
            :enable-new="true"
            :enable-edit="true"
            :enable-delete="true"
            :table-data="contactValues"
            :current-page="currentPage"
            :total-pages="lastPage"
            @create-new="createNewItem"
            @edit-item="editItem"
            @delete-item="confirmDelete"
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
        <div
            v-if="isModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
        >
            <div class="bg-white rounded-lg shadow-lg w-1/2 p-6">
                <router-view :key="$route.fullPath" @close-modal="closeModal" />
            </div>
        </div>
        <div
            v-if="isDeleteModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
        >
            <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
                <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this contact?</p>
                <div class="flex justify-end gap-4 mt-4">
                    <button @click="cancelDelete" class="px-3 py-1 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button @click="deleteContact" class="px-3 py-1 bg-red-500 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import IndexComponent from '@/components/IndexComponent.vue';
import { useContactService } from '@/composables';
import router from '@/router';
import { useToast } from 'vue-toastification';
import type { Contact } from '@/types/interfaces';
import { useRoute } from 'vue-router';

interface Header {
    key: string;
    label: string;
}

export default defineComponent({
    components: {
        IndexComponent,
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

        const headers = ref<Header[]>([
            { key: 'contactType', label: 'Contact Type' },
            { key: 'contactValue', label: 'Contact Value' },
        ]);

        const contactValues = ref<Contact[]>([]);
        const toast = useToast();

        const route = useRoute();
        const inline = computed((): boolean => {
            return !!props.contacts;
        });

        const loadData = async () => {
            if (route.meta.modal) {
                isModalOpen.value = true;
            }
            if (inline.value) {
                contactValues.value = props.contacts;
            } else {
                try {
                    const response = await useContactService.fetch(currentPage.value);
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

        const closeModal = () => {
            isModalOpen.value = false;
            emit('close-modal');
        };

        const toCustomer = (contact: Contact) => {
            console.log('toCustomer', contact);
            router.push({
                name: 'CustomerDetail',
                params: {
                    customerId: contact.customerId,
                },
            });
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
        };
    },
});
</script>

<style scoped></style>
