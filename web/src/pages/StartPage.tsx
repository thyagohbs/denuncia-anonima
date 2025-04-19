import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import LogoAlagoas from '../components/common/LogoAlagoas';

export default function StartPage() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/home');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 1,
                        padding: { xs: 3, sm: 5 },
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <LogoAlagoas sx={{ width: '100%', maxWidth: 200, mb: 4 }} />

                    <Typography variant="h5" component="h1" align="center" gutterBottom fontWeight="bold">
                        Disque Denúncia Anônima
                    </Typography>

                    <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
                        Canal seguro para relatar situações de assédio, discriminação
                        e violência para mulheres da segurança pública.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handleStart}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            borderRadius: 1
                        }}
                    >
                        Iniciar Denúncia
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}