import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress
} from '@mui/material';
import { Report, ReportStatus, ReportType } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MapIcon from '@mui/icons-material/Map';
import UpdateIcon from '@mui/icons-material/Update';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Tipos de mapeamento para exibição
const ReportTypeLabels: Record<ReportType, string> = {
    [ReportType.FURTO]: 'Furto',
    [ReportType.ROUBO]: 'Roubo',
    [ReportType.AGRESSAO]: 'Agressão',
    [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao Patrimônio',
    [ReportType.OUTROS]: 'Outros'
};

const ReportStatusLabels: Record<ReportStatus, string> = {
    [ReportStatus.RECEBIDA]: 'Recebida',
    [ReportStatus.EM_ANALISE]: 'Em Análise',
    [ReportStatus.EM_INVESTIGACAO]: 'Em Investigação',
    [ReportStatus.CONCLUIDA]: 'Concluída',
    [ReportStatus.ARQUIVADA]: 'Arquivada'
};

// Cores para badges de status
const statusColors: Record<ReportStatus, 'info' | 'warning' | 'error' | 'success' | 'default'> = {
    [ReportStatus.RECEBIDA]: 'info',
    [ReportStatus.EM_ANALISE]: 'warning',
    [ReportStatus.EM_INVESTIGACAO]: 'error',
    [ReportStatus.CONCLUIDA]: 'success',
    [ReportStatus.ARQUIVADA]: 'default'
};

// Cores para badges de tipo
const typeColors: Record<ReportType, 'info' | 'error' | 'warning' | 'secondary' | 'default'> = {
    [ReportType.FURTO]: 'info',
    [ReportType.ROUBO]: 'error',
    [ReportType.AGRESSAO]: 'warning',
    [ReportType.DANO_AO_PATRIMONIO]: 'secondary',
    [ReportType.OUTROS]: 'default'
};

interface ReportDetailViewProps {
    reportId?: string;
    report?: Report;
    isOpen?: boolean;
    onClose?: () => void;
    isModal?: boolean;
}

interface StatusFormData {
    status: ReportStatus;
    comentario?: string;
}

// Função auxiliar para obter a URL do mapa estático
const getMapImageUrl = (lat: number, lng: number): string => {
    // Aqui você usaria uma API como Google Maps Static API ou OpenStreetMap
    // Para fins de exemplo, estou usando a API pública do OpenStreetMap
    // Em produção, você deve usar uma chave API adequada e possivelmente uma solução paga
    return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${lng},${lat}&zoom=14&marker=lonlat:${lng},${lat};color:%23ff0000;size:medium&apiKey=YOUR_API_KEY_HERE`;
};

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
    reportId,
    report: initialReport,
    isOpen = true,
    onClose,
    isModal = false
}) => {
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const queryClient = useQueryClient();

    const { control, handleSubmit, formState: { errors } } = useForm<StatusFormData>({
        defaultValues: initialReport ? { status: initialReport.status } : { status: ReportStatus.RECEBIDA }
    });

    // Buscar dados se temos apenas o ID
    const { data: report, isLoading, error } = useQuery({
        queryKey: ['report', reportId],
        queryFn: () => reportId ? fetch(`/api/reports/${reportId}`).then(res => res.json()) : null,
        enabled: !!reportId && !initialReport,
        initialData: initialReport
    });

    // Mutação para atualizar o status
    const updateStatusMutation = useMutation({
        mutationFn: (data: StatusFormData) => {
            return fetch(`/api/reports/${report?.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(res => {
                if (!res.ok) throw new Error('Falha ao atualizar status');
                return res.json();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['report', reportId] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            setEditMode(false);
        }
    });

    const onSubmit = (data: StatusFormData) => {
        updateStatusMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (!report) {
        return (
            <Alert severity="error">
                Denúncia não encontrada ou erro ao carregar dados
            </Alert>
        );
    }

    // Conteúdo principal que será usado tanto no modal quanto na página
    const content = (
        <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Denúncia {report.protocolo}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={report.tipo && ReportTypeLabels[report.tipo as ReportType]}
                            color={report.tipo && typeColors[report.tipo as ReportType]}
                            size="small"
                        />
                        <Chip
                            label={report.status && ReportStatusLabels[report.status as ReportStatus]}
                            color={report.status && statusColors[report.status as ReportStatus]}
                            size="small"
                        />
                    </Box>
                </Box>
                {!editMode && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setEditMode(true)}
                        startIcon={<UpdateIcon />}
                    >
                        Atualizar Status
                    </Button>
                )}
            </Box>

            {/* Seção de Status em modo de edição */}
            {editMode && (
                <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
                    <Typography variant="h6" gutterBottom>
                        Atualizar Status
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: "Status é obrigatório" }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.status} margin="normal">
                                            <InputLabel id="status-label">Status</InputLabel>
                                            <Select
                                                labelId="status-label"
                                                id="status"
                                                label="Status"
                                                {...field}
                                            >
                                                {Object.entries(ReportStatus).map(([key, value]) => (
                                                    <MenuItem key={key} value={value}>
                                                        {ReportStatusLabels[value]}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.status && (
                                                <Typography variant="caption" color="error">
                                                    {errors.status.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="comentario"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Comentário (opcional)"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={3}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setEditMode(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={updateStatusMutation.isPending}
                            >
                                {updateStatusMutation.isPending ? 'Atualizando...' : 'Atualizar Status'}
                            </Button>
                        </Box>
                    </form>
                    {updateStatusMutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Erro ao atualizar status: {updateStatusMutation.error.message}
                        </Alert>
                    )}
                </Paper>
            )}

            <Grid container spacing={3}>
                {/* Detalhes gerais */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Detalhes da Ocorrência
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                            {report.detalhes}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Data e Hora do Registro
                            </Typography>
                            <Typography variant="body1">
                                {format(new Date(report.criadoEm), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                            </Typography>
                        </Box>

                        {report.atualizadoEm && report.atualizadoEm !== report.criadoEm && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Última Atualização
                                </Typography>
                                <Typography variant="body1">
                                    {format(new Date(report.atualizadoEm), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Localização */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">
                                Localização
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setMapDialogOpen(true)}
                                startIcon={<MapIcon />}
                            >
                                Ver Mapa
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {report.localizacao?.endereco && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Endereço
                                </Typography>
                                <Typography variant="body1">
                                    {report.localizacao.endereco}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Coordenadas
                            </Typography>
                            <Typography variant="body1">
                                Latitude: {report.localizacao.latitude.toFixed(6)}
                            </Typography>
                            <Typography variant="body1">
                                Longitude: {report.localizacao.longitude.toFixed(6)}
                            </Typography>
                        </Box>

                        {/* Preview do mapa (thumbnail) */}
                        <Box
                            sx={{
                                mt: 2,
                                height: 150,
                                borderRadius: 1,
                                overflow: 'hidden',
                                backgroundImage: `url(${getMapImageUrl(report.localizacao.latitude, report.localizacao.longitude)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.9
                                }
                            }}
                            onClick={() => setMapDialogOpen(true)}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Diálogo do mapa em tela cheia */}
            <Dialog
                open={mapDialogOpen}
                onClose={() => setMapDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Localização da Denúncia
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
                        <img
                            src={getMapImageUrl(report.localizacao.latitude, report.localizacao.longitude)}
                            alt="Mapa da localização"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                            {report.localizacao.endereco || "Localização sem endereço registrado"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Coordenadas: {report.localizacao.latitude.toFixed(6)}, {report.localizacao.longitude.toFixed(6)}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMapDialogOpen(false)}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    );

    // Se for um modal, envolva no componente Dialog
    if (isModal) {
        return (
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Detalhes da Denúncia
                        </Typography>
                        <Chip label={report.protocolo} color="primary" />
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {content}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Fechar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Caso contrário, retorne como uma página
    return (
        <Box sx={{ p: 3 }}>
            {content}
        </Box>
    );
};

export default ReportDetailView;