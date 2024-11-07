import { defineStore } from 'pinia';

const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
    }),
    actions: {
        setLoading(value: boolean) {
            this.isLoading = value;
        },
    },
    getters: {
        loading: (state) => state.isLoading,
    },
});

export default useLoadingStore;
