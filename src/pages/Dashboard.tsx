import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Snackbar, Alert } from '@mui/material';
import { Add, AccountBalance, Receipt, ReceiptLong, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import TransactionTable from '../components/TransactionTable';
import { getTransactions } from '../services/api';
import QuoteModal from '../components/QuoteModal';
import TransactionModal from '../components/TransactionModal';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [currentQuote, setCurrentQuote] = useState<any>(null);
    const [transactionCount, setTransactionCount] = useState(0);
    const [treasuryBalance, setTreasuryBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [searchId, setSearchId] = useState('');
    const [debouncedSearchId, setDebouncedSearchId] = useState('');
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [status, setStatus] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchId(searchId);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchId]);

    const fetchDashboardData = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTransactions(page, limit, debouncedSearchId, startDate, endDate, status);
            if (data.transactions) {
                setTransactions(data.transactions);
                setTreasuryBalance(data.treasuryBalance || 0);

                if (data.pagination) {
                    setTotalCount(data.pagination.totalCount);
                    setTransactionCount(data.pagination.totalCount);
                } else {
                    setTransactionCount(data.transactions.length);
                    setTotalCount(data.transactions.length);
                }
            } else if (Array.isArray(data)) {
                setTransactions(data);
                setTransactionCount(data.length);
                setTotalCount(data.length);
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearchId, startDate, endDate, status]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData, refreshKey]);

    const handleQuoteReceived = (quote: any) => {
        setCurrentQuote(quote);
        setQuoteModalOpen(false);
        setTransactionModalOpen(true);
    };

    const handleTransactionSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setCurrentQuote(null);
        setSnackbarMessage('Transaction created successfully!');
        setSnackbarOpen(true);
    };

    const handleSearchIdChange = (value: string) => {
        setSearchId(value);
        setPage(1);
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        setPage(1);
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchId('');
        setStartDate(getCurrentDate());
        setEndDate(getCurrentDate());
        setStatus('');
        setPage(1);
    };

    const handleBack = () => {
        setTransactionModalOpen(false);
        setQuoteModalOpen(true);
    };

    const handleNewTransaction = () => {
        setQuoteModalOpen(true);
    };

    const navigate = useNavigate();
    const { logout } = useAuth();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh' }}>
            <Box sx={{ bgcolor: 'white', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: '#1DB88E' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {/* Transaction Manager */}
                        Money Movement
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ReceiptLong />}
                        onClick={() => navigate('/ledger')}
                        sx={{ borderColor: '#1DB88E', color: '#1DB88E' }}
                    >
                        View Ledger
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleNewTransaction}
                        sx={{ bgcolor: '#1DB88E', '&:hover': { bgcolor: '#17A179' } }}
                    >
                        New Transaction
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Logout />}
                        onClick={logout}
                        sx={{ borderColor: '#dc3545', color: '#dc3545', '&:hover': { borderColor: '#c82333', bgcolor: 'rgba(220, 53, 69, 0.04)' } }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>
            <Box sx={{ p: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            title="Treasury Balance"
                            value={formatCurrency(treasuryBalance)}
                            subtitle="Current available funds for transactions"
                            icon={<AccountBalance />}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <StatsCard
                            title="Total Transactions"
                            value={transactionCount}
                            subtitle="Total number of recorded transactions"
                            icon={<Receipt />}
                        />
                    </Box>
                </Stack>
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Recent Transactions
                    </Typography>
                    <TransactionTable
                        transactions={transactions}
                        loading={loading}
                        page={page}
                        totalCount={totalCount}
                        limit={limit}
                        onPageChange={(newPage) => setPage(newPage)}
                        searchId={searchId}
                        startDate={startDate}
                        endDate={endDate}
                        status={status}
                        onSearchIdChange={handleSearchIdChange}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                        onStatusChange={handleStatusChange}
                        onClearFilters={handleClearFilters}
                    />
                </Box>
            </Box>
            <QuoteModal
                open={quoteModalOpen}
                onClose={() => setQuoteModalOpen(false)}
                onQuoteReceived={handleQuoteReceived}
            />
            <TransactionModal
                open={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                quote={currentQuote}
                onSuccess={handleTransactionSuccess}
                onBack={handleBack}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;
