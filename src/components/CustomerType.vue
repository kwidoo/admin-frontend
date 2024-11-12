<template>
    <div class="form-group mt-4">
        <label for="customerType" class="block mb-1 text-sm font-medium">Customer Type:</label>
        <select
            id="customerType"
            v-model="customerType"
            @change="$emit('customerTypeChanged', customerType)"
            class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark mr-2"
        >
            <option value="client">Client</option>
            <option value="partner">Partner</option>
            <option value="business-partner">Business Partner</option>
        </select>
        <button
            type="button"
            @click="saveCustomerType"
            :disabled="!isCustomerTypeChanged || customerId === null"
            class="px-2 py-1 text-xs rounded-md bg-primary text-on-secondary hover:bg-secondary-dark disabled:bg-gray-300 disabled:text-gray-500"
        >
            Update
        </button>
    </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useCustomerService } from '@/composables';
import { useToast } from 'vue-toastification';
import type { CustomerType } from '@/types/interfaces';

export default defineComponent({
    name: 'CustomerType',
    props: {
        initialCustomerType: {
            type: String as () => CustomerType,
            default: 'client',
        },
        customerId: {
            type: [Number, null],
            required: true,
        },
        partnerCode: {
            type: [String, null],
            required: false,
            default: '',
        },
    },
    emits: ['customerTypeChanged'],
    setup(props, { emit }) {
        const toast = useToast();

        const customerType = ref<CustomerType>(props.initialCustomerType);
        const originalCustomerType = ref<string | number>(customerType.value);

        const isCustomerTypeChanged = computed(() => {
            return customerType.value !== originalCustomerType.value;
        });

        const saveCustomerType = async (): Promise<void> => {
            try {
                if (props.customerId === null) {
                    throw new Error('Customer ID is not set');
                }

                await useCustomerService.updateType(
                    props.customerId,
                    customerType.value,
                    props.partnerCode,
                );

                originalCustomerType.value = customerType.value;

                emit('customerTypeChanged', customerType.value);
                toast.success('Customer type updated successfully');
            } catch (error) {
                toast.error('Failed to update customer type');
                console.error('Failed to update customer type:', error);
            }
        };

        return {
            customerType,
            isCustomerTypeChanged,
            saveCustomerType,
        };
    },
});
</script>
