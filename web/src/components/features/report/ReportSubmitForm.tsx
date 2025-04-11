import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    FormControlLabel,
    Alert,
    CircularProgress,
} from "@mui/material";
import useReportStore, { ReportType } from "../../../store/useReportStore";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useReportService } from "../../../services/reportService";

interface ReportSubmitFormProps {
    onBack: () => void;
    onSubmitSuccess: (protocol: string) => void;
}

export default function ReportSubmitForm({
    onBack,
    onSubmitSuccess,
}: ReportSubmitFormProps) {
    const { formData, setSubmitting, isSubmitting } = useReportStore();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { submitReport } = useReportService();

    const handleSubmit = async () => {
        if (!termsAccepted) {
            setError("É necessário aceitar os termos para prosseguir");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const result = await submitReport(formData);
            onSubmitSuccess(result.protocol);
        } catch (err) {
            setError("Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getReportTypeLabel = (type: ReportType): string => {
        const labels: Record<ReportType, string> = {
            [ReportType.FURTO]: 'Furto',
            [ReportType.ROUBO]: 'Roubo',
            [ReportType.AGRESSAO]: 'Agressão',
            [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao patrimônio',
            [ReportType.OUTROS]: 'Outros',
        };

        return labels[type];
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <Box>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
                Resumo da Denúncia
            </Typography>

            <Paper
                variant="outlined"
                sx={{ p: { xs: 2, sm: 3 }, mb: 4, backgroundColor: "background.default" }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500 }}
                >
                    Detalhes da Ocorrência
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Tipo:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {getReportTypeLabel(formData.tipo)}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Data:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {formatDate(formData.data)}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">
                            Descrição:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-line',
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word'
                            }}
                            gutterBottom
                        >
                            {formData.detalhes}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary">
                            Local:
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word'
                            }}
                        >
                            {formData.localizacao?.endereco}
                        </Typography>
                    </Grid>

                    {formData.arquivos && formData.arquivos.length > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                                Anexos:
                            </Typography>
                            <List
                                dense
                                sx={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                {formData.arquivos.map((file, index) => (
                                    <ListItem key={index} disableGutters sx={{ px: 2 }}>
                                        <ListItemText
                                            primary={file.name}
                                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                            primaryTypographyProps={{
                                                sx: {
                                                    overflowWrap: 'break-word',
                                                    wordWrap: 'break-word'
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
                Termos e Condições
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    mb: 3,
                    backgroundColor: "background.default"
                }}
            >
                <Typography variant="body2" color="text.secondary" paragraph>
                    Ao enviar esta denúncia, você afirma que:
                </Typography>
                <List dense disablePadding>
                    <ListItem disablePadding>
                        <ListItemText
                            primary="As informações fornecidas são verdadeiras e precisas ao seu conhecimento;"
                            primaryTypographyProps={{
                                sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                            }}
                        />
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText
                            primary="Compreende que falsas denúncias podem ter consequências legais;"
                            primaryTypographyProps={{
                                sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                            }}
                        />
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText
                            primary="Concorda com o processamento anônimo das informações fornecidas."
                            primaryTypographyProps={{
                                sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
                            }}
                        />
                    </ListItem>
                </List>
            </Paper>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        color="primary"
                    />
                }
                label="Li e aceito os termos e condições"
                sx={{ mb: 2 }}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between",
                gap: 2,
                mt: { xs: 2, sm: 4 }
            }}>
                <Button
                    onClick={onBack}
                    variant="outlined"
                    disabled={isSubmitting}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Voltar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !termsAccepted}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Enviar Denúncia"
                    )}
                </Button>
            </Box>
        </Box>
    );
}