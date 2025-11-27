import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Box,
    Typography,
    Backdrop
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { getTransactions } from '../services/api';

interface TransactionTableProps {
    refreshTrigger?: number;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ refreshTrigger }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getTransactions();
            // Handle new response structure { transactions: [], treasuryBalance: number }
            if (data.transactions) {
                setTransactions(data.transactions);
            } else if (Array.isArray(data)) {
                // Fallback for old API structure
                setTransactions(data);
            }
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'FAILED':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleViewDetails = (transaction: any) => {
        setSelectedTransaction(transaction);
        setDetailModalOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
                <Backdrop
                    open={loading}
                    sx={{
                        position: 'absolute',
                        zIndex: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1
                    }}
                >
                    <CircularProgress />
                </Backdrop>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Provider</TableCell>
                            <TableCell align="right">Amount (USD)</TableCell>
                            <TableCell align="right">Amount (INR)</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography color="text.secondary" sx={{ py: 4 }}>
                                        No transactions yet.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={tx.status}
                                            color={getStatusColor(tx.status)}
                                            size="small"
                                            sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>{tx.id}</TableCell>
                                    <TableCell>
                                        {new Date(tx.created_at).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </TableCell>
                                    <TableCell>{tx.provider || 'N/A'}</TableCell>
                                    <TableCell align="right">${tx.amount_usd}</TableCell>
                                    <TableCell align="right">₹{tx.amount_inr}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewDetails(tx)}
                                            sx={{ color: '#6366F1' }}
                                        >
                                            <ArrowForward fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <TransactionDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                transaction={selectedTransaction}
            /> */}
        </>
    );
};

export default TransactionTable;
