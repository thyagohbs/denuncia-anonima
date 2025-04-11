import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useThemeContext } from '../../contexts/ThemeContext';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const AdminLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* Navbar na parte superior */}
            <Navbar
                drawerOpen={drawerOpen}
                toggleDrawer={handleToggleDrawer}
                drawerWidth={drawerOpen ? drawerWidth : collapsedDrawerWidth}
            />

            {/* Sidebar na lateral */}
            <Sidebar open={drawerOpen} toggleDrawer={handleToggleDrawer} />

            {/* Conteúdo principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : collapsedDrawerWidth}px)` },
                    ml: { sm: `${drawerOpen ? drawerWidth : collapsedDrawerWidth}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Espaço para evitar que o conteúdo fique sob a Navbar */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;