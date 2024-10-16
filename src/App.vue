<template>
        <CustomerForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CustomerForm from './components/CustomerForm.vue';

export default defineComponent({
    components: {
        CustomerForm,
    },
});
</script>
