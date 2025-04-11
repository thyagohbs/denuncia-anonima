import { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Paper,
} from '@mui/material';
import ReportTypeForm from '../../components/features/report/ReportTypeForm';
import ReportDetailsForm from '../../components/features/report/ReportDetailsForm';
import ReportLocationForm from '../../components/features/report/ReportLocationForm';
import ReportSubmitForm from '../../components/features/report/ReportSubmitForm';
import ReportSuccess from '../../components/features/report/ReportSuccess';
import useReportStore from '../../store/useReportStore';

const steps = [
    'Tipo de Denúncia',
    'Detalhes',
    'Localização',
    'Envio',
];

export default function ReportPage() {
    const [activeStep, setActiveStep] = useState(0);
    const { currentStep, setCurrentStep } = useReportStore();
    const [protocol, setProtocol] = useState<string | null>(null);

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        setActiveStep(activeStep - 1);
    };

    const handleSubmitSuccess = (protocol: string) => {
        setProtocol(protocol);
        handleNext();
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <ReportTypeForm onNext={handleNext} />;
            case 1:
                return <ReportDetailsForm onNext={handleNext} onBack={handleBack} />;
            case 2:
                return <ReportLocationForm onNext={handleNext} onBack={handleBack} />;
            case 3:
                return (
                    <ReportSubmitForm
                        onBack={handleBack}
                        onSubmitSuccess={handleSubmitSuccess}
                    />
                );
            case 4:
                return <ReportSuccess protocol={protocol} />;
            default:
                return 'Passo desconhecido';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                Denúncia Anônima
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    mt: 4,
                    borderRadius: 2
                }}
            >
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === steps.length ? (
                    <Box sx={{ mt: 2 }}>
                        {getStepContent(activeStep)}
                    </Box>
                ) : (
                    <Box>
                        {getStepContent(activeStep)}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}