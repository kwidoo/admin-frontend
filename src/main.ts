import { createApp } from 'vue';
import { AxiosInstance } from 'axios';
import App from './App.vue';
import './assets/tailwind.css';
import 'flowbite-vue/index.css';

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}

const mount = import.meta.env.VITE_MOUNT;
createApp(App).mount(`#${mount}`);
