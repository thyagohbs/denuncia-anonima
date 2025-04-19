import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Typography, Button,
    Paper, Alert, Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

interface LocationState {
    protocol: string;
}

export default function SuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    // Verificar se temos o protocolo
    useEffect(() => {
        if (!state?.protocol) {
            navigate('/start');
        }
    }, [state, navigate]);

    if (!state?.protocol) {
        return null;
    }

    const handleGoToTracker = () => {
        navigate('/track', { state: { protocol: state.protocol } });
    };

    const handleGoToStart = () => {
        navigate('/start');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Paper elevation={2} sx={{ p: 4, borderRadius: 1, textAlign: 'center' }}>
                    <CheckCircleOutlineIcon
                        color="success"
                        sx={{ fontSize: 80, mb: 2 }}
                    />

                    <Typography variant="h5" component="h1" gutterBottom>
                        Denúncia registrada com sucesso!
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        Sua denúncia foi registrada sob o número:
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            py: 2,
                            backgroundColor: '#f8f8f8',
                            borderRadius: 1,
                            mb: 3
                        }}
                    >
                        {state.protocol}
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                        <Typography variant="body2">
                            <strong>Importante:</strong> Guarde este número para acompanhar o andamento da sua denúncia.
                        </Typography>
                    </Alert>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleGoToTracker}
                            fullWidth={false}
                            sx={{ minWidth: '200px' }}
                        >
                            Acompanhar denúncia
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            onClick={handleGoToStart}
                            fullWidth={false}
                            sx={{ minWidth: '200px' }}
                        >
                            Voltar ao início
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}