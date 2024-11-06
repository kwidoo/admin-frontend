import type { App } from 'vue';
import { createPinia, type Pinia } from 'pinia';

const pinia: Pinia = createPinia();

export default {
    install: (app: App) => {
        app.use(pinia);
        window.pinia = pinia;
    },
};
