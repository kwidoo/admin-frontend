import type { Country } from '@/types/interfaces';
import { http } from '@/composables';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useToast } from 'vue-toastification';

interface CountryService {
    fetchCountries(): Promise<Country[]>;
}

const countryService: CountryService = {
    async fetchCountries(): Promise<Country[]> {
        const toast = useToast();
        try {
            const config: AxiosRequestConfig = {
                baseURL: 'https://joyou.co',
                url: '/delivery/api/countries',
                method: 'get',
            };
            const response: AxiosResponse<{ countries: Country[] }> = await http(config);
            return response.data?.countries;
        } catch (error) {
            toast.error('Error fetching countries');
            throw error;
        }
    },
};

export default countryService;
