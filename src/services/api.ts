import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getQuote = async (amount: number) => {
    const response = await api.post('/quotation', {
        amountUsd: amount
    });
    return response.data;
};

export const createTransaction = async (quoteId: string, senderId: string, bankDetails: any) => {
    const response = await api.post('/transaction', {
        quoteId,
        senderId,
        bankDetails
    });
    return response.data;
};

export const getTransactions = async (
    page?: number,
    limit?: number,
    searchId?: string,
    startDate?: string,
    endDate?: string,
    status?: string
) => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (searchId) params.searchId = searchId.trim();
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;

    const response = await api.get('/transactions', { params });
    return response.data;
};

export const getBeneficiaries = async () => {
    const response = await api.get('/beneficiaries');
    return response.data;
};

export const getLedgerEntries = async (page?: number, limit?: number, transactionId?: string) => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (transactionId) params.transactionId = transactionId;

    const response = await api.get('/ledger', { params });
    return response.data;
};

export default api;
