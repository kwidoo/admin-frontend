import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import './assets/tailwind.css';
import 'flowbite-vue/index.css';
import useAuthStore from './store/auth';



const mount = import.meta.env.VITE_MOUNT;
const app = createApp(App);

app.use(router);
app.use(pinia);

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount(`#${mount}`);
