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
                width: '100%',
                p: { xs: 2, sm: 3 }
            }}
        >
            <CircularProgress size={60} />
            <Typography
                variant="h6"
                sx={{
                    mt: 2,
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
            >
                Carregando...
            </Typography>
        </Box>
    );
}