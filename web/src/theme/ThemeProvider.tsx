import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import theme from './index';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline /> {/* Reset de CSS para consistência entre navegadores */}
            {children}
        </MuiThemeProvider>
    );
}