import { http } from '@/composables';
import type { Contact } from '@/types/interfaces';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import useUrlService from './useUrlService';


interface contactService {
    save(contact: Contact): Promise<Contact>;
    fetch(page: number, sort: { orderBy: string; order: string }, searchQuery: string, perPage: number, noPagination: boolean): Promise<{ contacts: Contact[]; lastPage: number; currentPage: number }>;
    fetchById(contactId: number | string): Promise<Contact>;
    delete(contactId: number | string): Promise<void>;

}
const urlService = useUrlService();

const contactService: contactService = {
    async save(contact: Contact): Promise<Contact> {
        const config: AxiosRequestConfig = contact.id ? urlService.contact.update(contact.id, contact) : urlService.contact.save(contact);

        const response: AxiosResponse<Contact> = await http(config);

        return response.data;
    },


    async fetch(
        page: number,
        sort: { orderBy: string; order: string } = { orderBy: '', order: 'asc' },
        searchQuery: string = '',
        perPage: number = 15,
        noPagination: boolean = false,
    ): Promise<{ contacts: Contact[]; lastPage: number; currentPage: number }> {
        const config: AxiosRequestConfig = urlService.contact.index(page, sort, searchQuery, perPage, noPagination);

        const response: AxiosResponse<{ data: Contact[]; meta: { lastPage: number; currentPage: number } }> = await http(config);

        const contacts: Contact[] = response.data.data;
        const { lastPage, currentPage } = response.data.meta;

        return { contacts, lastPage, currentPage };
    },

    async fetchById(contactId: number | string): Promise<Contact> {
        const config: AxiosRequestConfig = urlService.contact.show(contactId);
        const response: AxiosResponse<Contact> = await http(config);

        return response.data;
    },

    async delete(contactId: number | string): Promise<void> {
        const config: AxiosRequestConfig = urlService.contact.delete(contactId);
        await http(config);
    },
};

export default contactService;
