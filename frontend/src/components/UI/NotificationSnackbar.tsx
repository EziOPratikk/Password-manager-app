import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface NotificationSnackbarProps {
  isOpen: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning';
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  isOpen,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={severity}
        sx={{
          width: '100%',
          fontSize: '1rem',
          p: 2,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;