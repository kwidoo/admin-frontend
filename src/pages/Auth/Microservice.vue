<template>
    <div v-if="!loading && !showError" :id="microserviceName"></div>
    <div v-else :id="microserviceName" class="loading-spinner">
        <div v-if="!showError">Loading...</div>
        <div v-else>Microservice: {{ microserviceName }} temporary unavailable</div>
    </div>
</template>

<script lang="ts">
import DocuManager from '@/DocuManager.vue'; // @todo remove on ok
import { defineComponent, computed, createApp, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/docu';

export default defineComponent({
    name: 'Microservice',
    setup() {
        const route = useRoute();
        let loading = true;
        let showError = false;
        const microserviceName = computed<string>(() => (route.meta.microservice as string) || '');

        onMounted(async () => {
            if (microserviceName.value) {
                try {
                    // eslint-disable-next-line
                    // const module = await import('https://your-s3-bucket-url/path/to/dist.js');  //@todo
                    // const { DocuManager } = module;

                    if (DocuManager) {
                        const app = createApp(DocuManager);

                        app.use(window.pinia);
                        app.use(router);
                        app.mount(`#${microserviceName.value}`);
                        loading = false;
                    } else {
                        showError = true;

                        console.error('DocuManager component not found in the module.');
                    }
                } catch (error) {
                    showError = true;
                    console.error('Failed to load DocuManager module:', error);
                }
            }
        });

        return {
            microserviceName,
            loading,
            showError,
        };
    },
});
</script>
