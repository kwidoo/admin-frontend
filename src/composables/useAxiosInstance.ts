import axios, {
    AxiosInstance,
} from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const http: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

http.defaults.transformRequest = [
    (data) => {
        const transformedData = decamelizeKeys(data);
        return JSON.stringify(transformedData);
    },
];

http.interceptors.response.use((response) => {
    const { headers } = response;
    const { responseURL } = response.request;

    if (
        headers['content-type'] === 'application/json' &&
        (responseURL.indexOf('api') >= 0 ||
            responseURL.indexOf('auth') >= 0 ||
            responseURL.indexOf('check') >= 0)
    ) {
        response.data = camelizeKeys(response.data);
    }

    return response;
});

export default http;
