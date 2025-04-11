import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFoundPage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 8, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />

                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Página Não Encontrada
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph>
                        A página que você está procurando não existe ou foi removida.
                    </Typography>

                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        startIcon={<HomeIcon />}
                        sx={{ mt: 2 }}
                    >
                        Voltar para a página inicial
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}