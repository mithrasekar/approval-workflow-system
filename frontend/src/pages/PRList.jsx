import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip, 
    Button,
    Container,
    Divider,
    IconButton,
    Tooltip,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../api';

const PRList = () => {
    const [prs, setPrs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const loadPrs = async (pageNumber = page, pageLimit = limit) => {
        setLoading(true);
        try {
            const res = await api.get(`/pr/list?page=${pageNumber}&limit=${pageLimit}`);
            const data = res.data.data || {};
            setPrs(data.items || []);
            setPage(data.page || pageNumber);
            setLimit(data.limit || pageLimit);
            setTotalPages(data.totalPages || 0);
            setTotalCount(data.total || 0);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrs();
    }, []);

    const getStatusStyles = (status) => {
        switch(status) {
            case 'APPROVED': 
            case 'CLOSED':
                return { color: 'success', bgColor: '#e8f5e9', textColor: '#2e7d32' };
            case 'REJECTED': 
                return { color: 'error', bgColor: '#ffebee', textColor: '#d32f2f' };
            case 'PENDING': 
                return { color: 'warning', bgColor: '#fff3e0', textColor: '#ef6c00' };
            default: 
                return { color: 'default', bgColor: '#f5f5f5', textColor: '#757575' };
        }
    };

    const authUser = JSON.parse(localStorage.getItem('AUTH_USER') || '{}');
    const isAdmin = authUser?.role?.role_name === 'ADMIN';

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        sx={{ fontWeight: '800', color: '#111827', mb: 1, letterSpacing: '-1px' }}
                    >
                        Purchase Requests
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage and track the lifecycle of your purchase order approvals.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Refresh List">
                        <IconButton onClick={() => loadPrs()} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    {!isAdmin && (
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            component={RouterLink}
                            to="/create-pr"
                            sx={{ 
                                px: 3, 
                                py: 1.2, 
                                borderRadius: '8px', 
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 14px 0 rgba(34, 146, 164, 0.39)'
                            }}
                        >
                            Create New PR
                        </Button>
                    )}
                </Box>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box>
                    <Typography variant="body2" color="textSecondary">
                        Showing {prs.length} of {totalCount} requests
                        {totalCount > 0 && ` · Page ${page} of ${totalPages}`}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="rows-per-page-label">Rows</InputLabel>
                        <Select
                            labelId="rows-per-page-label"
                            value={limit}
                            label="Rows"
                            onChange={(event) => {
                                const newLimit = Number(event.target.value);
                                setPage(1);
                                setLimit(newLimit);
                                loadPrs(1, newLimit);
                            }}
                        >
                            {[5, 10, 20, 50].map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => {
                            setPage(value);
                            loadPrs(value, limit);
                        }}
                        color="primary"
                        shape="rounded"
                        disabled={totalPages === 0}
                    />
                </Box>
            </Box>

            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: '12px', 
                    border: '1px solid #eaeaea',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '12px' }}>PR Number</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '12px' }}>Customer Name</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '12px' }}>Total Value</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '12px' }}>Requester</TableCell>
                            <TableCell sx={{ fontWeight: '700', color: '#374151', textTransform: 'uppercase', fontSize: '12px' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prs.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Typography variant="h6" color="textSecondary">No requests found. Create one to get started.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        
                        {prs.map((pr) => {
                            const styles = getStatusStyles(pr.status);
                            return (
                                <TableRow 
                                    key={pr.id} 
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: '600', color: 'primary.main' }}>
                                        {pr.pr_number}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: '500', color: '#111827' }}>
                                        {pr.customer_name}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: '700', color: '#111827' }}>
                                        ₹{parseFloat(pr.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2" sx={{ fontWeight: '600', color: '#374151' }}>
                                                {pr.creator?.name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {pr.creator?.role?.role_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={pr.status} 
                                            sx={{ 
                                                backgroundColor: styles.bgColor, 
                                                color: styles.textColor,
                                                fontWeight: '700',
                                                fontSize: '11px',
                                                borderRadius: '6px',
                                                height: '24px'
                                            }} 
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>



            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                    Last synchronized: {new Date().toLocaleTimeString()}
                </Typography>
            </Box>
        </Container>
    );
};

export default PRList;
