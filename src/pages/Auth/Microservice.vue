<template>
    <div v-if="!loading && !showError" :id="microserviceName" :data-route="computedDataRoute"></div>
    <div v-else :id="microserviceName" class="loading-spinner">
        <div v-if="!showError">Loading...</div>
        <div v-else>Microservice: {{ microserviceName }} temporary unavailable</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMicroService, http } from '@/composables';

export default defineComponent({
    name: 'Microservice',
    setup() {
        const registryUrl = import.meta.env.VITE_REGISTRY_URL;
        const route = useRoute();
        const { loadJs, loadCss } = useMicroService();
        let unmountHook: () => void = () => {};

        const loading = ref<boolean>(true);
        let showError = false;
        const microserviceName = computed<string>(() => (route.meta.microservice as string) || '');

        const computedDataRoute = computed(() => {
            return route.meta.microservice === microserviceName.value ? route.fullPath : undefined;
        });

        onMounted(async () => {
            if (microserviceName.value) {
                try {
                    window.http = http;
                    loadJs(microserviceName.value, registryUrl);
                    loadCss(microserviceName.value, registryUrl);
                    unmountHook = () => {
                        document.getElementById(`${microserviceName.value}-js`)?.remove();
                        document.getElementById(`${microserviceName.value}-css`)?.remove();
                    };

                    loading.value = false;
                } catch (error) {
                    showError = true;
                }
            }
        });
        onUnmounted(() => {
            unmountHook();
        });

        return {
            microserviceName,
            loading,
            showError,
            computedDataRoute,
        };
    },
});
</script>
