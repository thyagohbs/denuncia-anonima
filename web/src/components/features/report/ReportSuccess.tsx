import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

interface ReportSuccessProps {
    protocol: string | null;
}

export default function ReportSuccess({ protocol }: ReportSuccessProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(protocol);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
            <CheckCircleIcon
                color="success"
                sx={{ fontSize: { xs: 60, sm: 80 }, mb: 2 }}
            />

            <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }}
            >
                Denúncia Enviada com Sucesso!
            </Typography>

            <Alert
                severity="success"
                sx={{
                    mb: 3,
                    mx: 'auto',
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    <Typography component="span" variant="body1">
                        <strong>Protocolo:</strong> {protocol}
                    </Typography>
                    <Button
                        startIcon={<ContentCopyIcon />}
                        size="small"
                        onClick={handleCopyClick}
                        sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
                    >
                        {copied ? "Copiado!" : "Copiar"}
                    </Button>
                </Box>
            </Alert>

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    textAlign: 'left',
                    borderRadius: 2
                }}
            >
                <Typography variant="body1" paragraph>
                    <strong>Importante:</strong>
                </Typography>
                <Typography
                    variant="body2"
                    component="div"
                    sx={{ mb: 2 }}
                >
                    1. Anote o número de protocolo para acompanhar sua denúncia.
                    <br />
                    2. Este é o único momento em que você verá este número.
                    <br />
                    3. Você pode acompanhar o status da denúncia utilizando o protocolo na página de consulta.
                </Typography>
            </Paper>

            <Box sx={{
                mt: 4,
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center'
            }}>
                <Button
                    component={RouterLink}
                    to="/track"
                    variant="contained"
                    fullWidth={false}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Consultar Denúncia
                </Button>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                    fullWidth={false}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Voltar à Página Inicial
                </Button>
            </Box>
        </Box>
    );
}