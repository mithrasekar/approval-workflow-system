import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    CircularProgress,
    Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BadgeIcon from '@mui/icons-material/Badge';
import api from '../api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleIcon = (roleName) => {
        switch(roleName) {
            case 'ADMIN': return <AdminPanelSettingsIcon sx={{ fontSize: '18px' }} />;
            case 'MANAGER': return <EngineeringIcon sx={{ fontSize: '18px' }} />;
            case 'SALES_EXEC': return <BadgeIcon sx={{ fontSize: '18px' }} />;
            default: return <PersonIcon sx={{ fontSize: '18px' }} />;
        }
    };

    const getRoleColor = (roleName) => {
        switch(roleName) {
            case 'ADMIN': return { bg: '#ffeeff', color: '#9c27b0' };
            case 'MANAGER': return { bg: '#e3f2fd', color: '#1976d2' };
            case 'SALES_EXEC': return { bg: '#e8f5e9', color: '#2e7d32' };
            default: return { bg: '#f5f5f5', color: '#757575' };
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: '900', 
                            color: '#111827', 
                            mb: 1.5, 
                            letterSpacing: '-2px',
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                    >
                        User Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: '600px', fontWeight: 500 }}>
                        Review and manage all system users, their access levels, and account statuses.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Search users..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ 
                            width: '280px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#fff'
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9ca3af' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="Refresh List">
                        <IconButton 
                            onClick={fetchUsers} 
                            sx={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                '&:hover': { backgroundColor: '#f9fafb' }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Fade in={true} timeout={1000}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        borderRadius: '20px', 
                        border: '1px solid #eaeaea', 
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell sx={{ py: 2, fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '1px' }}>User Details</TableCell>
                                <TableCell sx={{ fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '1px' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '1px' }} align="center">Status</TableCell>
                                <TableCell sx={{ fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', color: '#4b5563', letterSpacing: '1px' }}>Joined Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                        <Typography color="textSecondary">No users found matching your criteria.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.map((user) => {
                                const roleStyle = getRoleColor(user.role?.role_name);
                                return (
                                    <TableRow key={user.id} hover sx={{ transition: 'background-color 0.2s' }}>
                                        <TableCell sx={{ py: 2.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: 'primary.main', 
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 4px 10px rgba(34, 146, 164, 0.2)'
                                                    }}
                                                >
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontWeight: '700', color: '#111827', fontSize: '0.95rem' }}>{user.name}</Typography>
                                                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{user.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={getRoleIcon(user.role?.role_name)}
                                                label={user.role?.role_name}
                                                sx={{ 
                                                    backgroundColor: roleStyle.bg,
                                                    color: roleStyle.color,
                                                    fontWeight: '800',
                                                    fontSize: '11px',
                                                    borderRadius: '8px',
                                                    '& .MuiChip-icon': { color: 'inherit' }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={user.is_active ? 'Active' : 'Inactive'}
                                                sx={{ 
                                                    backgroundColor: user.is_active ? '#ecfdf5' : '#fef2f2',
                                                    color: user.is_active ? '#059669' : '#dc2626',
                                                    fontWeight: 'bold',
                                                    fontSize: '11px',
                                                    borderRadius: '6px',
                                                    height: '24px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
                                                {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </Fade>
        </Container>
    );
};

export default AdminUsers;
