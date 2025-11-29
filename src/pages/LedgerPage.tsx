import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    CircularProgress,
    Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getLedgerEntries } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LedgerEntry {
    id: string;
    transactionId: string;
    eventType: string;
    entityType: string;
    entityId: string;
    entryType: string;
    amount: number;
    currency: string;
    balanceAfter: number;
    createdAt: string;
}

const LedgerPage: React.FC = () => {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const data = await getLedgerEntries(page + 1, rowsPerPage);
            setEntries(data.entries || []);
            setTotalCount(data.totalCount || 0);
        } catch (error: any) {
            if (error.response?.status === 401) {
                logout();
            }
            console.error('Error fetching ledger:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Ledger Entries
            </Typography>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Event Type</TableCell>
                                <TableCell>Entity</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Balance After</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No ledger entries found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {new Date(entry.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{entry.transactionId || '-'}</TableCell>
                                        <TableCell>{entry.eventType}</TableCell>
                                        <TableCell>{entry.entityType} ({entry.entityId})</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={entry.entryType}
                                                color={entry.entryType === 'DEBIT' ? 'error' : 'success'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {entry.currency} {entry.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {entry.currency} {entry.balanceAfter?.toFixed(2) || 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Box sx={{ mt: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    variant="outlined"
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default LedgerPage;
