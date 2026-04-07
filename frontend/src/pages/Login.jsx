import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Paper, 
    Container, 
    InputAdornment, 
    IconButton,
    Alert,
    CircularProgress,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/login', { identity, password });
            if (res.data.success) {
                const user = res.data.data;
                // Save user identity to localStorage
                localStorage.setItem('AUTH_USER', JSON.stringify(user));
                localStorage.setItem('MOCK_USER_ID', user.id); // For legacy compatibility with other pages
                
                // Trigger a global event to update the Navbar
                window.dispatchEvent(new Event('authChange'));
                
                navigate('/prs');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box 
            sx={{ 
                height: '100vh', 
                width: '100vw',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}
        >
            <Container maxWidth="xs">
                <Fade in={true} timeout={800}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 5, 
                            borderRadius: '24px', 
                            border: '1px solid #eaeaea',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Box 
                            sx={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: '15px', 
                                backgroundColor: 'primary.main', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 8px 16px rgba(34, 146, 164, 0.3)'
                            }}
                        >
                            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 30 }} />
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: '800', color: '#111827', mb: 1, letterSpacing: '-1px' }}>
                            ISquare
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                            Enter your credentials to access the Approval Workflow System
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontSize: '13px' }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email or Phone Number"
                                variant="outlined"
                                margin="normal"
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                placeholder="e.g. mithra@isquare.com"
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ 
                                    mt: 4, 
                                    py: 1.8, 
                                    borderRadius: '12px', 
                                    fontWeight: '800',
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 24px -8px rgba(34, 146, 164, 0.5)'
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="caption" color="textSecondary">
                                Don't have access? Contact your System Administrator.
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Login;
