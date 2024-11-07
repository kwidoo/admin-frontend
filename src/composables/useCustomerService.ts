import { http } from '@/composables';
import type { Customer, CustomerType } from '@/types/interfaces';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import useUrlService from './useUrlService';


interface CustomerService {
    saveCustomer(customer: Customer): Promise<Customer>;
    fetchCustomer(customerId: number | string): Promise<Customer>;
    fetch(page: number, sort: { sortBy: string; sortOrder: string }, searchQuery: string): Promise<{ customers: Customer[]; lastPage: number; currentPage: number }>;
    generate(type: string): Promise<string>;
    setType(customer: Customer): Customer;
    updateType(customerId: number, customerType: 'client' | 'partner' | 'business-partner'): Promise<Customer>;
    fromType(before: Customer, customerType: CustomerType): Customer;

}
const urlService = useUrlService();

const customerService: CustomerService = {
    async saveCustomer(customer: Customer): Promise<Customer> {
        const config: AxiosRequestConfig = customer.id ? urlService.customer.update(customer.id, customer) : urlService.customer.save(customer);

        const response: AxiosResponse<Customer> = await http(config);

        return response.data;
    },

    setType(customer: Customer): Customer {
        let type = 'Client';
        if (customer.isPartner) {
            type = customer.contractIsSigned ? 'business-partner' : 'partner';
        }
        return {
            ...customer,
            type,
        };
    },

    fromType(before: Customer, customerType: CustomerType): Customer {
        const customer: Customer = before;
        if (customerType === 'business-partner') {
            customer.isPartner = true;
            customer.contractIsSigned = true;
        } else if (customerType === 'partner') {
            customer.isPartner = true;
            customer.contractIsSigned = false;
        } else {
            customer.isPartner = false;
            customer.contractIsSigned = false;
        }
        return customer;
    },

    async fetchCustomer(customerId: number | string): Promise<Customer> {
        const config: AxiosRequestConfig = urlService.customer.show(customerId);

        const response: AxiosResponse<Customer> = await http(config);

        return this.setType({ ...response.data });
    },

    async fetch(
        page: number,
        sort: { sortBy: string; sortOrder: string } = { sortBy: '', sortOrder: 'asc' },
        searchQuery: string = '',
    ): Promise<{ customers: Customer[]; lastPage: number; currentPage: number }> {
        const config: AxiosRequestConfig = urlService.customer.index(page, sort, searchQuery);

        const response: AxiosResponse<{ data: Customer[]; meta: { lastPage: number; currentPage: number } }> = await http(config);

        const customers = response.data.data.map((customer) => this.setType({ ...customer }));
        const { lastPage, currentPage } = response.data.meta;

        return { customers, lastPage, currentPage };
    },

    async generate(type: string = 'referral_code'): Promise<string> {
        const config: AxiosRequestConfig = urlService.customer.generator(type);

        const response: AxiosResponse<{ code: string }> = await http(config);

        return response.data.code;
    },

    async updateType(customerId: number, customerType: CustomerType): Promise<Customer> {
        const config: AxiosRequestConfig = urlService.customer.customerType(customerId, customerType);

        const response: AxiosResponse<Customer> = await http(config);

        return response.data;
    },
};

export default customerService;
