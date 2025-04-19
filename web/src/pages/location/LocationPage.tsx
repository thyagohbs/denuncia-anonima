import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button,
    AppBar, Toolbar, IconButton, Paper,
    CircularProgress, Alert, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useReportStore from '../../store/useReportStore';

export default function LocationPage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useReportStore();

    const [address, setAddress] = useState(formData.localizacao?.endereco || '');
    const [latitude, setLatitude] = useState<number | undefined>(formData.localizacao?.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(formData.localizacao?.longitude);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleBackClick = () => {
        navigate('/home');
    };

    const handleLocationGet = () => {
        setLoading(true);
        setError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);
                    setSuccess(true);
                    setLoading(false);
                },
                () => {
                    setError('Não foi possível obter a localização. Por favor, insira o endereço manualmente.');
                    setLoading(false);
                }
            );
        } else {
            setError('Seu navegador não suporta geolocalização.');
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!address && (!latitude || !longitude)) {
            setError('Por favor, informe sua localização ou endereço.');
            return;
        }

        if (latitude !== undefined && longitude !== undefined) {
            // Se ambos latitude e longitude existirem, crie um objeto Location completo
            updateFormData({
                localizacao: {
                    endereco: address,
                    latitude: latitude,
                    longitude: longitude
                }
            });
        } else {
            // Caso contrário, defina localizacao como null
            updateFormData({
                localizacao: null
            });
        }

        navigate('/confirmation');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleBackClick}
                        aria-label="voltar"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Local da Ocorrência
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Informe o local onde ocorreu o fato
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={loading ? <CircularProgress size={20} /> : <LocationOnIcon />}
                        onClick={handleLocationGet}
                        disabled={loading}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {loading ? 'Obtendo localização...' : 'Usar minha localização atual'}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Localização obtida com sucesso! Latitude: {latitude?.toFixed(6)}, Longitude: {longitude?.toFixed(6)}
                        </Alert>
                    )}
                </Paper>

                <Typography variant="subtitle1" gutterBottom>
                    Ou informe o endereço manualmente
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Endereço completo"
                        placeholder="Digite rua, número, bairro, cidade..."
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        margin="normal"
                    />

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={handleBackClick}
                            startIcon={<ArrowBackIcon />}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                        >
                            Próximo
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
}