<template>
    <form @submit.prevent>
        <div v-if="!inline" class="flex gap-4 mt-4">
            <div class="form-group mt-4 w-1/3 relative">
                <search-input
                    label="Customer"
                    :endpoint="`/iam/api/v1/customers`"
                    :display-fields="['firstName', 'lastName', 'referralCode']"
                    placeholder="Search customer"
                    v-model="customerSelected"
                />
            </div>
        </div>

        <div class="flex gap-4 mt-4">
            <select-component
                v-model="contactForm.contactType"
                label="Contact Type"
                id="contact-type"
                :options="{
                    EMAIL: 'Email',
                    PHONE: 'Phone',
                    TELEGRAM: 'Telegram',
                    WHATSAPP: 'Whatsapp',
                }"
                required
                form-class="w-1/3"
            />
            <simple-input
                v-model="contactForm.contactValue"
                label="Contact Value"
                id="contact-value"
                required
                form-class="w-2/3"
            />
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useContactService } from '@/composables';
import type { Contact, Customer } from '@/types/interfaces';
import { useRoute, useRouter } from 'vue-router';
import { SearchInput, SelectComponent, SimpleInput } from '@/components';

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
    components: {
        SearchInput,
        SelectComponent,
        SimpleInput,
    },
    emits: ['close-modal'],

    setup(props, { emit }) {
        const toast = useToast();
        const router = useRouter();
        const route = useRoute();
        const loading = ref<boolean>(false); // Loader state

        const contactForm = ref<Contact>({
            id: props.contactId as unknown as number,
            name: '',
            customerId: props.customerId as unknown as number,
            contactType: 'PHONE',
            contactValue: '',
        });

        const modalMode = computed(() => (props.contactId ? 'edit' : 'add'));
        const inline = computed(() => route.name !== 'ContactDetail');

        const customerSelected = ref<Customer | null>(null);

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

        onMounted(async () => {
            if (props.contactId) {
                contactForm.value = await useContactService.fetchById(props.contactId);
            }
            if (props.customerId) {
                contactForm.value.customerId = props.customerId as unknown as number;
            }
        });

        const cancel = () => {
            if (inline.value) {
                emit('close-modal');
            } else {
                router.push({ name: 'Contacts' });
            }
        };

        watch(customerSelected, (newValue) => {
            if (newValue) {
                contactForm.value.customerId = newValue.id;
            }
        });

        return {
            modalMode,
            contactForm,
            customerSelected,
            save,
            cancel,
            loading,
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
