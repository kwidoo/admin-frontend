import type { AxiosRequestConfig } from 'axios';
import type { Contact } from './interfaces';

class ContactUrls {
    private basePath = '/iam/api/v1/contacts';


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

    show(contactId: number | string): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${contactId}`,
            method: 'get',
        };
    }

    save(contact: Contact): AxiosRequestConfig {
        return {
            url: this.basePath,
            method: 'post',
            data: {
                ...contact,
                customerId: contact.customerId,
                isVerified: true,
            },
        };
    }

    update(contactId: number | string, contact: Contact): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${contactId}`,
            method: 'put',
            data: contact,
        };
    }

    delete(contactId: number | string): AxiosRequestConfig {
        return {
            url: `${this.basePath}/${contactId}`,
            method: 'delete',
        };
    }
}

export default ContactUrls;
