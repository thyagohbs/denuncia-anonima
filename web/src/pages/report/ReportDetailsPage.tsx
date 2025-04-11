import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    TextField,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Passos do processo de denúncia
const steps = ['Tipo de Denúncia', 'Localização', 'Detalhes', 'Confirmação'];

export default function ReportDetailsPage() {
    const navigate = useNavigate();
    const [details, setDetails] = useState('');
    const [error, setError] = useState(false);

    // Verificar se temos dados anteriores
    useEffect(() => {
        const reportType = sessionStorage.getItem('reportType');
        const reportLocation = sessionStorage.getItem('reportLocation');

        if (!reportType || !reportLocation) {
            // Se não tiver dados anteriores, voltar para o início
            navigate('/report');
        }

        // Carregar detalhes salvos anteriormente, se houver
        const savedDetails = sessionStorage.getItem('reportDetails');
        if (savedDetails) {
            setDetails(savedDetails);
        }
    }, [navigate]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (details.trim().length < 20) {
            setError(true);
            return;
        }

        // Salvar detalhes e avançar
        sessionStorage.setItem('reportDetails', details);
        navigate('/report/confirmation');
    };

    const handleBack = () => {
        // Salvar detalhes antes de voltar
        sessionStorage.setItem('reportDetails', details);
        navigate('/report/location');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    Registrar Denúncia Anônima
                </Typography>

                <Stepper activeStep={2} alternativeLabel sx={{ mt: 4, mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Detalhes da ocorrência
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        Descreva com o máximo de detalhes possível o que aconteceu. Informações precisas nos ajudam a tomar as medidas adequadas.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="details"
                            label="Detalhes da denúncia"
                            name="details"
                            placeholder="Descreva o que aconteceu, quando, quem estava envolvido e qualquer outra informação relevante."
                            value={details}
                            onChange={(e) => {
                                setDetails(e.target.value);
                                if (e.target.value.trim().length >= 20) {
                                    setError(false);
                                }
                            }}
                            multiline
                            rows={6}
                            error={error}
                            helperText={error ? "Por favor, forneça pelo menos 20 caracteres de detalhes" : ""}
                        />

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                startIcon={<ArrowBackIcon />}
                            >
                                Voltar
                            </Button>

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