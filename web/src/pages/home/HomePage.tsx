import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Card, CardContent,
    CardActionArea, Divider, AppBar, Toolbar, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Novos ícones mais apropriados
import NoAccountsIcon from '@mui/icons-material/NoAccounts'; // Assédio sexual
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'; // Assédio moral
import WomanIcon from '@mui/icons-material/Woman'; // Discriminação de gênero
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'; // Violência verbal
import GavelIcon from '@mui/icons-material/Gavel'; // Abuso de autoridade
import { ReportType } from '../../store/useReportStore';
import useReportStore from '../../store/useReportStore';

export default function HomePage() {
    const navigate = useNavigate();
    const { updateFormData } = useReportStore();
    const [selected, setSelected] = useState<string | null>(null);

    const handleBackClick = () => {
        navigate('/start');
    };

    const handleTypeSelect = (type: ReportType) => {
        setSelected(type);
        updateFormData({ tipo: type });

        // Simular um breve atraso para feedback visual
        setTimeout(() => {
            navigate('/local');
        }, 150);
    };

    const denunciaTypes = [
        {
            type: ReportType.ASSEDIO_SEXUAL,
            label: 'Assédio Sexual',
            description: 'Insinuações, toques não consentidos ou propostas de natureza sexual',
            icon: <NoAccountsIcon sx={{ fontSize: 40 }} />
        },
        {
            type: ReportType.ASSEDIO_MORAL,
            label: 'Assédio Moral',
            description: 'Humilhação, intimidação ou exclusão sistemática no ambiente de trabalho',
            icon: <SentimentVeryDissatisfiedIcon sx={{ fontSize: 40 }} />
        },
        {
            type: ReportType.DISCRIMINACAO_GENERO,
            label: 'Discriminação de Gênero',
            description: 'Tratamento diferenciado negativo baseado em gênero',
            icon: <WomanIcon sx={{ fontSize: 40 }} />
        },
        {
            type: ReportType.VIOLENCIA_VERBAL,
            label: 'Violência Verbal',
            description: 'Ameaças, xingamentos ou comunicação ofensiva',
            icon: <RecordVoiceOverIcon sx={{ fontSize: 40 }} />
        },
        {
            type: ReportType.ABUSO_AUTORIDADE,
            label: 'Abuso de Autoridade',
            description: 'Uso indevido de poder hierárquico ou funcional',
            icon: <GavelIcon sx={{ fontSize: 40 }} />
        }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleBackClick}
                        aria-label="voltar"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Denúncia Anônima
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Selecione o tipo de denúncia
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                    {denunciaTypes.map((item) => (
                        <Grid size={{ xs: 12 }} key={item.type}>
                            <Card
                                elevation={selected === item.type ? 3 : 1}
                                sx={{
                                    borderLeft: selected === item.type ? '4px solid #1976d2' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <CardActionArea onClick={() => handleTypeSelect(item.type)}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <Box sx={{ color: 'primary.main', mr: 2 }}>{item.icon}</Box>
                                        <Box>
                                            <Typography variant="h6" component="h2">{item.label}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}