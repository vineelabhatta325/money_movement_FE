import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const getQuote = async (amountUsd: number) => {
    const response = await api.post('/quotation', { amountUsd });
    return response.data;
};

export const createTransaction = async (quoteId: string, senderId: string, bankDetails: any) => {
    const response = await api.post('/transaction', { quoteId, senderId, bankDetails });
    return response.data;
};

export const getTransaction = async (transactionId: string) => {
    const response = await api.get(`/transaction/${transactionId}`);
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export default api;
