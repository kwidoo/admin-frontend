import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('routeStore', () => {
    const currentRoute = ref('');

    function setRoute(route: string) {
        currentRoute.value = route;
    }

    return { currentRoute, setRoute };
});
