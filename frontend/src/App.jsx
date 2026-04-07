import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    Container, 
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PRList from './pages/PRList';
import CreatePR from './pages/CreatePR';
import PendingApprovals from './pages/PendingApprovals';
import AdminUsers from './pages/AdminUsers';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const authUser = localStorage.getItem('AUTH_USER');
    if (!authUser) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const loadAuthUser = () => {
        const authUser = localStorage.getItem('AUTH_USER');
        if (authUser) {
            setUser(JSON.parse(authUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        loadAuthUser();
        
        // Listen for login/logout events from other components
        const handleAuthChange = () => loadAuthUser();
        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem('AUTH_USER');
        localStorage.removeItem('MOCK_USER_ID');
        window.dispatchEvent(new Event('authChange'));
        handleClose();
    };

    return (
        <Router>
            <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                {user && (
                    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea' }}>
                        <Toolbar sx={{ minHeight: '70px', px: { xs: 2, md: 4 } }}>
                            <Typography 
                                variant="h5" 
                                component={RouterLink} 
                                to="/prs"
                                sx={{ 
                                    flexGrow: 1, 
                                    fontWeight: '900', 
                                    color: 'primary.main', 
                                    letterSpacing: '-1.5px',
                                    textDecoration: 'none',
                                    '&:hover': { opacity: 0.8 }
                                }}
                            >
                                ISquare
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button sx={{ color: '#4b5563', fontWeight: '800', fontSize: '13px' }} component={RouterLink} to="/prs">ALL PRs</Button>
                                {user?.role?.role_name !== 'ADMIN' && (
                                    <Button sx={{ color: '#4b5563', fontWeight: '800', fontSize: '13px' }} component={RouterLink} to="/create-pr">CREATE PR</Button>
                                )}
                                {user?.role?.role_name === 'MANAGER' && (
                                    <Button sx={{ color: '#4b5563', fontWeight: '800', fontSize: '13px' }} component={RouterLink} to="/approvals">PENDING</Button>
                                )}
                                {user?.role?.role_name === 'ADMIN' && (
                                    <Button sx={{ color: '#4b5563', fontWeight: '800', fontSize: '13px' }} component={RouterLink} to="/admin/users">USERS</Button>
                                )}

                                <Divider orientation="vertical" flexItem sx={{ mx: 2, height: '24px', alignSelf: 'center' }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, cursor: 'pointer' }} onClick={handleMenu}>
                                    <Box sx={{ textAlign: 'right', mr: 1.5, display: { xs: 'none', sm: 'block' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: '800', color: '#111827', lineHeight: 1.2 }}>{user.name}</Typography>
                                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>
                                            {user.role?.role_name === 'SALES_EXEC' ? 'Sales Executive' : (user.role?.role_name === 'ADMIN' ? 'Administrator' : 'Manager')}
                                        </Typography>
                                    </Box>
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            bgcolor: 'primary.main', 
                                            fontSize: '1rem', 
                                            fontWeight: '800',
                                            boxShadow: '0 4px 12px rgba(34, 146, 164, 0.2)' 
                                        }}
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                </Box>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            mt: 1.5,
                                            borderRadius: '12px',
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                
                                    <Divider />
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon> Sign Out
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </AppBar>
                )}

                <Container maxWidth="lg" sx={{ pt: user ? 2 : 0 }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/prs" element={<ProtectedRoute><PRList /></ProtectedRoute>} />
                        <Route path="/create-pr" element={<ProtectedRoute><CreatePR /></ProtectedRoute>} />
                        <Route path="/approvals" element={<ProtectedRoute><PendingApprovals /></ProtectedRoute>} />
                        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                        <Route path="/" element={<Navigate to={user ? "/prs" : "/login"} replace />} />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}

export default App;
