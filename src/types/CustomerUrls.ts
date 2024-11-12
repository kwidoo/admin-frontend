import type { Customer, CustomerType } from '@/types/interfaces';
import type { AxiosRequestConfig } from 'axios';

class CustomerUrls {
    private basePath = '/iam/api/v1/customers';

    private generatorPath = '/iam/api/v1/generator';

    index(
        page: number,
        sort: { orderBy: string; order: string } = { orderBy: '', order: 'asc' },
        searchQuery: string = '',
        perPage: number = 15,
        noPagination: boolean = false,
    ): AxiosRequestConfig {
        return {
            url: this.basePath,
            method: 'get',
            params: {
                page,
                orderBy: sort.orderBy,
                order: sort.order,
                searchQuery,
                perPage,
                noPagination,
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
            url: `${this.basePath}/create`,
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

    updateRuId(customerId: number | string, ruId: string): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}/ru-id`,
            method: 'patch',
            data: {
                idru: ruId,
            },
        };
    }

    generator(type: string = 'referral_code'): AxiosRequestConfig {
        return {
            url: this.generatorPath,
            method: 'get',
            params: { type },
        };
    }

    customerType(customerId: number | string, customerType: CustomerType, partnerCode: string | null = null): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}/customer-type`,
            method: 'patch',
            data: {
                customerType,
                partnerCode,
            },
        };
    }
}

export default CustomerUrls;
