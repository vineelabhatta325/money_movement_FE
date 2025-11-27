import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getQuote = async (amount: number) => {
    const response = await axios.post(`${API_BASE_URL}/quotation`, {
        amountUsd: amount
    });
    return response.data;
};

export const createTransaction = async (quoteId: string, senderId: string, bankDetails: any) => {
    const response = await axios.post(`${API_BASE_URL}/transaction`, {
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

    const response = await axios.get(`${API_BASE_URL}/transactions`, { params });
    return response.data;
};

export const getBeneficiaries = async () => {
    const response = await axios.get(`${API_BASE_URL}/beneficiaries`);
    return response.data;
};
