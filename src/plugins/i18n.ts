import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        ID: 'ID',
        customers: 'Customers',
        manage: 'Manage',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
    },
    fr: {
        customers: 'Clients',
        manage: 'Gérer',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
    },
};

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

export default i18n;
