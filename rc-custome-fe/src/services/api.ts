import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
console.log(import.meta.env.VITE_API_URL)
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleApiError = (error: AxiosError): string => {
    if (error.response) {
        return `Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {

        return 'Error: No response received from server.';
    } else {

        return `Error: ${error.message}`;
    }
};

const request = async <T>(config: Parameters<AxiosInstance['request']>[0]): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await api.request(config);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error as AxiosError));
    }
};

export { api, request };
