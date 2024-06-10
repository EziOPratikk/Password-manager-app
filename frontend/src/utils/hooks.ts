import { useState, useCallback } from 'react';

export function useSnackbar() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning'
  >('success');

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setIsSnackbarOpen(true);
    },
    []
  );

  // * Using useCallback can prevent unnecessary re-rendering
  // * by ensuring the function reference remains the same if dependencies haven't changed.
  const closeSnackbar = useCallback(() => {
    setTimeout(() => {
      setIsSnackbarOpen(false);
    }, 5000);
  }, []);

  return {
    isSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
  };
}