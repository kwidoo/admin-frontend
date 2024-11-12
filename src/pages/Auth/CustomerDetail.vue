<template>
    <div v-if="!loading" class="customer-detail">
        <h1>{{ isEditMode ? 'Edit Customer' : 'Create Customer' }}</h1>
        <form @submit.prevent>
            <div v-if="!isEditMode">
                <div class="flex gap-4 mt-2">
                    <search-input
                        label="Mentor"
                        :endpoint="`/iam/api/v1/customers`"
                        :display-fields="['firstName', 'lastName', 'referralCode']"
                        :additional="{ onlyPartners: true }"
                        placeholder="Search customer"
                        v-model="customerSelected"
                    />
                </div>
                <div class="flex gap-4 mt-2" v-if="customerSelected">
                    <universal-input
                        input-id="referralCode"
                        label="Referral Code"
                        v-model="customerSelected.referralCode"
                        :required="true"
                        :clearable="false"
                        :fetch-on-mount="false"
                        :readonly="true"
                        :can-generate="false"
                    />
                    <universal-input
                        input-id="partnerCode"
                        label="Partner Code"
                        v-model="customerSelected.partnerCode"
                        :required="true"
                        :clearable="false"
                        :fetch-on-mount="false"
                        :readonly="true"
                        :can-generate="false"
                    />
                </div>
                <hr class="mt-4" />
            </div>
            <div class="flex gap-4 mt-4">
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
                    v-if="isEditMode"
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
                    v-else
                    input-id="referralCode"
                    label="Referral Code"
                    v-model="customer.forceReferralCode"
                    :required="true"
                    :clearable="false"
                    :fetch-on-mount="customer.id === null"
                    :readonly="true"
                    :can-generate="false"
                />
                <universal-input
                    v-if="isEditMode && customer.isPartner"
                    input-id="partnerCode"
                    label="Partner Code"
                    v-model="customer.partnerCode"
                    :required="customer.isPartner"
                    :clearable="!customer.isPartner"
                    :fetch-on-mount="customer.id === null || customer.partnerCode === null"
                    :can-generate="false"
                    :readonly="customer.isPartner"
                />
                <universal-input
                    v-if="!isEditMode && customer.isPartner"
                    input-id="partnerCode"
                    label="Partner Code"
                    v-model="customer.forcePartnerCode"
                    :required="true"
                    :clearable="false"
                    :fetch-on-mount="customer.id === null"
                    :readonly="true"
                    :can-generate="false"
                />
                <universal-input
                    v-if="customer.isPartner"
                    :can-generate="false"
                    :can-update="customer.id !== null"
                    :readonly="!customer.isPartner"
                    input-id="idru"
                    label="RU ID"
                    v-model="customer.idru"
                    @save-ru-id="saveRuId"
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
                        <option
                            v-for="country in countries"
                            :key="country.id"
                            :value="country.bagistoId"
                        >
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
                <div v-if="customer.isPartner" class="form-group mt-4 w-1/4">
                    <label for="qualificationPeriod" class="block mb-1 text-sm font-medium">
                        Qualification period:
                    </label>
                    <input
                        type="datetime-local"
                        id="qualificationPeriod"
                        v-model="qualificationPeriod"
                        @input="updateQualificationPeriod($event)"
                        placeholder="Qualification period"
                        class="px-2 py-1 w-full border rounded-md text-xs bg-secondary text-on-primary placeholder:text-on-primary-secondary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
                <div v-if="customer.isPartner" class="form-group mt-4 w-1/4">
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

                <simple-input
                    id="totalOrdered"
                    label="Total Ordered"
                    v-model="customer.totalOrdered"
                    readonly
                    form-class="w-1/4"
                />
            </div>
            <customer-type-component
                :initial-customer-type="customer.type"
                :customer-id="customer.id"
                :partner-code="customer.partnerCode as string"
                @customer-type-changed="updateCustomerType"
            />
            <div class="flex gap-4 mt-4">
                <select-component
                    v-model="customer.preferredContact"
                    label="Preferred Contact"
                    id="preferredContact"
                    :options="{
                        EMAIL: 'Email',
                        PHONE: 'Phone',
                        TELEGRAM: 'Telegram',
                        WHATSAPP: 'Whatsapp',
                    }"
                    required
                    :readonly="!customer.id"
                    form-class="w-1/3"
                />
                <simple-input
                    v-if="!customer.id"
                    v-model="customer.phone"
                    label="Phone"
                    id="phone"
                    form-class="w-1/3"
                    :required="true"
                >
                    <template #append>
                        <button
                            @click.prevent="checkPhone"
                            class="px-2 py-1 ml-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                        >
                            Verify
                            <font-awesome-icon :icon="['fas', 'check']" />
                        </button>
                    </template>
                </simple-input>

                <div v-if="!customer.id" class="form-group mt-4">
                    <label for="notify" class="block mb-1 text-sm font-medium">Notify:</label>
                    <input
                        type="checkbox"
                        id="notify"
                        v-model="customer.notify"
                        class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                </div>
            </div>
            <div v-if="customer.id" class="flex gap-4 mt-4">
                <div class="form-group mt-4 w-1/2">
                    <logins :customer="customer" />
                </div>
                <div class="form-group mt-4 w-1/2">
                    <contacts
                        :key="contactKey"
                        :contacts="customer.contacts"
                        :user-id="customer.id"
                    />
                </div>
            </div>
            <div class="flex gap-4 mt-4 justify-between">
                <button
                    @click.prevent="cancel"
                    class="px-2 py-1 mt-4 mr-2 text-xs rounded bg-secondary text-black hover:bg-error-dark"
                >
                    Cancel
                </button>
                <div class="flex mt-4 items-center">
                    <label v-if="saveError" for="force" class="block text-sm font-medium mr-2"
                        >Force</label
                    >
                    <input
                        v-if="saveError"
                        type="checkbox"
                        id="force"
                        v-model="customer.force"
                        class="px-2 py-1 mr-2 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                    />
                    <button
                        @click.prevent="save"
                        class="px-2 py-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerService, useCountryService, useLoginService } from '@/composables';
import {
    IndexComponent,
    CustomerType as CustomerTypeComponent,
    UniversalInput,
    SelectComponent,
    SearchInput,
    SimpleInput,
} from '@/components';
import type { Customer, Country, CustomerType } from '@/types/interfaces';
import Contacts from '@/pages/Auth/Contacts.vue';
import Logins from '@/pages/Auth/Logins.vue';
import type { AxiosError } from 'axios';

export default defineComponent({
    name: 'CustomerDetails',
    components: {
        IndexComponent,
        CustomerTypeComponent,
        UniversalInput,
        Contacts,
        Logins,
        SearchInput,
        SelectComponent,
        SimpleInput,
    },
    setup() {
        const loading = ref<boolean>(true);

        const route = useRoute();
        const router = useRouter();
        const toast = useToast();

        const defaultPeriod = (regDate: Date | null): string => {
            let realDate: Date | null = regDate;
            if (regDate === null) {
                realDate = new Date();
                realDate.setMonth(realDate.getMonth() + 2);
                realDate.setDate(0);
            }
            return `${useDateFormat(realDate as Date, 'YYYY-MM-DD').value} 23:59`;
        };
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
            qualificationPeriod: defaultPeriod(null),
            qualificationRank: 'R',
            totalOrdered: 0,
            bundleEnable: true,
            notes: '',
            contacts: [
                {
                    id: null,
                    name: null,
                    customerId: null,
                    contactType: 'PHONE',
                    contactValue: '',
                },
            ],
            password: null,
        });
        const countries = ref<Country[]>([]);
        const isEditMode = computed(() => customer.value.id !== null);

        const contactHeaders = ref([
            { key: 'contactType', label: 'Contact Type' },
            { key: 'contactValue', label: 'Contact Value' },
        ]);

        const contactKey = ref(0);
        const reloadContacts = () => {
            contactKey.value += 1;
        };

        onMounted(async () => {
            loading.value = true;
            countries.value = await useCountryService.fetchCountries();

            const customerId: string = route.params.customerId as string;
            if (customerId) {
                try {
                    customer.value = await useCustomerService.fetchCustomer(customerId);
                } catch (error) {
                    toast.error('Error fetching customer details');
                }
            }
            loading.value = false;
        });

        const saveError = ref<AxiosError | null>(null);
        const save = async () => {
            try {
                const response: Customer = await useCustomerService.saveCustomer(customer.value);
                toast.success(`Customer with id ${response.data.id} saved successfully`);
                router.push({ name: 'Customers' });
            } catch (error) {
                saveError.value = error as AxiosError;
                toast.error(
                    (saveError.value.response?.data as object as { message: string }).message,
                );
            }
        };

        const updateCustomerType = (newType: CustomerType) => {
            customer.value = useCustomerService.fromType(customer.value, newType);
        };

        const generate = async (type: string = 'referral_code') => {
            return useCustomerService.generate(type);
        };

        const cancel = () => {
            router.push({ name: 'Customers' });
        };

        const updateQualificationPeriod = (event: Event) => {
            const input = event.target as HTMLInputElement;
            customer.value.qualificationPeriod = input.value;
        };

        const saveRuId = async (ruId: string) => {
            if (!customer.value.id) {
                return;
            }
            try {
                const response: Customer = await useCustomerService.updateRuid(
                    customer.value.id,
                    ruId,
                );

                if (response.idru) {
                    customer.value.idru = response.idru;
                    toast.success('RU ID updated successfully');
                }
            } catch (error) {
                toast.error('Error updating RU ID');
            }
        };

        const qualificationPeriod = ref<string | null>(defaultPeriod(null));

        watch(customer, () => {
            if (customer.value.id && customer.value.qualificationPeriod !== null) {
                qualificationPeriod.value = defaultPeriod(
                    new Date(customer.value.qualificationPeriod),
                );
            }
            if (customer.value.id && customer.value.qualificationPeriod === null) {
                qualificationPeriod.value = null;
            }
        });

        watch(qualificationPeriod, (newValue) => {
            if (customer.value.qualificationPeriod !== newValue) {
                customer.value.qualificationPeriod = newValue as string;
            }
        });

        const customerSelected = ref<Customer | null>({} as Customer);

        watch(customerSelected, () => {
            if (customerSelected.value) {
                customer.value.referralCode = customerSelected.value.referralCode;
                customer.value.partnerCode = customerSelected.value.partnerCode;
                if (customer.value.isPartner) {
                    customer.value.referralCode = null;
                }
                if (customer.value.isPartner === false) {
                    customer.value.partnerCode = null;
                }
            }
        });

        const checkPhone = async () => {
            if (!customer.value.phone) {
                return;
            }
            try {
                const response = await useLoginService.search(customer.value.phone);
                if (response.data.length === 0) {
                    toast.success('Phone is not registered');
                } else {
                    toast.error('Phone is already in use');
                }
            } catch (error) {
                toast.error('Error checking phone');
            }
        };

        return {
            loading,
            countries,

            customer,
            isEditMode,
            save,
            cancel,

            updateCustomerType,
            generate,

            contactHeaders,
            contactKey,
            reloadContacts,
            updateQualificationPeriod,
            saveRuId,
            customerSelected,
            qualificationPeriod,
            checkPhone,
            saveError,
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
