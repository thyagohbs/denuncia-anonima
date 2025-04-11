import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import api from '../../services/api';
import axios from 'axios';

// Passos do processo de denúncia
const steps = ['Tipo de Denúncia', 'Localização', 'Detalhes', 'Confirmação'];

// Mapeamento de tipos para exibição
const reportTypeLabels: Record<string, string> = {
    'furto': 'Furto',
    'roubo': 'Roubo',
    'agressao': 'Agressão',
    'dano_ao_patrimonio': 'Dano ao Patrimônio',
    'outros': 'Outros'
};

export default function ReportConfirmationPage() {
    const navigate = useNavigate();
    const [reportType, setReportType] = useState<string>('');
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [protocol, setProtocol] = useState<string>('');

    // Carregar dados salvos anteriormente
    useEffect(() => {
        const savedType = sessionStorage.getItem('reportType');
        const savedLocation = sessionStorage.getItem('reportLocation');
        const savedAddress = sessionStorage.getItem('reportAddress');
        const savedDetails = sessionStorage.getItem('reportDetails');

        if (!savedType || !savedLocation || !savedDetails) {
            // Se faltarem dados essenciais, voltar para o início
            navigate('/report');
            return;
        }

        setReportType(savedType);
        setLocation(JSON.parse(savedLocation));
        if (savedAddress) setAddress(savedAddress);
        setDetails(savedDetails);
    }, [navigate]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // Preparar dados para envio
            const reportData = {
                tipo: reportType,
                localizacao: {
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    endereco: address || undefined
                },
                detalhes: details
            };

            // Enviar para a API
            const response = await api.post('/reports', reportData);

            // Sucesso - guardar protocolo
            setProtocol(response.data.protocolo);
            setSuccess(true);

            // Limpar dados do formulário
            sessionStorage.removeItem('reportType');
            sessionStorage.removeItem('reportLocation');
            sessionStorage.removeItem('reportAddress');
            sessionStorage.removeItem('reportDetails');

            // Navegação programática ocorrerá após 5 segundos
            setTimeout(() => {
                navigate('/track', { state: { protocol: response.data.protocolo } });
            }, 5000);

        } catch (err: unknown) {
            console.error('Erro ao enviar denúncia:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.');
            } else {
                setError('Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/report/details');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    {success ? 'Denúncia Enviada com Sucesso!' : 'Confirmar Denúncia'}
                </Typography>

                <Stepper activeStep={3} alternativeLabel sx={{ mt: 4, mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    {success ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />

                            <Typography variant="h5" gutterBottom>
                                Sua denúncia foi registrada com sucesso!
                            </Typography>

                            <Typography variant="body1" paragraph>
                                O número de protocolo da sua denúncia é:
                            </Typography>

                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                {protocol}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" paragraph>
                                Guarde este número para acompanhar o andamento da sua denúncia. Você será redirecionado em alguns segundos para a página de consulta.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => navigate('/track', { state: { protocol } })}
                                sx={{ mt: 2 }}
                            >
                                Ir para Consulta Agora
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Revise os dados da sua denúncia
                            </Typography>

                            <Typography variant="body2" color="text.secondary" paragraph>
                                Por favor, verifique se todas as informações estão corretas antes de enviar.
                            </Typography>

                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem>
                                    <ListItemText
                                        primary="Tipo de Denúncia"
                                        secondary={reportTypeLabels[reportType] || reportType}
                                    />
                                </ListItem>
                                <Divider component="li" />

                                <ListItem>
                                    <ListItemText
                                        primary="Localização"
                                        secondary={
                                            address
                                                ? address
                                                : `Latitude: ${location?.latitude.toFixed(6)}, Longitude: ${location?.longitude.toFixed(6)}`
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />

                                <ListItem sx={{ alignItems: 'flex-start' }}>
                                    <ListItemText
                                        primary="Detalhes"
                                        secondary={details}
                                        secondaryTypographyProps={{
                                            style: {
                                                whiteSpace: 'pre-wrap',
                                                maxHeight: '200px',
                                                overflow: 'auto'
                                            }
                                        }}
                                    />
                                </ListItem>
                            </List>

                            {error && (
                                <Alert severity="error" sx={{ mt: 3, mb: 1 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    startIcon={<ArrowBackIcon />}
                                    disabled={loading}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Denúncia'}
                                </Button>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
}