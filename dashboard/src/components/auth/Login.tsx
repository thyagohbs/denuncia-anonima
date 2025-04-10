import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Importações do Material UI
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    Paper,
    Alert,
    Divider,
    Link,
    CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Verifica se já está autenticado e redireciona para o dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setEmailError('');

        // Validação de email
        if (!validateEmail(email)) {
            setEmailError('Por favor, insira um endereço de email válido');
            return;
        }

        // Validação de senha
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);

            // Pega a URL de origem ou redireciona para o dashboard
            const origin = location.state?.from?.pathname || '/admin';
            navigate(origin);
        } catch (error: any) {
            console.error('Erro de login:', error);
            setError(
                error.response?.data?.message ||
                'Falha ao fazer login. Verifique suas credenciais.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f3f4f6'
            }}
        >
            <Container maxWidth="sm">
                <Box textAlign="center" mb={3}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Entre em sua conta
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 2
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Divider>
                            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                                Ou
                            </Typography>
                        </Divider>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Link
                            component={RouterLink}
                            to="/register"
                            variant="body2"
                            color="primary"
                            underline="hover"
                        >
                            Não tem uma conta? Cadastre-se
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;