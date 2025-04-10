import React, { useState } from 'react';
import { ReportFilters, ReportType } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';

interface FiltersProps {
    onFilter: (filters: ReportFilters) => void;
}

const ReportTypeLabels = {
    [ReportType.FURTO]: 'Furto',
    [ReportType.ROUBO]: 'Roubo',
    [ReportType.AGRESSAO]: 'Agressão',
    [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao Patrimônio',
    [ReportType.OUTROS]: 'Outros'
};

const Filters: React.FC<FiltersProps> = ({ onFilter }) => {
    const [tipo, setTipo] = useState<ReportType | ''>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [location, setLocation] = useState('');

    const handleFilter = () => {
        const filters: ReportFilters = {};

        if (tipo) {
            filters.tipo = tipo as ReportType;
        }

        if (startDate && endDate) {
            filters.startDate = startDate.toISOString();
            filters.endDate = endDate.toISOString();
        }

        if (location) {
            filters.location = location;
        }

        onFilter(filters);
    };

    const handleClearFilters = () => {
        setTipo('');
        setStartDate(null);
        setEndDate(null);
        setLocation('');
        onFilter({});
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Filtros
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="tipo-label">Tipo de Denúncia</InputLabel>
                        <Select
                            labelId="tipo-label"
                            id="tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as ReportType | '')}
                            label="Tipo de Denúncia"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Object.entries(ReportType).map(([_, value]) => (
                                <MenuItem key={value} value={value}>
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
                        value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
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
                        value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        fullWidth
                        id="location"
                        label="Localização"
                        placeholder="Ex: São Paulo"
                        size="small"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClearFilters}
                    startIcon={<ClearIcon />}
                >
                    Limpar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    startIcon={<FilterAltIcon />}
                >
                    Filtrar
                </Button>
            </Box>
        </Paper>
    );
};

export default Filters;