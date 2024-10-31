<template>
    <div :id="microserviceName"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Microservice',
    setup() {
        const route = useRoute();
        const microserviceName = computed<string>(() => (route.meta.microservice as string) || '');

        return {
            microserviceName,
        };
    },
});
</script>
