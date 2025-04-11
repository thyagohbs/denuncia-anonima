import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    useTheme,
    Tooltip
} from '@mui/material';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();

    // Menu items
    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/admin',
            requiredRole: null
        },
        {
            text: 'Denúncias',
            icon: <ReportIcon />,
            path: '/admin/reports',
            requiredRole: null
        },
        {
            text: 'Configurações',
            icon: <SettingsIcon />,
            path: '/admin/settings',
            requiredRole: 'admin'
        }
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        if (window.innerWidth < 600) {
            toggleDrawer(); // Em dispositivos móveis, fecha o drawer após navegação
        }
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    border: 'none',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden'
                },
            }}
            variant="permanent"
            anchor="left"
            open={open}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                p: 1
            }}>
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => {
                    // Se o item requer um papel específico e o usuário não o tem, não renderize
                    if (item.requiredRole && !isAdmin) return null;

                    return (
                        <ListItem
                            key={item.text}
                            disablePadding
                            sx={{ display: 'block' }}
                        >
                            {open ? (
                                <ListItemButton
                                    onClick={() => handleNavigate(item.path)}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        borderRadius: '0 24px 24px 0',
                                        marginRight: 2,
                                        '&.Mui-selected': {
                                            backgroundColor: `${theme.palette.primary.main}20`
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 'auto',
                                            justifyContent: 'center',
                                            color: location.pathname === item.path ? theme.palette.primary.main : undefined
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ opacity: open ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            ) : (
                                <Tooltip title={item.text} placement="right" arrow>
                                    <ListItemButton
                                        onClick={() => handleNavigate(item.path)}
                                        selected={location.pathname === item.path}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: 'center',
                                            px: 2.5,
                                            borderRadius: '0 24px 24px 0',
                                            marginRight: 2,
                                            '&.Mui-selected': {
                                                backgroundColor: `${theme.palette.primary.main}20`
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                justifyContent: 'center',
                                                color: location.pathname === item.path ? theme.palette.primary.main : undefined
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </Tooltip>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;