import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Box, Alert, CircularProgress, Divider, Autocomplete } from '@mui/material';
import { Close } from '@mui/icons-material';
import { createTransaction, getBeneficiaries } from '../services/api';

interface TransactionModalProps {
    open: boolean;
    onClose: () => void;
    quote: any;
    onSuccess: () => void;
    onBack: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ open, onClose, quote, onSuccess, onBack }) => {
    const [senderId, setSenderId] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            fetchBeneficiaries();
        }
    }, [open]);

    const fetchBeneficiaries = async () => {
        try {
            const data = await getBeneficiaries();
            setBeneficiaries(data);
        } catch (err) {
            console.error('Failed to fetch beneficiaries', err);
        }
    };

    const handleBeneficiarySelect = (event: any, newValue: any) => {
        if (newValue) {
            setRecipientName(newValue.accountHolderName || newValue.accountHolder || '');
            setAccountNumber(newValue.accountNumber || '');
            setIfscCode(newValue.ifscCode || newValue.ifsc || '');
        } else {
            setRecipientName('');
            setAccountNumber('');
            setIfscCode('');
        }
    };

    const handleInputChange = (event: any, newInputValue: string) => {
        setRecipientName(newInputValue);
    };

    const handleSubmit = async () => {
        if (!senderId || !recipientName || !accountNumber || !ifscCode) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const bankDetails = {
                accountNumber,
                ifscCode,
                accountHolderName: recipientName
            };
            await createTransaction(quote.quoteId, senderId, bankDetails);
            onSuccess();
            handleClose();
        } catch (err) {
            setError('Transaction failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSenderId('');
        setRecipientName('');
        setAccountNumber('');
        setIfscCode('');
        setError(null);
        onClose();
    };

    if (!quote) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Step 2: Transaction Details</Typography>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Confirm quote and provide sender & bank details.
                </Typography>

                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Quote Details
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Sending:</Typography>
                        <Typography variant="body2" fontWeight="medium">${quote.amountUsd}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Recipient Gets:</Typography>
                        <Typography variant="body2" fontWeight="medium">₹{quote.amountInr}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Rate:</Typography>
                        <Typography variant="body2" fontWeight="medium">1 USD = {quote.rateUsed} INR</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Provider:</Typography>
                        <Typography variant="body2" fontWeight="medium">{quote.provider}</Typography>
                    </Box>
                </Box>

                <TextField
                    label="Sender ID"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    fullWidth
                    margin="normal"
                    placeholder="Your Sender ID"
                />

                <Autocomplete
                    freeSolo
                    options={beneficiaries}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        return option.accountHolderName || option.accountHolder || '';
                    }}
                    renderOption={(props, option) => {
                        const { key, ...otherProps } = props;
                        return (
                            <li key={key} {...otherProps}>
                                <Box>
                                    <Typography variant="body1">
                                        {option.accountHolderName || option.accountHolder}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Acc: {option.accountNumber} • IFSC: {option.ifscCode || option.ifsc}
                                    </Typography>
                                </Box>
                            </li>
                        );
                    }}
                    onChange={handleBeneficiarySelect}
                    onInputChange={handleInputChange}
                    inputValue={recipientName}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Beneficiary Name"
                            margin="normal"
                            placeholder="Select existing or type new"
                            fullWidth
                        />
                    )}
                />

                <TextField
                    label="Beneficiary Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                    placeholder="e.g., 1234567890"
                />
                <TextField
                    label="IFSC Code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    fullWidth
                    margin="normal"
                    placeholder="e.g., BKID0001234"
                />

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button onClick={onBack} variant="outlined" sx={{ flex: 1 }}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ flex: 1, bgcolor: '#1DB88E', '&:hover': { bgcolor: '#17A179' } }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create Transaction'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionModal;
