import React, { useState, useEffect } from 'react';
import Filters from './FiltersTable';
import ReportsTable from './ReportsTable.';
import reportsService from '../../services/reports.service';
import { Report, ReportFilters } from '../../types';
import {
    Container,
    Typography,
    Paper,
    Box,
    Alert,
    AlertTitle,
    Divider
} from '@mui/material';

const Dashboard: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = async (filterParams: ReportFilters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const data = await reportsService.getAllReports(filterParams);
            setReports(data);
        } catch (err) {
            console.error('Erro ao carregar denúncias:', err);
            setError('Falha ao carregar as denúncias. Por favor, tente novamente.');
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleFilter = (newFilters: ReportFilters) => {
        fetchReports(newFilters);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
                    Dashboard de Denúncias
                </Typography>
            </Box>

            <Filters onFilter={handleFilter} />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Erro</AlertTitle>
                    {error}
                </Alert>
            )}

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" color="text.primary">
                        Denúncias Registradas
                    </Typography>
                </Box>
                <Box>
                    <ReportsTable reports={reports} loading={loading} />
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;