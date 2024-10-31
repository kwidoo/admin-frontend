import { createPinia } from 'pinia';

const pinia = createPinia();

export default pinia;
export { default as useAuthStore } from './auth';
export { default as useMenuStore } from './menu';
export { default as useMsStore } from './microService';
