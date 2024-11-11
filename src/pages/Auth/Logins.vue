<template>
    <div>
        <index-component
            :is-loading="loading"
            :key="loginDataKey"
            :label="'Logins'"
            :headers="headers"
            :search-field="''"
            :enable-search="false"
            :enable-new="true"
            :enable-edit="false"
            :enable-delete="false"
            :table-data="loginData"
            @load-data="loadData"
        >
            <template #search="">
                <div>
                    <button
                        @click="openCreateModal"
                        class="px-2 py-1 text-xs rounded-md bg-tertiary text-on-tertiary hover:bg-tertiary-dark"
                    >
                        <font-awesome-icon :icon="['fas', 'plus']" /> New login
                    </button>
                    <button
                        @click="openAttachModal"
                        class="px-2 py-1 text-xs rounded-md bg-tertiary text-on-tertiary hover:bg-tertiary-dark"
                    >
                        <font-awesome-icon :icon="['fas', 'plus']" /> Attach
                    </button>
                </div>
            </template>

            <template #actions-prepend="{ item }">
                <button
                    @click="openPasswordModal(item)"
                    class="px-1 py-1 mr-1 text-xs rounded bg-primary text-black hover:bg-secondary-dark"
                >
                    <font-awesome-icon :icon="['fas', 'key']" />&nbsp;Password
                </button>
                <button
                    @click="detach()"
                    class="px-1 py-1 mr-1 text-xs rounded bg-secondary text-black hover:bg-secondary-dark"
                >
                    <font-awesome-icon :icon="['fas', 'trash']" />&nbsp;Remove
                </button>
                <confirm-modal
                    :is-modal-open="isDetachModalOpen"
                    :text="`Are you sure you want to delete this login? <strong>${item.loginValue}</strong>`"
                    @close-modal="handleCloseModal"
                    @action="handleDetachConfirm(item)"
                />
            </template>
        </index-component>

        <modal-component
            :is-modal-open="isPasswordModalOpen"
            @close-modal="closePasswordModal"
            @action="savePassword"
        >
            <template #header>
                <h2 class="text-lg font-semibold mb-4">Change Password</h2>
            </template>
            <template #content>
                <div class="flex gap-4 mt-4">
                    <simple-input
                        v-model="changePassword.password"
                        label="New password"
                        form-class="w-3/4"
                    />
                    <div class="form-group mt-4">
                        <label for="notify" class="block mb-1 text-sm font-medium">Notify:</label>
                        <input
                            type="checkbox"
                            id="notify"
                            v-model="changePassword.notify"
                            class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                        />
                    </div>
                </div>
            </template>
        </modal-component>
        <modal-component
            :is-modal-open="isCreateModalOpen"
            @close-modal="isCreateModalOpen = false"
            @action="saveNewLogin"
        >
            <template #header>
                <h2 class="text-lg font-semibold mb-4">New Login</h2>
            </template>
            <template #content>
                <simple-input
                    v-model="createLogin.loginValue"
                    label="Login"
                    :has-errors="createLoginError !== null"
                    :error="
                        createLoginError ? (createLoginError.response?.data as any)?.message : ''
                    "
                />
                <select-component
                    v-model="createLogin.loginValueType"
                    label="Type"
                    :options="{
                        PHONE: 'Phone',
                        EMAIL: 'Email',
                        TELEGRAM: 'Telegram',
                        WHATSAPP: 'Whatsapp',
                    }"
                />

                <div class="flex gap-4 mt-4">
                    <copy-input
                        v-model="createLogin.password"
                        :id="'password'"
                        form-class="w-3/4"
                        label="New password"
                        :required="true"
                    />
                    <div class="form-group mt-4">
                        <label for="notify" class="block mb-1 text-sm font-medium">Notify:</label>
                        <input
                            type="checkbox"
                            id="notify"
                            v-model="changePassword.notify"
                            class="px-2 py-1 border rounded-md text-xs bg-secondary text-on-primary focus:bg-primary-variant focus:ring-primary-dark"
                        />
                    </div>
                </div>
            </template>
        </modal-component>
        <attach-login-modal
            :is-modal-open="isAttachModalOpen"
            v-model="loginSearch"
            :header="`Attach Login`"
            label="Phone number"
            @close-attach-modal="closeAttachModal"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IndexComponent, CopyInput, ConfirmModal, SearchInput } from '@/components';
import { useLoginService, useCustomerService } from '@/composables';
import { useLoadingStore } from '@/store';
import { useToast } from 'vue-toastification';
import type { Customer, Password, Login } from '@/types/interfaces';
import type { AxiosError } from 'axios';
import AttachLoginModal from '@/components/AttachLoginModal.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import SimpleInput from '@/components/SimpleInput.vue';
import SelectComponent from '@/components/SelectComponent.vue';

interface Header {
    key: string;
    label: string;
}

export default defineComponent({
    name: 'LoginComponent',
    components: {
        IndexComponent,
        CopyInput,
        ConfirmModal,
        SearchInput,
        AttachLoginModal,
        ModalComponent,
        SimpleInput,
        SelectComponent,
    },

    props: {
        customer: {
            type: Object as () => Customer | null,
            required: false,
            default: null,
        },
    },
    emits: ['create-new'],

    setup(props) {
        const loading = ref<boolean>(false);
        const loginDataKey = ref<number>(0);

        const isPasswordModalOpen = ref<boolean>(false);
        const changePassword = ref<Password>({ password: null, notify: false });
        const changeFor = ref<Login | null>(null);

        const isCreateModalOpen = ref<boolean>(false);
        const createLogin = ref<Login>({
            id: null,
            name: null,
            password: null,
            loginValue: '',
            loginValueType: 'PHONE',
            pivot: null,
        });
        const createLoginError = ref<AxiosError | null>(null);

        const isAttachModalOpen = ref<boolean>(false);

        const headers = ref<Header[]>([
            {
                key: 'loginValue',
                label: 'Login',
            },
            {
                key: 'loginValueType',
                label: 'Type',
            },
        ]);

        const toast = useToast();
        const loginData = ref<Login[]>([]);
        const customerValue = ref<Customer | null>(null);
        const loadingStore = useLoadingStore();

        const loadData = async () => {
            loading.value = true;
            try {
                if (!props.customer) {
                    return;
                }
                const response = await useLoginService.fetchByCustomer(props.customer);
                loginData.value = response.data;
                customerValue.value = props.customer;
            } catch (error) {
                toast.error('Failed to load logins');
                throw error;
            } finally {
                loading.value = false;
            }
        };

        const openPasswordModal = async (login: Login) => {
            isPasswordModalOpen.value = true;
            changeFor.value = login;
            changePassword.value = {
                password: await useCustomerService.generate('password'),
                notify: false,
            };
        };

        const closePasswordModal = () => {
            isPasswordModalOpen.value = false;
            changePassword.value = { password: '', notify: false };
        };

        const savePassword = async () => {
            try {
                if (!changeFor.value) {
                    return;
                }
                await useLoginService.changePassword(changeFor.value, changePassword.value);
                toast.success('Password changed successfully');
                closePasswordModal();
            } catch (error) {
                toast.error('Failed to change password');
                closePasswordModal();
                throw error;
            }
        };

        const openCreateModal = async () => {
            isCreateModalOpen.value = true;
            createLogin.value = {
                password: await useCustomerService.generate('password'),
                loginValue: '',
                loginValueType: 'PHONE',
            } as Login;
        };

        const closeCreateModal = () => {
            isCreateModalOpen.value = false;
            createLogin.value = {
                password: '',
                loginValue: '',
                loginValueType: 'PHONE',
            } as Login;
        };

        const saveNewLogin = async () => {
            try {
                if (!customerValue.value) {
                    return;
                }
                await useLoginService.create(customerValue.value, createLogin.value);
                toast.success('Login created successfully');
                closeCreateModal();
                createLoginError.value = null;
            } catch (error) {
                createLoginError.value = error as AxiosError;
                toast.error(
                    (createLoginError.value.response?.data as object as { message: string })
                        .message || 'Failed to create login',
                );
                throw error;
            } finally {
                loginDataKey.value += 1;
                await loadData();
            }
        };

        const isDetachModalOpen = ref<boolean>(false);
        const handleCloseModal = () => {
            isDetachModalOpen.value = false;
        };

        const handleDetachConfirm = async (login: Login) => {
            if (!customerValue.value) {
                return;
            }
            try {
                await useLoginService.detachCustomer(customerValue.value, login);
                toast.success('Login detached successfully');
            } catch (error) {
                toast.error('Failed to detach login');
                throw error;
            } finally {
                loginDataKey.value += 1;
                await loadData();
            }
        };
        const detach = () => {
            isDetachModalOpen.value = true;
        };

        const openAttachModal = () => {
            isAttachModalOpen.value = true;
        };

        const loginSearch = ref<Login>({} as Login);

        const attachLogin = async () => {
            // if (!customerValue.value) {
            //     return;
            // }
            // try {
            //     await useLoginService.attachCustomer(customerValue.value);
            //     toast.success('Login attached successfully');
            // } catch (error) {
            //     toast.error('Failed to attach login');
            //     throw error;
            // } finally {
            //     loginDataKey.value += 1;
            //     await loadData();
            // }
        };

        const closeAttachModal = () => {
            isAttachModalOpen.value = false;
        };

        onMounted(() => {
            loadData();
        });

        return {
            loading,
            headers,
            loginData,
            toast,
            loadData,

            detach,

            openPasswordModal,
            closePasswordModal,
            savePassword,
            isPasswordModalOpen,
            changePassword,

            closeCreateModal,
            openCreateModal,
            isCreateModalOpen,
            saveNewLogin,
            createLogin,
            createLoginError,
            loginDataKey,

            isDetachModalOpen,
            handleCloseModal,
            handleDetachConfirm,

            isAttachModalOpen,
            openAttachModal,
            attachLogin,
            closeAttachModal,
            loginSearch,

            loadingStore,
        };
    },
});
</script>
