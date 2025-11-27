import React, { useState } from 'react';
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
    TablePagination,
    Backdrop,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Stack
} from '@mui/material';
import { Visibility, Search, Clear } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TransactionDetailModal from './TransactionDetailModal';

interface TransactionTableProps {
    transactions: any[];
    loading: boolean;
    page: number;
    totalCount: number;
    limit: number;
    onPageChange: (page: number) => void;
    searchId: string;
    startDate: string;
    endDate: string;
    status: string;
    onSearchIdChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClearFilters: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    loading,
    page,
    totalCount,
    limit,
    onPageChange,
    searchId,
    startDate,
    endDate,
    status,
    onSearchIdChange,
    onStartDateChange,
    onEndDateChange,
    onStatusChange,
    onClearFilters
}) => {
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

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
            <Paper sx={{
                p: 3,
                mb: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
            }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <Box sx={{ width: 300 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search Transaction ID"
                            value={searchId}
                            onChange={(e) => onSearchIdChange(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white'
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{ minWidth: 250 }}>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate && !isNaN(new Date(startDate).getTime()) ? new Date(startDate) : null}
                            endDate={endDate && !isNaN(new Date(endDate).getTime()) ? new Date(endDate) : null}
                            onChange={(update: [Date | null, Date | null]) => {
                                const [start, end] = update;
                                onStartDateChange(start ? start.toISOString().split('T')[0] : '');
                                onEndDateChange(end ? end.toISOString().split('T')[0] : '');
                            }}
                            isClearable={true}
                            customInput={
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Date Range"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white'
                                        }
                                    }}
                                />
                            }
                        />
                    </Box>
                    <Box sx={{ minWidth: 150 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status || ''}
                                label="Status"
                                onChange={(e) => onStatusChange(e.target.value)}
                                renderValue={(selected) => {
                                    if (!selected || selected === '') {
                                        return 'All';
                                    }
                                    return selected === 'PENDING' ? 'Pending' : 'Completed';
                                }}
                                sx={{
                                    backgroundColor: 'white'
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>
            </Paper>

            <TableContainer component={Paper} sx={{
                boxShadow: '0 2px 8px rgba(79, 31, 31, 0.08)',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: '#F9FAFB',
                            '& .MuiTableCell-head': {
                                fontWeight: 600,
                                color: '#374151',
                                borderBottom: '2px solid #E5E7EB'
                            }
                        }}>
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
                                        {new Date(tx.createdAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </TableCell>
                                    <TableCell>{tx.provider || 'N/A'}</TableCell>
                                    <TableCell align="right">${tx.amountUsd}</TableCell>
                                    <TableCell align="right">₹{tx.amountInr}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewDetails(tx)}
                                            sx={{ color: '#1DB88E' }}
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page - 1}
                onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={limit}
                rowsPerPageOptions={[limit]}
                sx={{ borderTop: '1px solid #E5E7EB' }}
            />

            <TransactionDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                transaction={selectedTransaction}
            />
        </>
    );
};

export default TransactionTable;
