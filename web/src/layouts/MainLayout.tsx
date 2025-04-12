import { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    useTheme,
    Divider,
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Content from '../components/common/Content';

const navigation = [
    { title: 'Início', path: '/', icon: <HomeIcon />, description: 'Página inicial' },
    { title: 'Nova Denúncia', path: '/report', icon: <ReportIcon />, description: 'Fazer uma denúncia anônima' },
    { title: 'Consultar Denúncia', path: '/track', icon: <SearchIcon />, description: 'Acompanhar status da denúncia' },
    { title: 'Privacidade', path: '/privacy', icon: <PrivacyTipIcon />, description: 'Política de privacidade' },
    { title: 'Sobre', path: '/about', icon: <InfoIcon />, description: 'Sobre o sistema' },
];

// Largura do drawer quando aberto
const DRAWER_WIDTH = 250;

export default function MainLayout() {
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Fecha o drawer mobile quando a rota mudar
    useEffect(() => {
        if (isMobile && mobileOpen) {
            setMobileOpen(false);
        }
    }, [location.pathname, isMobile]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleDrawerCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Função para determinar se um item de navegação está ativo
    const isActive = (path: string) => location.pathname === path;

    const drawer = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    padding: theme.spacing(1, 1),
                    ...(!isMobile && {
                        minHeight: 64,
                    }),
                }}
            >
                {!isCollapsed && (
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                            pl: 1,
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        Menu Principal
                    </Typography>
                )}
                {!isMobile && (
                    <IconButton
                        onClick={toggleDrawerCollapse}
                        aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                transform: isCollapsed ? 'rotate(180deg)' : 'none',
                                transition: theme.transitions.create('transform', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.shorter,
                                }),
                            }}
                        />
                    </IconButton>
                )}
            </Box>

            <Divider />

            <List component="nav" sx={{ flexGrow: 1, px: 1, pt: 1 }}>
                {navigation.map((item) => (
                    <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                        <Tooltip
                            title={isCollapsed ? item.title : ""}
                            placement="right"
                            arrow
                            disableHoverListener={!isCollapsed}
                        >
                            <ListItemButton
                                component={RouterLink}
                                to={item.path}
                                selected={isActive(item.path)}
                                onClick={() => isMobile && setMobileOpen(false)}
                                aria-label={`${item.title} - ${item.description}`}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    minHeight: 48,
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'inherit',
                                        },
                                    },
                                    '&:active': {
                                        transform: 'scale(0.98)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: isCollapsed ? 0 : 36,
                                        mr: isCollapsed ? 0 : 2,
                                        fontSize: '1.5rem',
                                        justifyContent: 'center',
                                        color: isActive(item.path) ? 'inherit' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!isCollapsed && (
                                    <ListItemText
                                        primary={item.title}
                                        primaryTypographyProps={{
                                            fontSize: '0.95rem',
                                            fontWeight: isActive(item.path) ? 'medium' : 'normal',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2, display: isCollapsed ? 'none' : 'block' }}>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                    Sistema de Denúncia Anônima
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                    v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    // Calculamos a largura do drawer baseado no estado de colapso
    const effectiveDrawerWidth = isCollapsed ? 72 : DRAWER_WIDTH;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Botão para abrir menu em dispositivos móveis */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 10,
                    left: 10,
                    zIndex: theme.zIndex.drawer + 1,
                    display: { xs: 'block', md: 'none' }
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={mobileOpen}
                    onClick={handleDrawerToggle}
                    sx={{
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        padding: '12px', // Maior área de toque
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            {/* Drawer para mobile (temporário, abre sobre o conteúdo) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Melhor desempenho em dispositivos móveis
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                    },
                    zIndex: theme.zIndex.drawer + 2,
                }}
                aria-label="Menu de navegação"
            >
                {drawer}
            </Drawer>

            {/* Drawer para desktop (permanente, redimensiona a área de conteúdo) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: effectiveDrawerWidth,
                        borderRight: 1,
                        borderColor: 'divider',
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
                open
                aria-label="Menu de navegação"
            >
                {drawer}
            </Drawer>

            {/* Conteúdo principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        xs: '100%',
                        md: `calc(100% - ${effectiveDrawerWidth}px)`
                    },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    p: { xs: 2, sm: 3 },
                    pt: { xs: 2, sm: 3 }, // Reduzi o padding top já que não temos mais a AppBar
                    ml: { xs: 0, md: `${effectiveDrawerWidth}px` },
                    minHeight: '100vh',
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        py: { xs: 2, sm: 3, md: 4 },
                        px: { xs: 1, sm: 2, md: 3 },
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 'calc(100vh - 64px)'
                    }}
                >
                    <Content>
                        <Outlet />
                    </Content>
                </Container>
            </Box>
        </Box>
    );
}