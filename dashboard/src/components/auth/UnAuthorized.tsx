import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const UnAuthorized: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 12
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Acesso Negado
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Você não tem permissão para acessar esta página.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            component={Link}
                            to="/dashboard"
                            variant="contained"
                            color="primary"
                            sx={{ px: 4, py: 1 }}
                        >
                            Voltar para o Dashboard
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default UnAuthorized;