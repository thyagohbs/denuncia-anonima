import React, { useState } from 'react';
import { Report, ReportType } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    Divider,
    CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ReportsTableProps {
    reports: Report[];
    loading: boolean;
}

const ReportTypeLabels: Record<ReportType, string> = {
    [ReportType.FURTO]: 'Furto',
    [ReportType.ROUBO]: 'Roubo',
    [ReportType.AGRESSAO]: 'Agressão',
    [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao Patrimônio',
    [ReportType.OUTROS]: 'Outros'
};

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, loading }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (reports.length === 0) {
        return (
            <Box p={3} textAlign="center">
                <Typography variant="body1" color="text.secondary">
                    Nenhuma denúncia encontrada
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Protocolo</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Endereço</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((report) => (
                                <TableRow key={report.protocolo}>
                                    <TableCell component="th" scope="row">
                                        {report.protocolo}
                                    </TableCell>
                                    <TableCell>
                                        {ReportTypeLabels[report.tipo] || report.tipo}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(report.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
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

            {/* Diálogo de Detalhes */}
            <Dialog
                open={detailsOpen}
                onClose={handleCloseDetails}
                maxWidth="sm"
                fullWidth
            >
                {selectedReport && (
                    <>
                        <DialogTitle>
                            Detalhes da Denúncia - {selectedReport.protocolo}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Tipo
                                </Typography>
                                <Typography variant="body1">
                                    {ReportTypeLabels[selectedReport.tipo]}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Data
                                </Typography>
                                <Typography variant="body1">
                                    {format(new Date(selectedReport.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Localização
                                </Typography>
                                <Typography variant="body1">
                                    {selectedReport.localizacao?.endereco ||
                                        `Latitude: ${selectedReport.localizacao?.latitude}, Longitude: ${selectedReport.localizacao?.longitude}`}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Detalhes
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 2, mt: 1, bgcolor: 'background.default', whiteSpace: 'pre-line' }}
                                >
                                    <Typography variant="body2">
                                        {selectedReport.detalhes}
                                    </Typography>
                                </Paper>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails} color="primary">
                                Fechar
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ReportsTable;