<template>
    <div v-if="!loading" class="customer-detail">
        <h1>{{ isEditMode ? 'Edit Customer' : 'Create Customer' }}</h1>
        <form @submit.prevent="save">
            <div class="flex gap-4">
                <div class="form-group w-1/2">
                    <label for="firstName" class="block mb-1 text-sm font-medium"
                        >First Name:</label
                    >
                    <input
                        type="text"
                        id="firstName"
                        v-model="customer.firstName"
                        required
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group w-1/2">
                    <label for="lastName" class="block mb-1 text-sm font-medium">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        v-model="customer.lastName"
                        required
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
            </div>
            <div class="flex gap-4 mt-2">
                <universal-input
                    input-id="referralCode"
                    label="Referral Code"
                    v-model="customer.referralCode"
                    :required="true"
                    :clearable="false"
                    :fetch-on-mount="customer.id === null"
                    :readonly="true"
                    :can-generate="false"
                />
                <universal-input
                    v-if="customer.isPartner"
                    input-id="partnerCode"
                    label="Partner Code"
                    v-model="customer.partnerCode"
                    :required="customer.isPartner"
                    :clearable="!customer.isPartner"
                    :fetch-on-mount="customer.id === null && customer.isPartner"
                    :can-generate="false"
                    :readonly="customer.isPartner"
                />
                <universal-input
                    v-if="customer.isPartner"
                    :can-generate="false"
                    :readonly="true"
                    input-id="idru"
                    label="RU ID"
                    v-model="customer.idru"
                />
            </div>
            <div class="flex gap-4 mt-2">
                <div class="form-group w-1/2">
                    <label for="gender" class="block mb-1 text-sm font-medium">Gender:</label>
                    <select
                        id="gender"
                        v-model="customer.gender"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div class="form-group w-1/2">
                    <label for="dateOfBirth" class="block mb-1 text-sm font-medium"
                        >Date of Birth:</label
                    >
                    <input
                        type="date"
                        id="dateOfBirth"
                        v-model="customer.dateOfBirth"
                        required
                        datepicker
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
            </div>
            <div class="flex gap-4 mt-4">
                <div class="form-group w-1/2">
                    <label for="countryId" class="block mb-1 text-sm font-medium">Country:</label>
                    <select
                        id="countryId"
                        v-model="customer.countryId"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    >
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group w-1/2">
                    <label for="city" class="block mb-1 text-sm font-medium">City:</label>
                    <input
                        type="text"
                        id="city"
                        v-model="customer.city"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
            </div>

            <div class="flex gap-4 mt-4">
                <div class="form-group mt-4">
                    <label for="isActive" class="block mb-1 text-sm font-medium">Active:</label>
                    <input
                        type="checkbox"
                        id="isActive"
                        v-model="customer.isActive"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group mt-4">
                    <label for="isSubscribed" class="block mb-1 text-sm font-medium"
                        >Subscribed:</label
                    >
                    <input
                        type="checkbox"
                        id="isSubscribed"
                        v-model="customer.isSubscribed"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group mt-4">
                    <label for="isVerified" class="block mb-1 text-sm font-medium">Verified:</label>
                    <input
                        type="checkbox"
                        id="isVerified"
                        v-model="customer.isVerified"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group mt-4">
                    <label for="bundleEnabled" class="block mb-1 text-sm font-medium"
                        >Bundle enabled:</label
                    >
                    <input
                        type="checkbox"
                        id="bundleEnabled"
                        v-model="customer.bundleEnable"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group mt-4">
                    <label for="confirmPersonalData" class="block mb-1 text-sm font-medium"
                        >Personal <br />data confirmed:</label
                    >
                    <input
                        type="checkbox"
                        id="confirmPersonalData"
                        v-model="customer.confirmPersonalData"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group w-1/4">
                    <label for="qualificationPeriod" class="block mb-1 text-sm font-medium"
                        >Qualification period:</label
                    >
                    <input
                        type="date"
                        id="qualificationPeriod"
                        v-model="customer.qualificationPeriod"
                        datepicker
                        datepicker-format="mm-dd-yyyy"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div class="form-group">
                    <label for="qualificationRank" class="block mb-1 text-sm font-medium"
                        >Qualification Rank:</label
                    >
                    <select
                        id="qualificationRank"
                        v-model="customer.qualificationRank"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    >
                        <option value="A">A</option>
                        <option value="R">R</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="totalOrdered" class="block mb-1 text-sm font-medium"
                        >Total Ordered:</label
                    >
                    <input
                        type="text"
                        id="totalOrdered"
                        v-model="customer.totalOrdered"
                        readonly
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
            </div>
            <customer-type-component
                :initial-customer-type="customer.type"
                :customer-id="customer.id"
                @customer-type-changed="updateCustomerType"
            />

            <div class="form-group mt-4">
                <label for="preferredContact" class="block mb-1 text-sm font-medium"
                    >Preferred Contact:</label
                >
                <select
                    id="preferredContact"
                    v-model="customer.preferredContact"
                    class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                </select>
            </div>

            <index-component
                v-if="customer.id"
                :label="'Contacts'"
                :headers="contactHeaders"
                :search-field="''"
                :enable-search="false"
                :enable-new="true"
                :enable-edit="true"
                :enable-delete="true"
                :table-data="customer.contacts"
                :current-page="1"
                :total-pages="1"
                @create-new="createNewContact"
                @edit-item="editContact"
                @delete-item="deleteContact"
            />
            <div class="form-group mt-4">
                <label for="notes" class="block mb-1 text-sm font-medium">Notes:</label>
                <textarea
                    id="notes"
                    v-model="customer.notes"
                    class="px-2 py-1 w-full h-32 border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                ></textarea>
            </div>

            <button
                type="submit"
                class="px-2 py-1 mt-4 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
            >
                Save
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerService, useCountryService } from '@/composables';
import {
    IndexComponent,
    CustomerType as CustomerTypeComponent,
    UniversalInput,
} from '@/components';
import type { Customer, Country, Contact, CustomerType } from '@/types/interfaces';
import { useToast } from 'vue-toastification';

export default defineComponent({
    name: 'CustomerDetails',
    components: {
        IndexComponent,
        CustomerTypeComponent,
        UniversalInput,
    },
    setup() {
        const loading = ref<boolean>(true);
        const route = useRoute();
        const router = useRouter();
        const toast = useToast();
        const customer = ref<Customer>({
            id: null,
            firstName: '',
            lastName: '',
            gender: 'MALE',
            dateOfBirth: '',
            preferredContact: 'PHONE',
            city: '',
            countryId: null,
            isActive: true,
            isSubscribed: false,
            isVerified: true,
            isPartner: false,
            contractIsSigned: false,
            confirmPersonalData: true,
            referralCode: '',
            partnerCode: '',
            idru: '',
            qualificationPeriod: '',
            qualificationRank: 'A',
            totalOrdered: 0,
            bundleEnable: true,
            notes: '',
            contacts: [
                {
                    id: null,
                    contactType: 'PHONE',
                    contactValue: '',
                },
            ],
            password: null,
        });
        const countries = ref<Country[]>([]);
        const isEditMode = ref(false);

        const contactHeaders = ref([
            { key: 'contactType', label: 'Contact Type' },
            { key: 'contactValue', label: 'Contact Value' },
        ]);

        const createNewContact = () => {
            customer.value.contacts.push({ id: Date.now(), contactType: '', contactValue: '' });
        };

        const editContact = (contact: Contact) => {
            console.log('Editing contact:', contact);
        };

        const deleteContact = (contactIndex: number) => {
            customer.value.contacts.splice(contactIndex, 1);
        };

        onMounted(async () => {
            loading.value = true;
            countries.value = await useCountryService.fetchCountries();

            const customerId: string = route.params.id as string;
            if (customerId) {
                try {
                    customer.value = await useCustomerService.fetchCustomer(customerId);
                    isEditMode.value = true;
                } catch (error) {
                    toast.error('Error fetching customer details');
                }
            }
            loading.value = false;
        });

        const save = async () => {
            try {
                const response: Customer = await useCustomerService.saveCustomer(customer.value);
                toast.success(`Customer with id${response.id}saved successfully`);
                router.push({ name: 'Customers' });
            } catch (error) {
                toast.error('Error saving customer');
            }
        };

        const updateCustomerType = (newType: CustomerType) => {
            customer.value = useCustomerService.fromType(customer.value, newType);
        };

        const generate = async (type: string = 'referral_code') => {
            return useCustomerService.generate(type);
        };

        return {
            loading,
            countries,

            customer,
            isEditMode,
            save,

            updateCustomerType,
            generate,

            contactHeaders,
            createNewContact,
            editContact,
            deleteContact,
        };
    },
});
</script>

<style scoped>
.customer-detail {
    padding: 1rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-group {
    margin-bottom: 1rem;
}
</style>
