import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add, AccountBalance, Receipt } from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import TransactionTable from '../components/TransactionTable';
import { getTransactions } from '../services/api';
import QuoteModal from '../components/QuoteModal';
import TransactionModal from '../components/TransactionModal';

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

    useEffect(() => {
        fetchDashboardData();
    }, [refreshKey, page]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions(page, limit);
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
    };

    const handleQuoteReceived = (quote: any) => {
        setCurrentQuote(quote);
        setQuoteModalOpen(false);
        setTransactionModalOpen(true);
    };

    const handleTransactionSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setCurrentQuote(null);
    };

    const handleBack = () => {
        setTransactionModalOpen(false);
        setQuoteModalOpen(true);
    };

    const handleNewTransaction = () => {
        setQuoteModalOpen(true);
    };

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
                    <Box sx={{ color: '#6366F1' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {/* Transaction Manager */}
                        Money Movement
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleNewTransaction}
                    sx={{ bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
                >
                    New Transaction
                </Button>
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
        </Box>
    );
};

export default Dashboard;
