import type { App } from 'vue';
import type { PluginOptions } from 'vue-toastification';
import Toast from 'vue-toastification';

import 'vue-toastification/dist/index.css';

const options: PluginOptions = {
    // You can define your custom plugin options here
};

export default {
    install: (app: App) => {
        app.use(Toast, options);
    },
};
