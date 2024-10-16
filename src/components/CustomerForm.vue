<template>
    <div class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
        <form @submit.prevent="submitForm">
            <!-- First Name -->
            <div class="mb-4">
                <label
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                    >First Name</label
                >
                <input
                    type="text"
                    v-model="form.firstName"
                    id="firstName"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.firstName }"
                />
                <span
                    v-if="errors.first_name"
                    class="text-red-500 text-sm"
                    >{{ errors.first_name }}</span
                >
            </div>

            <!-- Last Name -->
            <div class="mb-4">
                <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                    >Last Name</label
                >
                <input
                    type="text"
                    v-model="form.lastName"
                    id="lastName"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.lastName }"
                />
                <span
                    v-if="errors.lastName"
                    class="text-red-500 text-sm"
                    >{{ errors.lastName }}</span
                >
            </div>

            <!-- Gender -->
            <div class="mb-4">
                <label
                    for="gender"
                    class="block text-sm font-medium text-gray-700"
                    >Gender</label
                >
                <select
                    id="gender"
                    v-model="form.gender"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.gender }"
                >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
                <span
                    v-if="errors.gender"
                    class="text-red-500 text-sm"
                    >{{ errors.gender }}</span
                >
            </div>

            <!-- Date of Birth -->
            <div class="mb-4">
                <label
                    for="dateOfBirth"
                    class="block text-sm font-medium text-gray-700"
                    >Date of Birth</label
                >
                <input
                    type="date"
                    v-model="form.dateOfBirth"
                    id="dateOfBirth"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.dateOfBirth }"
                />
                <span
                    v-if="errors.dateOfBirth"
                    class="text-red-500 text-sm"
                    >{{ errors.dateOfBirth }}</span
                >
            </div>

            <!-- Phone -->
            <div class="mb-4">
                <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                    >Phone</label
                >
                <input
                    type="tel"
                    v-model="form.phone"
                    id="phone"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.phone }"
                />
                <span
                    v-if="errors.phone"
                    class="text-red-500 text-sm"
                    >{{ errors.phone }}</span
                >
            </div>

            <!-- Partner Code -->
            <div class="mb-4">
                <label
                    for="partnerCode"
                    class="block text-sm font-medium text-gray-700"
                    >Partner Code</label
                >
                <input
                    type="text"
                    v-model="form.partnerCode"
                    id="partnerCode"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    :class="{ 'border-red-500': errors.partnerCode }"
                />
                <span
                    v-if="errors.partnerCode"
                    class="text-red-500 text-sm"
                    >{{ errors.partnerCode }}</span
                >
            </div>

            <!-- Confirm Personal Data -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Confirm Personal Data</label>
                <input
                    type="checkbox"
                    v-model="form.confirmPersonalData"
                    id="confirmPersonalData"
                    class="mt-1 block"
                    :class="{ 'border-red-500': errors.confirmPersonalData }"
                />
                <span
                    v-if="errors.confirmPersonalData"
                    class="text-red-500 text-sm"
                    >{{ errors.confirmPersonalData }}</span
                >
            </div>

            <!-- Contract Is Signed -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Contract Is Signed</label>
                <input
                    type="checkbox"
                    v-model="form.contractIsSigned"
                    id="contractIsSigned"
                    class="mt-1 block"
                />
            </div>

            <!-- Submit Button -->
            <div class="mt-4">
                <button
                    type="submit"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import http from '_composables';
import type { AxiosError } from 'axios';

interface Form {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    partnerCode: string;
    confirmPersonalData: boolean;
    contractIsSigned: boolean;
}

interface ValidationErrors {
    [key: string]: string[]; // Error message array for each field
}

export default {
    setup() {
        const form = ref<Form>({
            firstName: '',
            lastName: '',
            gender: '',
            dateOfBirth: '',
            phone: '',
            partnerCode: '',
            confirmPersonalData: false,
            contractIsSigned: false,
        });

        const errors = ref<ValidationErrors>({});

        const submitForm = async () => {
            try {
                errors.value = {};
                const response = await http.post('/api/v1/customers', form.value);

                console.log('Form submitted successfully:', response.data);
            } catch (error) {
                // Type the error as AxiosError
                const axiosError = error as AxiosError;

                // Check if the error response contains validation errors
                if (axiosError.response && axiosError.response.data) {
                    // Cast response.data to the correct type
                    const responseData = axiosError.response.data as { errors: ValidationErrors };

                    if (responseData.errors) {
                        errors.value = responseData.errors;
                    }
                } else {
                    console.error('Error submitting form:', axiosError);
                }
            }
        };

        return {
            form,
            errors,
            submitForm,
        };
    },
};
</script>

<style scoped>
/* Custom styles for error handling */
.border-red-500 {
    border-color: #f56565;
}
</style>
