import { useState } from 'react';

/**
 * useNotify — Central notification hook for ISquare Approval System.
 * Returns notifySuccess, notifyError helpers and a Snackbar state object.
 *
 * Usage:
 *   const { notifySuccess, notifyError, snackbar, closeSnackbar } = useNotify();
 *   notifySuccess("Purchase Request Created!");
 *   notifyError("Failed: Customer Name is required.");
 */
const useNotify = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' | 'error' | 'info' | 'warning'
    });

    const notifySuccess = (message) => {
        setSnackbar({ open: true, message, severity: 'success' });
    };

    const notifyError = (message) => {
        setSnackbar({ open: true, message, severity: 'error' });
    };

    const notifyInfo = (message) => {
        setSnackbar({ open: true, message, severity: 'info' });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return { notifySuccess, notifyError, notifyInfo, snackbar, closeSnackbar };
};

export default useNotify;
