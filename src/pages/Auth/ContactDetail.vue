<template>
    <form @submit.prevent>
        <div v-if="!inline" class="flex gap-4 mt-4">
            <div class="form-group mt-4 w-1/3 relative">
                <label class="block mb-1 text-sm font-medium">Customer</label>
                <input
                    v-model="selectedCustomerName"
                    @input="searchCustomer"
                    @change="updateUserId"
                    list="customersList"
                    placeholder="Search customer"
                    class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                />
                <datalist id="customersList" class="absolute w-full">
                    <option
                        v-for="customer in filteredCustomers"
                        :key="customer.id"
                        :value="`${customer.firstName} ${customer.lastName}`"
                        :data-id="customer.id"
                    >
                        {{ customer.firstName }} {{ customer.lastName }}
                    </option>
                </datalist>
            </div>
        </div>

        <div class="flex gap-4 mt-4">
            <div class="form-group mt-4 w-1/3">
                <label class="block mb-1 text-sm font-medium">Contact Type</label>
                <select
                    v-model="contactForm.contactType"
                    class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                >
                    <option value="PHONE">Phone</option>
                    <option value="EMAIL">Email</option>
                </select>
            </div>

            <div class="form-group mt-4 w-2/3">
                <label class="block mb-1 text-sm font-medium">Contact Value</label>
                <input
                    v-model="contactForm.contactValue"
                    type="text"
                    class="mt-1 block w-full px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    required
                />
            </div>
        </div>

        <div class="flex justify-end mt-6">
            <button
                type="button"
                @click="cancel"
                class="px-2 py-1 mt-4 mr-2 text-xs rounded bg-secondary text-black hover:bg-error-dark"
            >
                Cancel
            </button>
            <button
                @click.prevent="save"
                class="px-2 py-1 mt-4 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
            >
                {{ modalMode === 'edit' ? 'Save Changes' : 'Add Contact' }}
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

import { useContactService, useCustomerService } from '@/composables';
import type { Contact, Customer } from '@/types/interfaces';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'ContactDetail',
    props: {
        contactId: {
            type: String,
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
        const toast = useToast();
        const router = useRouter();
        const route = useRoute();
        const customers = ref<Customer[]>([]);
        const filteredCustomers = ref<Customer[]>([]);

        const contactForm = ref<Contact>({
            id: props.contactId as unknown as number,
            name: '',
            customerId: props.customerId as unknown as number,
            contactType: 'PHONE',
            contactValue: '',
        });

        const modalMode = computed(() => (props.contactId ? 'edit' : 'add'));

        const inline = computed(() => route.name !== 'ContactDetail');

        const selectedCustomerName = computed({
            get: () => {
                const selectedCustomer = customers.value.find(
                    (customer) => customer.id === contactForm.value.customerId,
                );
                return selectedCustomer
                    ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                    : '';
            },
            set: (name) => {
                const selectedCustomer = customers.value.find(
                    (customer) =>
                        `${customer.firstName} ${customer.lastName}`.toLowerCase() ===
                        name.toLowerCase(),
                );
                if (selectedCustomer) {
                    contactForm.value.customerId = selectedCustomer.id;
                }
            },
        });

        const save = async () => {
            try {
                const response: Contact = await useContactService.save(contactForm.value);
                toast.success(`Contact with id ${response.id} was saved successfully`);
                if (inline.value) {
                    emit('close-modal');
                } else {
                    router.push({ name: 'Contacts' });
                }
            } catch (error) {
                toast.error('Error saving contact');
                throw error;
            }
        };

        const searchCustomer = () => {
            filteredCustomers.value = customers.value.filter((customer) =>
                `${customer.firstName} ${customer.lastName}`
                    .toLowerCase()
                    .includes(selectedCustomerName.value.toLowerCase()),
            );
        };

        const updateUserId = (event: Event) => {
            const input = event.target as HTMLInputElement;
            const selectedCustomer = customers.value.find(
                (customer) => `${customer.firstName} ${customer.lastName}` === input.value,
            );
            if (selectedCustomer) {
                contactForm.value.customerId = selectedCustomer.id;
            }
        };

        onMounted(async () => {
            if (props.contactId) {
                contactForm.value = await useContactService.fetchById(props.contactId);
            }
            const response = await useCustomerService.fetch();
            customers.value = response.customers;
            filteredCustomers.value = customers.value;

            if (props.customerId) {
                contactForm.value.customerId = props.customerId;
            }
        });

        const cancel = () => {
            if (inline.value) {
                emit('close-modal');
            } else {
                router.push({ name: 'Contacts' });
            }
        };

        return {
            modalMode,
            contactForm,
            selectedCustomerName,
            filteredCustomers,
            save,
            cancel,
            searchCustomer,
            updateUserId,
            inline,
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
