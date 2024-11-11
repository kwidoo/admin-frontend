import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { http } from '@/composables';
import type { Customer, Login, Password } from '@/types/interfaces';
import useUrlService from './useUrlService';

interface LoginService {
    fetchByCustomer(customer: Customer): Promise<{ data: Login[] }>;
    detachCustomer(customer: Customer, login: Login): Promise<[]>;
    changePassword(login: Login, password: Password): Promise<string>;
    create(customer: Customer, login: Login): Promise<Login>;
    fetchLogin(id: number): Promise<Customer>;
}
const urlService = useUrlService();

const loginService: LoginService = {

    async fetchLogin(id: number): Promise<Customer> {
        const config: AxiosRequestConfig = urlService.login.fetchLogin(id);

        const response: AxiosResponse<Customer> = await http(config);

        return response.data;
    },

    async fetchByCustomer(customer: Customer): Promise<{ data: Login[] }> {
        if (!customer.id) {
            throw new Error('Customer id is required');
        }
        const config: AxiosRequestConfig = urlService.login.show(customer.id);

        const response: AxiosResponse<{ data: Login[] }> = await http(config);

        return response.data;
    },

    async create(customer: Customer, login: Login): Promise<Login> {
        const config: AxiosRequestConfig = urlService.login.save(customer, login);

        const response: AxiosResponse<Login> = await http(config);

        return response.data;
    },

    async changePassword(login: Login, password: Password): Promise<string> {
        if (!login.id) {
            throw new Error('Login id is required');
        }
        const config: AxiosRequestConfig = urlService.login.changePassword(login, password);

        const response: AxiosResponse<string> = await http(config);

        return response.data;
    },

    async detachCustomer(customer: Customer, login: Login): Promise<[]> {
        if (!customer.id) {
            throw new Error('Customer id is required');
        }
        if (!login.id) {
            throw new Error('Login id is required');
        }
        const config: AxiosRequestConfig = urlService.login.detach(customer.id, login.id);

        const response: AxiosResponse<[]> = await http(config);

        return response.data;
    },
};

export default loginService;
