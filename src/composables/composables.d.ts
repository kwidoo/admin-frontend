
declare module '_composables' {
    import type { AxiosInstance } from 'axios';
    import type { Customer } from '@/types/interfaces';

    export const http: AxiosInstance;
    export const fetchLogin: (id: number) => Promise<Customer>;

    export function useMicroService(options?: MicroServiceOptions): {
        loadJs: (microAppId: string) => void;
        loadCss: (microAppId: string) => void;
    };
}
