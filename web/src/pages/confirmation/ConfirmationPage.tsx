import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button,
    AppBar, Toolbar, IconButton, Paper,
    List, ListItem, ListItemText, Divider,
    CircularProgress, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import useReportStore from '../../store/useReportStore';
import { submitDenuncia } from '../../services/api';

const typeLabels: Record<string, string> = {
    'FURTO': 'Furto',
    'ROUBO': 'Roubo',
    'AGRESSAO': 'Agressão',
    'DANO_AO_PATRIMONIO': 'Dano ao Patrimônio',
    'OUTROS': 'Outros'
};

export default function ConfirmationPage() {
    const navigate = useNavigate();
    const { formData } = useReportStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!formData.tipo || !formData.localizacao) {
        // Redirecionamento se faltar informações essenciais
        navigate('/home');
        return null;
    }

    const handleBackClick = () => {
        navigate('/local');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await submitDenuncia({
                tipo: formData.tipo,
                localizacao: {
                    endereco: formData.localizacao?.endereco || "",
                    latitude: formData.localizacao?.latitude,
                    longitude: formData.localizacao?.longitude
                }
            });

            navigate('/success', {
                state: { protocol: response.protocolo }
            });
        } catch (err) {
            console.error('Erro ao enviar denúncia:', err);
            setError('Ocorreu um erro ao enviar a denúncia. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
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
                        Confirmação
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Revise os dados da denúncia
                </Typography>

                <Paper sx={{ mt: 3, overflow: 'hidden' }}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Tipo de Denúncia"
                                secondary={typeLabels[formData.tipo] || formData.tipo}
                            />
                        </ListItem>

                        <Divider component="li" />

                        <ListItem>
                            <ListItemText
                                primary="Local da Ocorrência"
                                secondary={
                                    formData.localizacao?.endereco
                                        ? formData.localizacao.endereco
                                        : `Latitude: ${formData.localizacao?.latitude?.toFixed(6)}, Longitude: ${formData.localizacao?.longitude?.toFixed(6)}`
                                }
                            />
                        </ListItem>
                    </List>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={handleBackClick}
                        startIcon={<ArrowBackIcon />}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                        {loading ? 'Enviando...' : 'Enviar Denúncia'}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}