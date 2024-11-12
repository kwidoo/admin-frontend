import type { AxiosRequestConfig } from 'axios';
import type { Login, Password, Customer } from './interfaces';

class LoginUrls {
    private basePath = '/iam/api/v1/login';

    fetchLogin(id: number): AxiosRequestConfig {
        const base = this.basePath.replace('login', 'customers/login');
        return {
            url: `${base}/${id}`,
            method: 'get',
        };
    }

    show(customerId: number): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${customerId}`,
            method: 'get',
        };
    }

    save(customer: Customer, login: Login): AxiosRequestConfig {
        return {
            url: `${this.basePath}/new`,
            method: 'post',
            data: {
                ...login,
                attachedId: customer.id,
                attachedTo: 'customer',
            },
        };
    }

    changePassword(login: Login, password: Password): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${login.id}`,
            method: 'put',
            data: password,
        };
    }

    detach(customerId: number, loginId: number): AxiosRequestConfig {
        return {
            url: `${this.basePath}/detach/${loginId}`,
            method: 'post',
            data: {
                detachedId: customerId,
                detachedFrom: 'customer',
            },
        };
    }

    search(searchQuery: string): AxiosRequestConfig {
        return {
            url: `${this.basePath}/search`,
            method: 'get',
            params: {
                searchQuery,
            },
        };
    }

}

export default LoginUrls;
