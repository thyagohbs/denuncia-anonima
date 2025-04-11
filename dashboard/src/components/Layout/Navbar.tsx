import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Divider,
    Avatar,
    Tooltip,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
    drawerOpen: boolean;
    toggleDrawer: () => void;
    drawerWidth: number;
}

const Navbar: React.FC<NavbarProps> = ({ drawerOpen, toggleDrawer, drawerWidth }) => {
    const { currentUser, logout } = useAuth();
    const { mode, toggleColorMode } = useThemeContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                boxShadow: 1,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="abrir menu"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Sistema de Denúncias
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`Mudar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Perfil">
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            edge="end"
                            aria-label="perfil do usuário"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                                {currentUser?.email?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 200,
                        '& .MuiMenuItem-root': {
                            py: 1
                        }
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disabled sx={{ opacity: 0.8 }}>
                    <Typography variant="body2" noWrap>
                        {currentUser?.email}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 2, fontSize: "1.25rem" }} />
                    Sair
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;