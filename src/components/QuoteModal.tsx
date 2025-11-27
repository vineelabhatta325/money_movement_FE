import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Close, ArrowForward } from '@mui/icons-material';
import { getQuote } from '../services/api';

interface QuoteModalProps {
    open: boolean;
    onClose: () => void;
    onQuoteReceived: (quote: any) => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ open, onClose, onQuoteReceived }) => {
    const [amount, setAmount] = useState<number>(100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetQuote = async () => {
        setLoading(true);
        setError(null);
        try {
            const quote = await getQuote(amount);
            onQuoteReceived(quote);
        } catch (err) {
            setError('Failed to fetch quote. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount(100);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="span">Step 1: Get a Quote</Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter the amount in USD to get the best conversion rate.
                </Typography>
                <TextField
                    label="Amount (USD)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 1 }}
                    autoFocus
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGetQuote}
                    disabled={loading || amount <= 0}
                    endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                    sx={{ py: 1.5, bgcolor: '#1DB88E', '&:hover': { bgcolor: '#17A179' } }}
                >
                    {loading ? 'Loading...' : 'Get Quote'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuoteModal;
