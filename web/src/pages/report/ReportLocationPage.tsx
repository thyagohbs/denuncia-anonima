import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Passos do processo de denúncia
const steps = ['Tipo de Denúncia', 'Localização', 'Detalhes', 'Confirmação'];

export default function ReportLocationPage() {
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Verificar se temos um tipo selecionado
    useEffect(() => {
        const reportType = sessionStorage.getItem('reportType');
        if (!reportType) {
            // Se não tiver, voltar para o primeiro passo
            navigate('/report');
        }
    }, [navigate]);

    const handleGetLocation = () => {
        setLoading(true);
        setError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    sessionStorage.setItem('reportLocation', JSON.stringify({ latitude, longitude }));
                    setLoading(false);
                },
                (err) => {
                    setError('Não foi possível obter sua localização. Por favor, tente novamente ou insira manualmente.');
                    setLoading(false);
                    console.error('Erro ao obter localização:', err);
                }
            );
        } else {
            setError('Seu navegador não suporta geolocalização.');
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Se temos localização ou endereço, podemos prosseguir
        if (location || address.trim()) {
            // Guardar o endereço se informado
            if (address.trim()) {
                sessionStorage.setItem('reportAddress', address);
            }

            // Avançar para o próximo passo
            navigate('/report/details');
        } else {
            setError('Por favor, use sua localização atual ou informe um endereço.');
        }
    };

    const handleBack = () => {
        navigate('/report');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    Registrar Denúncia Anônima
                </Typography>

                <Stepper activeStep={1} alternativeLabel sx={{ mt: 4, mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Onde ocorreu o incidente?
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        Forneça a localização onde o incidente ocorreu. Você pode usar sua localização atual ou informar um endereço.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={loading ? <CircularProgress size={20} /> : <LocationOnIcon />}
                            onClick={handleGetLocation}
                            disabled={loading}
                            sx={{ mb: 2 }}
                        >
                            {loading ? 'Obtendo localização...' : 'Usar minha localização atual'}
                        </Button>
                    </Box>

                    {location && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Localização obtida com sucesso! Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
                        </Alert>
                    )}

                    <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                        Ou informe o endereço manualmente:
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="address"
                            label="Endereço do ocorrido"
                            name="address"
                            placeholder="Ex: Rua Augusta, 123, São Paulo - SP"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            multiline
                            rows={2}
                        />

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                startIcon={<ArrowBackIcon />}
                            >
                                Voltar
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                size="large"
                            >
                                Próximo
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}