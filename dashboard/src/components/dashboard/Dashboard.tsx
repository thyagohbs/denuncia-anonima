import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Button,
    CircularProgress,
    Alert,
    AlertTitle,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { SortDirection } from '@mui/material/TableCell';
import type { SelectChangeEvent } from '@mui/material/Select';

import { ReportType, ReportFilters } from '../../types';
import { commonStyles } from '../../styles/commonStyles';
import reportsService from '../../services/reports.service';
import ReportDetailView from './ReportDetailView';

// Interface para os relatórios
interface Report {
    protocolo: string;
    tipo: ReportType;
    criadoEm: string;
    localizacao?: {
        endereco?: string;
        latitude: number;
        longitude: number;
    };
    detalhes: string;
}

// Mapeamento de tipos para exibição
const ReportTypeLabels: Record<ReportType, string> = {
    [ReportType.FURTO]: 'Furto',
    [ReportType.ROUBO]: 'Roubo',
    [ReportType.AGRESSAO]: 'Agressão',
    [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao Patrimônio',
    [ReportType.OUTROS]: 'Outros'
};

// Cores para badges de tipo
const typeColors: Record<ReportType, 'info' | 'error' | 'warning' | 'secondary' | 'default'> = {
    [ReportType.FURTO]: 'info',
    [ReportType.ROUBO]: 'error',
    [ReportType.AGRESSAO]: 'warning',
    [ReportType.DANO_AO_PATRIMONIO]: 'secondary',
    [ReportType.OUTROS]: 'default'
};

// Função para formatar data
const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

// Interface para as propriedades de cabeçalho de tabela
interface SortableTableHeaderProps {
    id: string;
    label: string;
}

const Dashboard = () => {
    // Estados para paginação e ordenação
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState<string>('criadoEm');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    // Estado para filtros
    const [filters, setFilters] = useState<{
        tipo: string;
        startDate: string;
        endDate: string;
        location: string;
    }>({
        tipo: '',
        startDate: '',
        endDate: '',
        location: ''
    });

    // Estado para modal de detalhes
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Buscar dados com React Query
    const {
        data: reports = [] as Report[],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<Report[], Error>({
        queryKey: ['reports', filters],
        queryFn: () => {
            // Converter para o formato correto de ReportFilters
            const apiFilters: ReportFilters = {};

            if (filters.tipo && Object.values(ReportType).includes(filters.tipo as ReportType)) {
                apiFilters.tipo = filters.tipo as ReportType;
            }

            if (filters.startDate) {
                apiFilters.startDate = filters.startDate;
            }

            if (filters.endDate) {
                apiFilters.endDate = filters.endDate;
            }

            if (filters.location) {
                apiFilters.location = filters.location;
            }

            return reportsService.getAllReports(apiFilters);
        },
        staleTime: 60000, // 1 minuto
        refetchOnWindowFocus: true
    });

    // Ordenar e filtrar os dados
    const sortedReports = useMemo(() => {
        // Cria uma cópia para não mutar o original
        const sortableReports = [...reports];

        return sortableReports.sort((a, b) => {
            // Ordenação por diferentes colunas
            if (orderBy === 'criadoEm') {
                const dateA = new Date(a.criadoEm);
                const dateB = new Date(b.criadoEm);
                return order === 'asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }

            if (orderBy === 'tipo') {
                return order === 'asc'
                    ? a.tipo.localeCompare(b.tipo)
                    : b.tipo.localeCompare(a.tipo);
            }

            if (orderBy === 'protocolo') {
                return order === 'asc'
                    ? a.protocolo.localeCompare(b.protocolo)
                    : b.protocolo.localeCompare(a.protocolo);
            }

            if (orderBy === 'localizacao') {
                const endA = a.localizacao?.endereco || '';
                const endB = b.localizacao?.endereco || '';
                return order === 'asc'
                    ? endA.localeCompare(endB)
                    : endB.localeCompare(endA);
            }

            return 0;
        });
    }, [reports, orderBy, order]);

    // Paginar os dados
    const paginatedReports = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedReports.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedReports, page, rowsPerPage]);

    // Handlers
    const handleRequestSort = (property: string): void => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (field: string, value: string): void => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = (): void => {
        refetch();
        setPage(0);
    };

    const handleClearFilters = (): void => {
        setFilters({
            tipo: '',
            startDate: '',
            endDate: '',
            location: ''
        });
        refetch();
    };

    const handleViewDetails = (report: Report): void => {
        setSelectedReport(report);
        setDetailsOpen(true);
    };

    const handleCloseDetails = (): void => {
        setDetailsOpen(false);
    };

    // Cabeçalho de tabela ordenável
    const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({ id, label }) => (
        <TableCell
            sortDirection={orderBy === id ? order : false}
            sx={{ fontWeight: 'bold' }}
        >
            <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'asc'}
                onClick={() => handleRequestSort(id)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

    return (
        <Container maxWidth="lg" sx={commonStyles.pageContainer}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    Dashboard de Denúncias
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Gerencie e visualize todas as denúncias registradas
                </Typography>
            </Box>

            {/* Seção de Filtros */}
            <Paper elevation={2} sx={{ ...commonStyles.paper, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Filtros
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth variant="outlined" size="small" sx={commonStyles.formControl}>
                            <InputLabel id="tipo-label">Tipo de Denúncia</InputLabel>
                            <Select
                                labelId="tipo-label"
                                id="tipo"
                                value={filters.tipo}
                                onChange={(e: SelectChangeEvent) => handleFilterChange('tipo', e.target.value)}
                                label="Tipo de Denúncia"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {Object.entries(ReportType).map(([key, value]) => (
                                    <MenuItem key={key} value={value}>
                                        {ReportTypeLabels[value as ReportType]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            id="startDate"
                            label="Data Inicial"
                            type="date"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            sx={commonStyles.formControl}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            id="endDate"
                            label="Data Final"
                            type="date"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            sx={commonStyles.formControl}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            id="location"
                            label="Localização"
                            placeholder="Ex: São Paulo"
                            size="small"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            sx={commonStyles.formControl}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClearFilters}
                        startIcon={<ClearIcon />}
                        disabled={isLoading}
                    >
                        Limpar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyFilters}
                        startIcon={<FilterAltIcon />}
                        disabled={isLoading}
                    >
                        Filtrar
                    </Button>
                    <IconButton
                        color="primary"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        title="Atualizar dados"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Exibe erros, se existirem */}
            {isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Erro</AlertTitle>
                    {error?.message || 'Não foi possível carregar os dados. Tente novamente.'}
                </Alert>
            )}

            {/* Tabela de Denúncias */}
            <Paper elevation={2} sx={{ ...commonStyles.paper, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.primary">
                        Denúncias Registradas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total: {reports.length}
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress />
                    </Box>
                ) : reports.length === 0 ? (
                    <Box p={3} textAlign="center">
                        <Typography variant="body1" color="text.secondary">
                            Nenhuma denúncia encontrada
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <SortableTableHeader id="protocolo" label="Protocolo" />
                                        <SortableTableHeader id="tipo" label="Tipo" />
                                        <SortableTableHeader id="criadoEm" label="Data" />
                                        <SortableTableHeader id="localizacao" label="Endereço" />
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedReports.map((report) => (
                                        <TableRow key={report.protocolo} hover>
                                            <TableCell component="th" scope="row">
                                                {report.protocolo}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ReportTypeLabels[report.tipo] || report.tipo}
                                                    color={typeColors[report.tipo]}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(report.criadoEm)}
                                            </TableCell>
                                            <TableCell>
                                                {report.localizacao?.endereco ||
                                                    `Lat: ${report.localizacao?.latitude.toFixed(4)}, Long: ${report.localizacao?.longitude.toFixed(4)}`}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleViewDetails(report)}
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    Detalhes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Paginação */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={reports.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Itens por página"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        />
                    </>
                )}
            </Paper>

            {/* Modal de Detalhes da Denúncia */}
            {selectedReport && (
                <ReportDetailView
                    reportId={selectedReport.protocolo} // Use o protocolo como ID
                    isOpen={detailsOpen}
                    onClose={handleCloseDetails}
                    isModal={true}
                />
            )}
        </Container >
    );
};

export default Dashboard;