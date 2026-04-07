import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Container,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import api, { getActiveUserId } from '../api';
import useNotify from '../hooks/useNotify';

const PendingApprovals = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(false);
    const { notifySuccess, notifyError, snackbar, closeSnackbar } = useNotify();

    const loadPending = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/approval/pending?user_id=${getActiveUserId()}`);
            setPending(res.data.data || []);
        } catch (err) {
            notifyError('Failed to load pending approvals. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, []);

    const actionRequest = async (requestId, action) => {
        try {
            await api.post(`/approval/${requestId}/${action}`, { user_id: getActiveUserId() });
            if (action === 'approve') {
                notifySuccess('Request Approved successfully!');
            } else {
                notifySuccess('Request Rejected.');
            }
            loadPending();
        } catch (err) {
            const reason = err.response?.data?.error || err.response?.data?.message || err.message;
            notifyError(`Action failed: ${reason}`);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: '800', color: '#111827', mb: 1, letterSpacing: '-1px' }}>
                    Approval Queue
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Review and action pending requests assigned to your level.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #eaeaea',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', py: 2 }}>Request ID</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151' }}>Entity</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151' }}>Level</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <CircularProgress size={30} sx={{ color: 'primary.main' }} />
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && pending.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ opacity: 0.5 }}>
                                        <CheckCircleOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
                                        <Typography variant="h6">Your queue is clear!</Typography>
                                        <Typography variant="body2">No pending approvals at this time.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {pending.map((step) => (
                            <TableRow key={step.id} hover sx={{ transition: 'background-color 0.2s' }}>
                                {/* Request ID */}
                                <TableCell sx={{ py: 3 }}>
                                    <Typography sx={{ fontWeight: '700', color: '#111827' }}>
                                        {step.request.entity_payload?.pr_number || `#${step.request.id}`}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        by {step.request.creator?.name}
                                    </Typography>
                                </TableCell>

                                {/* Entity */}
                                <TableCell>
                                    <Chip
                                        label={step.request.entity_type}
                                        size="small"
                                        sx={{ fontWeight: '700', textTransform: 'uppercase', borderRadius: '4px' }}
                                    />
                                </TableCell>

                                {/* Customer */}
                                <TableCell>
                                    <Typography sx={{ fontWeight: '500' }}>
                                        {step.request.entity_payload?.customer_name || '-'}
                                    </Typography>
                                </TableCell>

                                {/* Level */}
                                <TableCell>
                                    <Chip
                                        label={`Level ${step.level_no}`}
                                        size="small"
                                        sx={{ fontWeight: '700', bgcolor: '#eff6ff', color: '#1e40af', borderRadius: '6px' }}
                                    />
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<HighlightOffIcon />}
                                            onClick={() => actionRequest(step.request.id, 'reject')}
                                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: '700' }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<CheckCircleOutlineIcon />}
                                            onClick={() => actionRequest(step.request.id, 'approve')}
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: '800',
                                                boxShadow: '0 4px 12px rgba(34, 146, 164, 0.3)'
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Global Toast Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '10px', fontWeight: '600' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PendingApprovals;
