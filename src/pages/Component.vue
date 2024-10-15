<template>
    <div :id="componentId"></div>
</template>
<script lang="ts">
import { useMicroService } from '_composables';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Component',
    setup() {
        const { loadJs, loadCss } = useMicroService('http://192.168.1.5:3001');
        const componentId = ref<string>('default');
        onMounted(() => {
            const route = useRoute();
            const { meta } = route;
            const { mountId } = meta;

            if (mountId) {
                componentId.value = mountId;
                loadJs(mountId);
                loadCss(mountId);
            }
        });

        return {
            componentId,
        };
    },
});
</script>
