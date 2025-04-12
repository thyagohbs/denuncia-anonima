import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppBar,
    Box,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { Link as RouterLink } from 'react-router-dom';

const navigation = [
    { title: 'Início', path: '/', icon: <HomeIcon /> },
    { title: 'Fazer Denúncia', path: '/report', icon: <ReportIcon /> },
    { title: 'Consultar Denúncia', path: '/track', icon: <SearchIcon /> },
    { title: 'Privacidade', path: '/privacy', icon: <PrivacyTipIcon /> },
];

export default function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{
            mt: 2,
            width: { xs: '100%', sm: 250 }, // Largura total em dispositivos pequenos
        }}>
            <List>
                {navigation.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={() => isMobile && setMobileOpen(false)}
                            sx={{
                                py: { xs: 1.5, sm: 1 }, // Padding vertical maior em mobile
                                px: { xs: 3, sm: 2 },
                                '&:active': {
                                    bgcolor: 'rgba(0,0,0,0.1)', // Feedback visual em dispositivos touch
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: { xs: 42, sm: 36 } }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                primaryTypographyProps={{
                                    fontSize: { xs: '1rem', sm: '0.875rem' }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'nowrap',
                            minHeight: { xs: '64px', sm: '70px' } // Aumentando altura mínima
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                aria-label="abrir menu"
                                sx={{
                                    mr: 1,
                                    display: { md: 'none' },
                                    padding: '12px', // Aumentando área de toque
                                }}
                            >
                                <MenuIcon sx={{ fontSize: '28px' }} />
                            </IconButton>

                            <Typography
                                variant="h6"
                                noWrap
                                component={RouterLink}
                                to="/"
                                sx={{
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                }}
                            >
                                Denúncia Anônima
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                ml: 'auto',
                                flexShrink: 0
                            }}
                        >
                            {navigation.map((item) => (
                                <ListItemButton
                                    key={item.title}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        borderRadius: 1,
                                        px: { md: 1.5, lg: 2 }
                                    }}
                                >
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
            >
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
                            width: { xs: '85%', sm: 250 },
                            boxShadow: 3
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { xs: '100%', md: `calc(100% - 240px)` },
                    minHeight: '100vh',
                    pt: { xs: 8, sm: 9 },
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        py: { xs: 2, sm: 3, md: 4 },
                        px: { xs: 1, sm: 2, md: 3 }
                    }}
                >
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}