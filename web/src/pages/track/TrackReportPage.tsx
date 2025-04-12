import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    TextField,
    CircularProgress,
    Alert,
    Divider,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../services/api';
import axios from 'axios';

// Interface para o status de denúncia
interface Report {
    protocolo: string;
    tipo: string;
    status: string;
    detalhes: string;
    criadoEm: string;
    atualizadoEm: string;
}

// Mapeamento de status para exibição
const statusLabels: Record<string, string> = {
    'recebida': 'Recebida',
    'em_analise': 'Em Análise',
    'em_investigacao': 'Em Investigação',
    'concluida': 'Concluída',
    'arquivada': 'Arquivada'
};

// Mapeamento de cores para os status
const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    'recebida': 'info',
    'em_analise': 'primary',
    'em_investigacao': 'warning',
    'concluida': 'success',
    'arquivada': 'default'
};

export default function TrackReportPage() {
    const location = useLocation();
    const [protocolId, setProtocolId] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Verificar se recebemos um protocolo da navegação
    useEffect(() => {
        if (location.state?.protocol) {
            setProtocolId(location.state.protocol);
            handleSearch(location.state.protocol);
        }
    }, [location.state]);

    const handleSearch = async (protocol = protocolId) => {
        if (!protocol.trim()) {
            setError('Por favor, informe o número de protocolo');
            return;
        }

        setLoading(true);
        setError(null);
        setReport(null);

        try {
            const response = await api.get(`/reports/protocolo/${protocol}`);
            setReport(response.data);
        } catch (err: unknown) {
            console.error('Erro ao buscar denúncia:', err);

            // Verificar se é um erro do Axios
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.status === 404
                        ? 'Denúncia não encontrada. Verifique o número de protocolo.'
                        : 'Ocorreu um erro ao buscar sua denúncia. Por favor, tente novamente.'
                );
            } else {
                setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    Consultar Denúncia
                </Typography>

                <Typography variant="body1" paragraph align="center">
                    Verifique o status da sua denúncia utilizando o número de protocolo recebido.
                </Typography>

                <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <TextField
                            fullWidth
                            id="protocol"
                            label="Número de Protocolo"
                            variant="outlined"
                            value={protocolId}
                            onChange={(e) => setProtocolId(e.target.value)}
                            placeholder="Digite o número de protocolo recebido"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSearch()}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            sx={{ height: 56 }}
                        >
                            Buscar
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 3 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {report && (
                    <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2">
                                Protocolo: {report.protocolo}
                            </Typography>
                            <Chip
                                label={statusLabels[report.status] || report.status}
                                color={statusColors[report.status] || 'default'}
                            />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tipo de Denúncia
                            </Typography>
                            <Typography variant="body1">
                                {report.tipo.charAt(0).toUpperCase() + report.tipo.slice(1).replace('_', ' ')}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Data de Registro
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(report.criadoEm)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Última Atualização
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(report.atualizadoEm)}
                            </Typography>
                        </Box>

                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                Acompanhe regularmente o status da sua denúncia utilizando o número de protocolo fornecido.
                                As atualizações serão refletidas nesta página.
                            </Typography>
                        </Alert>
                    </Paper>
                )}
            </Box>
        </Container>
    );
}