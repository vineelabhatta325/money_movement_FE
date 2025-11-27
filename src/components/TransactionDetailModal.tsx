import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Divider, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';

interface TransactionDetailModalProps {
    open: boolean;
    onClose: () => void;
    transaction: any;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ open, onClose, transaction }) => {
    if (!transaction) return null;

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Transaction Details</Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ py: 2 }}>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                            Status:
                        </Typography>
                        <Chip
                            label={transaction.status}
                            color={getStatusColor(transaction.status)}
                            size="small"
                            sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                        <Typography variant="body2" fontWeight="medium">{transaction.id}</Typography>
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Quote ID:</Typography>
                        <Typography variant="body2" fontWeight="medium">{transaction.quoteId}</Typography>
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Sender ID:</Typography>
                        <Typography variant="body2" fontWeight="medium">{transaction.senderId}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Amount Details */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Amount Details
                    </Typography>

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Amount (USD):</Typography>
                        <Typography variant="body2" fontWeight="medium">${transaction.amountUsd}</Typography>
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Amount (INR):</Typography>
                        <Typography variant="body2" fontWeight="medium" color="success.main">₹{transaction.amountInr}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Bank Details
                    </Typography>

                    {transaction.bankDetails && (
                        <>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Account Holder:</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {transaction.bankDetails.accountHolderName || transaction.bankDetails.accountHolder || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Account Number:</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {transaction.bankDetails.accountNumber || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">IFSC Code:</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {transaction.bankDetails.ifscCode || transaction.bankDetails.ifsc || 'N/A'}
                                </Typography>
                            </Box>
                        </>
                    )}

                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Created At:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {new Date(transaction.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailModal;








