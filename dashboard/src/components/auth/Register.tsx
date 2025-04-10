import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await register(email, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Falha no cadastro. Tente novamente mais tarde.'
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
                        Criar uma nova conta
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

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Cadastro realizado com sucesso! Redirecionando para o login...
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="A senha deve ter pelo menos 6 caracteres"
                            InputProps={{
                                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirmar Senha"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            disabled={loading || success}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
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
                            to="/login"
                            variant="body2"
                            color="primary"
                            underline="hover"
                        >
                            Já tem uma conta? Faça login
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;