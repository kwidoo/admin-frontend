import type { Customer } from '@/types/interfaces';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import useAxiosInstance from '@/composables/useAxiosInstance';

export default async function fetchLogin(id: number): Promise<Customer> {
    const config: AxiosRequestConfig = {
        url: `/iam/api/v1/customers/login/${id}`,
        method: 'get',
    };

    const response: AxiosResponse<Customer> = await useAxiosInstance(config);
    return response.data;
};
