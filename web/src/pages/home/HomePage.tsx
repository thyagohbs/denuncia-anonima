import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import HeroCarousel from '../../components/home/HeroCarousel';

export default function HomePage() {
    return (
        <>
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* CTA Section */}
            <Box sx={{ py: { xs: 4, sm: 6 } }}>
                <Container>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Button
                                component={RouterLink}
                                to="/report"
                                startIcon={<ReportIcon />}
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    }
                                }}
                            >
                                Fazer Denúncia
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Button
                                component={RouterLink}
                                to="/track"
                                startIcon={<SearchIcon />}
                                variant="outlined"
                                fullWidth
                                size="large"
                                sx={{ py: 1.5 }}
                            >
                                Consultar Denúncia
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Feature Section */}
            <Box sx={{ py: { xs: 4, sm: 6 } }}>
                <Container sx={{ py: { xs: 2, sm: 4 } }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            fontSize: { xs: '1.75rem', sm: '2.25rem' }
                        }}
                    >
                        Por que escolher nossa plataforma?
                    </Typography>

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
                                    component="h3"
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
                                    component="h3"
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
                                    component="h3"
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
                    mx: { xs: 2, sm: 4 },
                    my: { xs: 3, sm: 5 },
                    textAlign: 'center'
                }}
            >
                <Container>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            mb: 3,
                            fontSize: { xs: '1.75rem', sm: '2.25rem' }
                        }}
                    >
                        Pronta para fazer uma denúncia?
                    </Typography>

                    <Typography
                        variant="body1"
                        paragraph
                        sx={{ mb: 4, maxWidth: 'md', mx: 'auto' }}
                    >
                        Nossa plataforma é totalmente anônima e segura. Denuncie casos
                        de assédio, discriminação ou violência e ajude a construir um ambiente
                        mais seguro para todas.
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/report"
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: 'white',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'grey.100',
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