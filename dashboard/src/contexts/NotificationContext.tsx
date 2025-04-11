import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    message: string;
    type: NotificationType;
}

interface NotificationContextProps {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
    showNotification: () => { },
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<Notification>({
        message: '',
        type: 'info',
    });

    const showNotification = (message: string, type: NotificationType = 'info') => {
        setNotification({ message, type });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={notification.type} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};