import type { Pinia } from 'pinia';
import type { Router } from 'vue-router';

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    interface ComponentProps {
        // Define your component's props here
    }

    interface ComponentEmits {
        // Define your component's emits here
    }

    interface ComponentSlots {
        // Define your component's slots here
    }

    const component: DefineComponent<ComponentProps, ComponentEmits, ComponentSlots>;
    export default component;
}

declare global {
    interface Window {
        pinia: Pinia;
        router: Router;
        http: import('axios').AxiosInstance;
        fetchLogin(id: number): Promise<Customer>;
    }
}

declare module 'lodash';

export { };
