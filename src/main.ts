import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';

const mount = import.meta.env.VITE_MOUNT;
createApp(App).mount(`#${mount}`);
