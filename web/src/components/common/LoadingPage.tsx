import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Carregando...
            </Typography>
        </Box>
    );
}