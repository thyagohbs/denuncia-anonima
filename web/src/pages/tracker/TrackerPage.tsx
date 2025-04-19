import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button,
    AppBar, Toolbar, IconButton, Paper,
    CircularProgress, Alert, Divider, Chip, List, ListItem, ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { getDenuncia } from '../../services/api';
import axios from 'axios';  // Importe o tipo AxiosError

interface LocationState {
    protocol?: string;
}

interface DenunciaStatus {
    protocolo: string;
    tipo: string;
    status: string;
    dataRegistro: string;
    ultimaAtualizacao: string;
}

const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    RECEBIDA: "info",
    EM_ANALISE: "primary",
    EM_INVESTIGACAO: "warning",
    CONCLUIDA: "success",
    ARQUIVADA: "default",
};

const statusLabels: Record<string, string> = {
    RECEBIDA: "Recebida",
    EM_ANALISE: "Em análise",
    EM_INVESTIGACAO: "Em investigação",
    CONCLUIDA: "Concluída",
    ARQUIVADA: "Arquivada",
};

export default function TrackerPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [protocol, setProtocol] = useState(state?.protocol || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [denuncia, setDenuncia] = useState<DenunciaStatus | null>(null);

    const handleBackClick = () => {
        navigate('/start');
    };

    // ...rest of imports

    const handleSearch = useCallback(async () => {
        if (!protocol.trim()) {
            setError('Por favor, informe o número de protocolo');
            return;
        }

        setLoading(true);
        setError(null);
        setDenuncia(null);

        try {
            const data = await getDenuncia(protocol);
            setDenuncia(data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.status === 404
                        ? 'Denúncia não encontrada. Verifique o número de protocolo.'
                        : 'Ocorreu um erro ao buscar sua denúncia. Por favor, tente novamente.'
                );
            } else {
                setError('Ocorreu um erro ao buscar sua denúncia. Por favor, tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    }, [protocol]);

    useEffect(() => {
        if (state?.protocol) {
            handleSearch();
        }
    }, [handleSearch, state?.protocol]);

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
                        Consultar Denúncia
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Informe o número de protocolo da denúncia
                </Typography>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Número de protocolo"
                            value={protocol}
                            onChange={(e) => setProtocol(e.target.value)}
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                        >
                            Buscar
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                {loading && !denuncia && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {denuncia && (
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Protocolo: {denuncia.protocolo}
                            </Typography>
                            <Chip
                                label={statusLabels[denuncia.status] || denuncia.status}
                                color={statusColors[denuncia.status] || "default"}
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Tipo de Denúncia"
                                    secondary={denuncia.tipo.charAt(0).toUpperCase() + denuncia.tipo.slice(1).toLowerCase().replace('_', ' ')}
                                />
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                                <ListItemText
                                    primary="Data de Registro"
                                    secondary={formatDate(denuncia.dataRegistro)}
                                />
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                                <ListItemText
                                    primary="Última Atualização"
                                    secondary={formatDate(denuncia.ultimaAtualizacao)}
                                />
                            </ListItem>
                        </List>

                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                Acompanhe regularmente o status da sua denúncia utilizando o número de protocolo.
                            </Typography>
                        </Alert>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}