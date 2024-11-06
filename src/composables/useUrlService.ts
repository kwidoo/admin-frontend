import type { Customer, CustomerType } from '@/types/interfaces';
import type { AxiosRequestConfig } from 'axios';

class CustomerUrls {
    private basePath = '/iam/api/v1/customers';

    private generatorPath = '/iam/api/v1/generator';

    index(
        page: number,
        sort: { sortBy: string; sortOrder: string } = { sortBy: '', sortOrder: 'asc' },
        searchQuery: string = '',
    ): AxiosRequestConfig {
        return {
            url: this.basePath,
            method: 'get',
            params: {
                page,
                sort_by: sort.sortBy,
                sortOrder: sort.sortOrder,
                searchQuery,
            },
        };
    }

    show(customerId: number | string): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}`,
            method: 'get',
        };
    }

    save(customer: Customer): AxiosRequestConfig {
        return {
            url: this.basePath,
            method: 'post',
            data: customer,
        };
    }

    update(customerId: number | string, customer: Customer): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}`,
            method: 'put',
            data: customer,
        };
    }

    generator(type: string = 'referral_code'): AxiosRequestConfig {
        return {
            url: this.generatorPath,
            method: 'get',
            params: { type },
        };
    }

    customerType(customerId: number | string, customerType: CustomerType): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}/customer-type`,
            method: 'patch',
            data: {
                customerType,
            },
        };
    }
}

const urlService = () => {
    return {
        customer: new CustomerUrls(),
    };

};

export default urlService;
