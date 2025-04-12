import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Button, Container, Paper, Avatar, Rating } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import { Global, css } from '@emotion/react';

// Importações do Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Componente principal do carousel
export default function HeroCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);

    // Dados dos testemunhos
    const testimonials = [
        {
            id: 1,
            name: "Ana M.",
            role: "Policial Militar",
            quote: "Me senti segura para denunciar uma situação de assédio sem medo de retaliações. O processo foi simples e discreto.",
            avatar: "A",
            rating: 5
        },
        {
            id: 2,
            name: "Carla S.",
            role: "Bombeira",
            quote: "A plataforma me permitiu compartilhar minha experiência e receber apoio sem expor minha identidade.",
            avatar: "C",
            rating: 5
        },
        {
            id: 3,
            name: "Teresa R.",
            role: "Guarda Civil",
            quote: "O anonimato realmente funciona. Consegui relatar um caso de discriminação com tranquilidade.",
            avatar: "T",
            rating: 4
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                height: { xs: '90vh', md: '80vh' },
                minHeight: { xs: 500, md: 600 },
            }}
        >
            {/* Seta de navegação anterior */}
            <Box
                ref={navigationPrevRef}
                aria-label="Slide anterior"
                role="button"
                tabIndex={0}
                sx={{
                    position: 'absolute',
                    left: { xs: '5px', md: '40px' },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    width: { xs: 48, md: 50 }, // Aumentando área de toque mínima para 48px
                    height: { xs: 48, md: 50 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                    },
                    // Melhorar acessibilidade em dispositivos touch
                    '&:active': {
                        transform: 'translateY(-50%) scale(0.95)',
                    }
                }}
            >
                <ArrowBackIosNewIcon fontSize="small" />
            </Box>

            {/* Seta de navegação próxima */}
            <Box
                ref={navigationNextRef}
                aria-label="Próximo slide"
                role="button"
                tabIndex={0}
                sx={{
                    position: 'absolute',
                    right: { xs: '10px', md: '40px' },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    borderRadius: '50%',
                    width: { xs: 40, md: 50 },
                    height: { xs: 40, md: 50 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                    }
                }}
            >
                <ArrowForwardIosIcon fontSize="small" />
            </Box>

            {/* Carrossel Swiper */}
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}" role="button" aria-label="Ir para slide ${index + 1}"></span>`;
                    }
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={true}
                onInit={(swiper) => {
                    // @ts-ignore
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    // @ts-ignore
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                style={{ height: '100%' }}
                a11y={{
                    prevSlideMessage: 'Slide anterior',
                    nextSlideMessage: 'Próximo slide',
                    firstSlideMessage: 'Este é o primeiro slide',
                    lastSlideMessage: 'Este é o último slide',
                    paginationBulletMessage: 'Ir para o slide {{index}}',
                }}
            >
                {/* Slide 1: Hero principal */}
                <SwiperSlide>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            background: `linear-gradient(135deg, rgba(25,118,210,0.95) 0%, rgba(21,101,192,0.85) 100%)`,
                            color: 'white',
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <AnimatePresence>
                            <Container maxWidth="lg">
                                <motion.div
                                    key="slide1"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: { md: '70%' } }}>
                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="overline"
                                                component="h2"
                                                sx={{
                                                    letterSpacing: 3,
                                                    opacity: 0.9,
                                                    mb: 1,
                                                    fontSize: { xs: '0.85rem', md: '1rem' }
                                                }}
                                            >
                                                PROTEGENDO PROFISSIONAIS
                                            </Typography>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="h2"
                                                component="h1"
                                                fontWeight="bold"
                                                sx={{
                                                    mb: 2,
                                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                                    textShadow: '0px 2px 4px rgba(0,0,0,0.15)'
                                                }}
                                            >
                                                Denúncia Segura
                                            </Typography>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    mb: 4,
                                                    fontWeight: 300,
                                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                                }}
                                            >
                                                Proteção para mulheres da segurança pública com absoluto anonimato
                                            </Typography>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Button
                                                component={RouterLink}
                                                to="/report"
                                                variant="contained"
                                                color="secondary"
                                                size="large"
                                                sx={{
                                                    px: { xs: 3, md: 5 },
                                                    py: { xs: 1.5, md: 2 },
                                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                                    fontWeight: 600,
                                                    boxShadow: 4,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 6
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                                aria-label="Iniciar processo de denúncia anônima"
                                            >
                                                Iniciar Denúncia
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </motion.div>
                            </Container>
                        </AnimatePresence>
                    </Box>
                </SwiperSlide>

                {/* Slide 2: Explicação do projeto */}
                <SwiperSlide>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.9) 100%)`,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <AnimatePresence>
                            <Container maxWidth="lg">
                                <motion.div
                                    key="slide2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="h3"
                                                component="h2"
                                                color="primary"
                                                fontWeight="bold"
                                                sx={{ mb: 2 }}
                                            >
                                                Como Funciona
                                            </Typography>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="subtitle1"
                                                color="text.secondary"
                                                sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
                                            >
                                                Nosso sistema oferece proteção completa para mulheres que precisam denunciar situações
                                                de assédio, discriminação e violência em ambientes da segurança pública.
                                            </Typography>
                                        </motion.div>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 }, justifyContent: 'center' }}>
                                        {/* Característica 1 */}
                                        <motion.div variants={itemVariants} style={{ flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    borderRadius: 3,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        bgcolor: 'primary.light',
                                                        color: 'primary.contrastText',
                                                        p: 2,
                                                        borderRadius: '50%',
                                                        mb: 2
                                                    }}
                                                >
                                                    <VisibilityOffIcon fontSize="large" />
                                                </Box>
                                                <Typography variant="h6" gutterBottom>Anonimato Total</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Sua identidade permanece completamente protegida. Não armazenamos dados que possam identificá-la.
                                                </Typography>
                                            </Paper>
                                        </motion.div>

                                        {/* Característica 2 */}
                                        <motion.div variants={itemVariants} style={{ flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    borderRadius: 3,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        bgcolor: 'primary.light',
                                                        color: 'primary.contrastText',
                                                        p: 2,
                                                        borderRadius: '50%',
                                                        mb: 2
                                                    }}
                                                >
                                                    <SecurityIcon fontSize="large" />
                                                </Box>
                                                <Typography variant="h6" gutterBottom>Segurança Avançada</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Utilizamos criptografia de ponta para proteger todas as informações e comunicações.
                                                </Typography>
                                            </Paper>
                                        </motion.div>

                                        {/* Característica 3 */}
                                        <motion.div variants={itemVariants} style={{ flex: '1', minWidth: '250px', maxWidth: '300px' }}>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    borderRadius: 3,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        bgcolor: 'primary.light',
                                                        color: 'primary.contrastText',
                                                        p: 2,
                                                        borderRadius: '50%',
                                                        mb: 2
                                                    }}
                                                >
                                                    <SupportAgentIcon fontSize="large" />
                                                </Box>
                                                <Typography variant="h6" gutterBottom>Suporte 24h</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Acompanhamento contínuo do seu caso e suporte especializado disponível a qualquer hora.
                                                </Typography>
                                            </Paper>
                                        </motion.div>
                                    </Box>
                                </motion.div>
                            </Container>
                        </AnimatePresence>
                    </Box>
                </SwiperSlide>

                {/* Slide 3: Depoimentos */}
                <SwiperSlide>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            background: `linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(21,101,192,0.1) 100%)`,
                            px: { xs: 2, md: 4 }
                        }}
                    >
                        <AnimatePresence>
                            <Container maxWidth="lg">
                                <motion.div
                                    key="slide3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="h3"
                                                component="h2"
                                                color="primary"
                                                fontWeight="bold"
                                                sx={{ mb: 2 }}
                                            >
                                                Depoimentos
                                            </Typography>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Typography
                                                variant="subtitle1"
                                                color="text.secondary"
                                                sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
                                            >
                                                Relatos de mulheres que utilizaram o sistema e conseguiram
                                                denunciar com segurança e anonimato.
                                            </Typography>
                                        </motion.div>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        gap: 3,
                                        justifyContent: 'center',
                                        alignItems: 'stretch'
                                    }}>
                                        {testimonials.map((testimony) => (
                                            <Box
                                                sx={{
                                                    flex: '1',
                                                    display: 'flex',
                                                    minWidth: { xs: '100%', md: '30%' }
                                                }}
                                            >
                                                <motion.div
                                                    key={testimony.id}
                                                    variants={itemVariants}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Paper
                                                        elevation={2}
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 3,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    color: 'primary.contrastText',
                                                                    mr: 2
                                                                }}
                                                                aria-label={`Avatar de ${testimony.name}`}
                                                            >
                                                                {testimony.avatar}
                                                            </Avatar>
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {testimony.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {testimony.role}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Rating
                                                            value={testimony.rating}
                                                            readOnly
                                                            size="small"
                                                            sx={{ mb: 2 }}
                                                            aria-label={`Avaliação: ${testimony.rating} de 5 estrelas`}
                                                        />

                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontStyle: 'italic',
                                                                mb: 2,
                                                                flexGrow: 1
                                                            }}
                                                        >
                                                            "{testimony.quote}"
                                                        </Typography>
                                                    </Paper>
                                                </motion.div>
                                            </Box>
                                        ))}
                                    </Box>
                                </motion.div>
                            </Container>
                        </AnimatePresence>
                    </Box>
                </SwiperSlide>
            </Swiper>

            <Global
                styles={css`
                    .swiper-pagination {
                        bottom: 30px !important;
                    }
                    .swiper-pagination-bullet {
                        width: 12px;
                        height: 12px;
                        background: rgba(255, 255, 255, 0.7);
                        opacity: 0.7;
                        transition: all 0.3s ease;
                    }
                    .swiper-pagination-bullet-active {
                        background: #fff;
                        opacity: 1;
                        transform: scale(1.2);
                    }
                    @media (max-width: 600px) {
                        .swiper-pagination {
                            bottom: 15px !important;
                        }
                        .swiper-pagination-bullet {
                            width: 8px;
                            height: 8px;
                        }
                    }
                `}
            />
        </Box>
    );
}