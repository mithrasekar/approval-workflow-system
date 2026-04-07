import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Snackbar, Alert, Button, Divider } from '@mui/material';
import api, { getActiveUserId } from '../api';
import { useNavigate } from 'react-router-dom';
import useNotify from '../hooks/useNotify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

/* ─── Google Fonts injection ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';
if (!document.head.querySelector('[href*="Plus+Jakarta"]')) document.head.appendChild(fontLink);

/* ─── Modern Styling Tokens ─── */
const theme = {
    primary: 'rgb(34, 146, 164)',
    primaryLight: 'rgba(34, 146, 164, 0.8)',
    secondary: '#10b981',
    textMain: '#1e293b',
    textMuted: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    white: '#ffffff'
};

const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const serif = { fontFamily: "'DM Serif Display', serif" };

const cardBase = {
    background: theme.white,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    overflow: 'hidden'
};

const inputStyle = (isFocused, isError) => ({
    width: '100%',
    background: '#ffffff',
    border: `1.5px solid ${isError ? '#ef4444' : (isFocused ? theme.primary : theme.border)}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: theme.textMain,
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isFocused ? `0 0 0 4px ${theme.primary}15` : 'none',
    boxSizing: 'border-box',
    ...font,
});

const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: theme.textMuted,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    ...font
};

const sectionTitleStyle = {
    ...serif,
    fontSize: '1.25rem',
    color: theme.textMain,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

/* ─── Sub-components ─── */
const SectionHeader = ({ icon: Icon, title }) => (
    <Typography sx={sectionTitleStyle}>
        <Icon sx={{ color: theme.primary, fontSize: '1.2rem' }} />
        {title}
    </Typography>
);

const FormField = ({ label, icon: Icon, error, children }) => (
    <Box sx={{ mb: 3 }}>
        <label style={labelStyle}>
            {Icon && <Icon sx={{ fontSize: '1rem', color: theme.primaryLight }} />}
            {label}
        </label>
        {children}
        {error && (
            <Typography sx={{ fontSize: '11px', color: '#ef4444', mt: 0.5, ml: 1, ...font }}>
                {error}
            </Typography>
        )}
    </Box>
);

const CreatePR = () => {
    const navigate = useNavigate();
    const { notifySuccess, notifyError, snackbar, closeSnackbar } = useNotify();
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow; // restore on unmount
        };
    }, []);
    const [formData, setFormData] = useState({
        pr_number: `PR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        customer_name: '',
        department: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [focused, setFocused] = useState(null);

    const fmt = (n) => Number(n).toLocaleString('en-IN');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'customer_name' || name === 'product_name' || name === 'department') {
            finalValue = finalValue.replace(/[0-9]/g, '');
        }

        const updated = { ...formData, [name]: finalValue };
        if (name === 'quantity' || name === 'unit_price') {
            updated.total_price = Number(updated.quantity) * Number(updated.unit_price);
        }
        setFormData(updated);
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.customer_name.trim()) newErrors.customer_name = 'Required';
        if (!formData.product_name.trim()) newErrors.product_name = 'Required';
        if (Number(formData.quantity) < 1) newErrors.quantity = 'Min 1';
        if (Number(formData.unit_price) < 0) newErrors.unit_price = 'Invalid';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            notifyError('Please check the form for errors.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/pr', {
                ...formData,
                quantity: Number(formData.quantity),
                unit_price: Number(formData.unit_price),
                total_price: Number(formData.total_price),
                created_by: getActiveUserId(),
            });
            notifySuccess('Purchase request submitted successfully!');
            setTimeout(() => navigate('/prs'), 1200);
        } catch (err) {
            const reason = err.response?.data?.error || err.response?.data?.message || err.message;
            notifyError(`Failed: ${reason}`);
        } finally {
            setSubmitting(false);
        }
    };

    const isSalesExec = (() => {
        try {
            return JSON.parse(localStorage.getItem('AUTH_USER'))?.role?.role_name === 'SALES_EXEC';
        } catch { return false; }
    })();

    return (
        <Box sx={{ height: '100vh', background: theme.bg, py: 2 }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
                {/* ── Top Navigation ── */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/prs')}
                        sx={{ color: theme.textMuted, fontSize: '0.8rem', textTransform: 'none', '&:hover': { background: 'transparent', color: theme.primary } }}
                    >
                        Back to Procurement
                    </Button>
                </Box>

                {/* ── Main Header ── */}
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 4 }}>
                    <Box>
                        <Typography sx={{ ...serif, fontSize: '3rem', color: theme.textMain, lineHeight: 1.1 }}>
                            Create New Request
                        </Typography>
                        <Typography sx={{ ...font, color: theme.textMuted, mt: 1, maxWidth: '600px' }}>
                            Define your procurement requirements and submit for approval.
                        </Typography>
                    </Box>
                    <Box sx={{ height: 'fit-content', mt: 1, background: theme.primary, color: '#fff', px: 3, py: 1.5, borderRadius: '12px', boxShadow: `0 10px 20px -5px ${theme.primary}40`, textAlign: 'left' }}>
                        <Typography sx={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, mb: 0.5, ...font }}>Reference ID</Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '1px', ...font }}>{formData.pr_number}</Typography>
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* ── Left Content ── */}
                        <Grid item xs={12} lg={8}>
                            <Box sx={{ ...cardBase, p: 4 }}>
                                {/* Section 1: General Info */}
                                <SectionHeader icon={ReceiptLongOutlinedIcon} title="General Information" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label="Requester Name" error={errors.customer_name}>
                                            <input
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('customer_name')}
                                                onBlur={() => setFocused(null)}
                                                placeholder="Enter Requester Name"
                                                style={inputStyle(focused === 'customer_name', errors.customer_name)}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label="Department" error={errors.department}>
                                            <input
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('department')}
                                                onBlur={() => setFocused(null)}
                                                placeholder="Enter Department"
                                                style={inputStyle(focused === 'department')}
                                            />
                                        </FormField>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 4, borderColor: theme.border, opacity: 0.5 }} />

                                {/* Section 2: Product Info */}
                                <SectionHeader icon={ShoppingBagOutlinedIcon} title="Requirement Details" />
                                <Box sx={{ mb: 3 }}>
                                    <FormField label="Product or Service Name" error={errors.product_name}>
                                        <input
                                            name="product_name"
                                            value={formData.product_name}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('product_name')}
                                            onBlur={() => setFocused(null)}
                                            placeholder="What do you need?"
                                            style={inputStyle(focused === 'product_name', errors.product_name)}
                                        />
                                    </FormField>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label="Item Quantity" error={errors.quantity}>
                                            <input
                                                name="quantity"
                                                type="number"
                                                min="1"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('quantity')}
                                                onBlur={() => setFocused(null)}
                                                style={inputStyle(focused === 'quantity', errors.quantity)}
                                            />
                                        </FormField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormField label="Unit Price" error={errors.unit_price}>
                                            <Box sx={{ position: 'relative' }}>
                                                <Box sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '14px', fontWeight: 600 }}>₹</Box>
                                                <input
                                                    name="unit_price"
                                                    type="number"
                                                    min="0"
                                                    value={formData.unit_price}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocused('unit_price')}
                                                    onBlur={() => setFocused(null)}
                                                    style={{ ...inputStyle(focused === 'unit_price', errors.unit_price), paddingLeft: '30px' }}
                                                />
                                            </Box>
                                        </FormField>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* ── Right Sidebar Summary ── */}
                        <Grid item xs={12} lg={4}>
                            <Box sx={{ ...cardBase, position: 'sticky', top: 24, p: 0 }}>
                                <Box sx={{ p: 3, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`, color: '#fff' }}>
                                    <Typography sx={{ ...font, fontWeight: 700, fontSize: '1.2rem', mb: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AccountBalanceWalletOutlinedIcon /> Request Summary
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', opacity: 0.9 }}>Total cost estimation based on line items.</Typography>
                                </Box>

                                <Box sx={{ p: 4 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography sx={{ ...font, color: theme.textMuted, fontSize: '0.9rem' }}>Unit Price</Typography>
                                            <Typography sx={{ ...font, fontWeight: 600 }}>₹{fmt(formData.unit_price)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography sx={{ ...font, color: theme.textMuted, fontSize: '0.9rem' }}>Quantity</Typography>
                                            <Typography sx={{ ...font, fontWeight: 600 }}>× {formData.quantity}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Typography sx={{ ...font, fontWeight: 700, color: theme.textMain }}>Total Estimated</Typography>
                                            <Typography sx={{ ...serif, fontSize: '2rem', color: theme.primary }}>₹{fmt(formData.total_price)}</Typography>
                                        </Box>
                                    </Box>

                                    {isSalesExec && (
                                        <Box sx={{ mb: 4, p: 2.5, borderRadius: '12px', background: `${theme.primary}05`, border: `1px solid ${theme.primary}20` }}>
                                            <Typography sx={{ fontSize: '12px', color: theme.primary, lineHeight: 1.6, ...font, fontWeight: 500 }}>
                                                Your request will be routed to your department manager for primary approval.
                                            </Typography>
                                        </Box>
                                    )}

                                    <Button
                                        type="submit"
                                        fullWidth
                                        disabled={submitting}
                                        variant="contained"
                                        sx={{
                                            py: 2,
                                            borderRadius: '12px',
                                            background: submitting ? theme.textMuted : theme.primary,
                                            boxShadow: `0 10px 20px -5px ${theme.primary}40`,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            ...font,
                                            '&:hover': {
                                                background: theme.primaryLight,
                                                transform: 'translateY(-2px)',
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {submitting ? 'Processing...' : 'Submit Request'}
                                    </Button>

                                    <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '11px', color: theme.textMuted, ...font }}>
                                        By submitting, you agree to our internal procurement policies.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </form>

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
                        sx={{ width: '100%', borderRadius: '12px', fontWeight: 600, ...font, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default CreatePR;