import { Box, Typography, Paper, Button, Alert, Divider, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

interface ReportSuccessProps {
    protocol: string | null;
}

export default function ReportSuccess({ protocol }: ReportSuccessProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyProtocol = () => {
        if (protocol) {
            navigator.clipboard.writeText(protocol).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            });
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <CheckCircleIcon
                color="success"
                sx={{ fontSize: 80, mb: 2 }}
            />

            <Typography variant="h5" gutterBottom>
                Denúncia Recebida com Sucesso
            </Typography>

            <Typography variant="body1" paragraph>
                Sua denúncia foi registrada de forma anônima e será analisada por nossa equipe.
            </Typography>

            {protocol && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mt: 2,
                        mb: 4,
                        backgroundColor: "background.default",
                        width: "100%",
                        maxWidth: 500,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary">
                        Número de protocolo:
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mt: 1
                        }}
                    >
                        <Typography variant="h6" component="span" sx={{ fontFamily: "monospace" }}>
                            {protocol}
                        </Typography>

                        <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopyProtocol}
                            sx={{ ml: 2 }}
                        >
                            Copiar
                        </Button>
                    </Box>

                    {copied && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Protocolo copiado para a área de transferência
                        </Alert>
                    )}
                </Paper>
            )}

            <Alert severity="info" sx={{ mt: 2, mb: 4, width: "100%", maxWidth: 500 }}>
                Guarde seu número de protocolo para consultar o andamento da sua denúncia.
                Por segurança, não enviamos este número por e-mail.
            </Alert>

            <Divider sx={{ width: "100%", mb: 4 }} />

            <Typography variant="subtitle1" gutterBottom>
                O que acontece agora?
            </Typography>

            <Typography variant="body2" paragraph align="left">
                1. Sua denúncia será analisada por nossa equipe especializada em até 48 horas úteis.
                <br />
                2. Se necessário, poderemos solicitar informações adicionais, que serão requisitadas via sistema.
                <br />
                3. Você pode acompanhar o status da denúncia utilizando o protocolo na página de consulta.
            </Typography>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <Button
                    component={RouterLink}
                    to="/track"
                    variant="contained"
                >
                    Consultar Denúncia
                </Button>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                >
                    Voltar à Página Inicial
                </Button>
            </Box>
        </Box>
    );
}