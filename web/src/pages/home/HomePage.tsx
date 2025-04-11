import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    py: { xs: 4, sm: 6, md: 8 },
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography
                    component="h1"
                    variant="h2"
                    color="primary"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: '2rem', sm: '2.75rem', md: '3.75rem' }
                    }}
                >
                    Sistema de Denúncia Anônima
                </Typography>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    paragraph
                    sx={{
                        maxWidth: 'md',
                        mb: 4,
                        px: 2,
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                    }}
                >
                    Faça sua denúncia de forma segura, sigilosa e anônima.
                    Ajude a combater irregularidades em sua comunidade.
                </Typography>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ px: 2 }}
                >
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                        <Button
                            component={RouterLink}
                            to="/report"
                            variant="contained"
                            size="large"
                            startIcon={<ReportIcon />}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Fazer Denúncia
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12 }} sm="auto">
                        <Button
                            component={RouterLink}
                            to="/track"
                            variant="outlined"
                            size="large"
                            startIcon={<SearchIcon />}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Consultar Denúncia
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Feature Section */}
            <Box sx={{ py: { xs: 4, sm: 6 } }}>
                <Container sx={{ py: { xs: 2, sm: 4 } }}>
                    <Grid container spacing={{ xs: 3, md: 4 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <SecurityIcon color="primary" sx={{ fontSize: { xs: 40, sm: 60 }, mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                >
                                    Segurança
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Suas informações são protegidas por criptografia avançada
                                    e armazenadas de forma segura.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <VisibilityOffIcon color="primary" sx={{ fontSize: { xs: 40, sm: 60 }, mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                >
                                    Anonimato
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Garantimos seu anonimato durante todo o processo.
                                    Não coletamos dados pessoais ou de identificação.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <EmojiPeopleIcon color="primary" sx={{ fontSize: { xs: 40, sm: 60 }, mb: 2 }} />
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                >
                                    Facilidade
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Interface simples e intuitiva para realizar denúncias
                                    em poucos passos, sem burocracia.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    py: { xs: 4, sm: 6 },
                    borderRadius: { xs: 2, sm: 4 },
                    mt: { xs: 2, sm: 4 },
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
                    >
                        Sua denúncia faz a diferença
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                        Denunciar é um ato de cidadania. Toda denúncia é importante para
                        construirmos uma sociedade mais justa.
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/report"
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'grey.100',
                            },
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Denuncie Agora
                    </Button>
                </Container>
            </Box>
        </>
    );
}