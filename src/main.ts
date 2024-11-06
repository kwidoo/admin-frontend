import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { i18n, toastPlugin, piniaPlugin } from '@/plugins'; // Import the i18n setup file
import '@/plugins/fontawesome'; // Import the fontawesome setup file
import router from '@/router';
import App from './App.vue';

import './assets/tailwind.css';
import 'flowbite-vue/index.css';
import useAuthStore from './store/auth';


const mount = import.meta.env.VITE_MOUNT;
const app = createApp(App);

app.use(router);
app.use(piniaPlugin);
app.use(i18n);
app.use(toastPlugin);

app.component('FontAwesomeIcon', FontAwesomeIcon);

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount(`#${mount}`);
