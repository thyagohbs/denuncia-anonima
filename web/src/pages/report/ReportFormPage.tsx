import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    MenuItem,
    Button,
    Paper,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Tipos de denúncias disponíveis
const reportTypes = [
    { value: 'furto', label: 'Furto' },
    { value: 'roubo', label: 'Roubo' },
    { value: 'agressao', label: 'Agressão' },
    { value: 'dano_ao_patrimonio', label: 'Dano ao Patrimônio' },
    { value: 'outros', label: 'Outros' }
];

// Passos do processo de denúncia
const steps = ['Tipo de Denúncia', 'Localização', 'Detalhes', 'Confirmação'];

export default function ReportFormPage() {
    const navigate = useNavigate();
    const [reportType, setReportType] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!reportType) {
            setError(true);
            return;
        }

        // Armazenar o tipo no sessionStorage para manter durante o fluxo
        sessionStorage.setItem('reportType', reportType);

        // Navegar para o próximo passo
        navigate('/report/location');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    Registrar Denúncia Anônima
                </Typography>

                <Stepper activeStep={0} alternativeLabel sx={{ mt: 4, mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Qual o tipo de denúncia você deseja registrar?
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        Selecione a categoria que melhor descreve a situação. Isto nos ajudará a direcionar sua denúncia adequadamente.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <FormControl fullWidth required error={error} sx={{ mb: 3 }}>
                            <InputLabel id="report-type-label">Tipo de Denúncia</InputLabel>
                            <Select
                                labelId="report-type-label"
                                id="report-type"
                                value={reportType}
                                label="Tipo de Denúncia"
                                onChange={(e) => {
                                    setReportType(e.target.value);
                                    setError(false);
                                }}
                            >
                                {reportTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && <FormHelperText>Por favor, selecione um tipo de denúncia</FormHelperText>}
                        </FormControl>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
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