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
                    py: 8,
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
                    sx={{ fontWeight: 700, mb: 3 }}
                >
                    Sistema de Denúncia Anônima
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 'md', mb: 4 }}>
                    Faça sua denúncia de forma segura, sigilosa e anônima.
                    Ajude a combater irregularidades em sua comunidade.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button
                            component={RouterLink}
                            to="/report"
                            variant="contained"
                            size="large"
                            startIcon={<ReportIcon />}
                        >
                            Fazer Denúncia
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            component={RouterLink}
                            to="/track"
                            variant="outlined"
                            size="large"
                            startIcon={<SearchIcon />}
                        >
                            Consultar Denúncia
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Feature Section */}
            <Box sx={{ py: 6 }}>
                <Container sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <SecurityIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Segurança
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Suas informações são protegidas por criptografia avançada
                                    e armazenadas de forma segura.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <VisibilityOffIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Anonimato
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Garantimos seu anonimato durante todo o processo.
                                    Não coletamos dados pessoais ou de identificação.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 4,
                                }}
                            >
                                <EmojiPeopleIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="h5" component="h2" gutterBottom>
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
                    py: 6,
                    borderRadius: 4,
                    mt: 4,
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h2" gutterBottom>
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
                        }}
                    >
                        Denuncie Agora
                    </Button>
                </Container>
            </Box>
        </>
    );
}