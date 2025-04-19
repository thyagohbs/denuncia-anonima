import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, TextField, Button,
    AppBar, Toolbar, IconButton, Paper,
    CircularProgress, Alert, Grid, Tabs, Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import useReportStore from '../../store/useReportStore';
import MapComponent from './components/MapComponent';
import { getAddressFromCoordinates, getCoordinatesFromAddress } from '../../services/geocodeService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`location-tabpanel-${index}`}
            aria-labelledby={`location-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function LocationPage() {
    const navigate = useNavigate();
    const { formData, updateFormData } = useReportStore();

    // Estado para controlar qual aba está ativa
    const [activeTab, setActiveTab] = useState(0);

    const [address, setAddress] = useState(formData.localizacao?.endereco || '');
    const [city, setCity] = useState(formData.localizacao?.cidade || '');
    const [neighborhood, setNeighborhood] = useState(formData.localizacao?.bairro || '');
    const [street, setStreet] = useState(formData.localizacao?.rua || '');
    const [number, setNumber] = useState(formData.localizacao?.numero || '');
    const [reference, setReference] = useState(formData.localizacao?.referencia || '');

    const [latitude, setLatitude] = useState<number | undefined>(formData.localizacao?.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(formData.localizacao?.longitude);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleBackClick = () => {
        navigate('/home');
    };

    const handleLocationGet = async () => {
        setLoading(true);
        setError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitude(latitude);
                    setLongitude(longitude);

                    // Buscar endereço a partir das coordenadas
                    try {
                        const addressData = await getAddressFromCoordinates(latitude, longitude);
                        if (addressData) {
                            setCity(addressData.cidade);
                            setNeighborhood(addressData.bairro);
                            setStreet(addressData.rua);
                            setNumber(addressData.numero || '');
                            setAddress(addressData.endereco);
                        }
                        setSuccess(true);
                    } catch (err) {
                        console.error('Erro ao obter endereço:', err);
                        // Mesmo sem endereço, temos as coordenadas
                        setSuccess(true);
                    }

                    setLoading(false);
                },
                (err) => {
                    console.error('Erro de geolocalização:', err);
                    setError('Não foi possível obter a localização. Por favor, insira o endereço manualmente.');
                    setLoading(false);
                }
            );
        } else {
            setError('Seu navegador não suporta geolocalização.');
            setLoading(false);
        }
    };

    const handleMapLocationSelect = async (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);

        // Buscar endereço a partir das coordenadas selecionadas no mapa
        try {
            setLoading(true);
            const addressData = await getAddressFromCoordinates(lat, lng);
            if (addressData) {
                setCity(addressData.cidade);
                setNeighborhood(addressData.bairro);
                setStreet(addressData.rua);
                setNumber(addressData.numero || '');
                setAddress(addressData.endereco);
            }
            setSuccess(true);
        } catch (err) {
            console.error('Erro ao obter endereço:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchAddress = async () => {
        if (!city || !neighborhood || !street) {
            setError('Preencha pelo menos cidade, bairro e rua para buscar no mapa');
            return;
        }

        const addressQuery = `${street}${number ? ` ${number}` : ''}, ${neighborhood}, ${city}`;

        try {
            setLoading(true);
            setError(null);

            const coords = await getCoordinatesFromAddress(addressQuery);

            if (coords) {
                setLatitude(coords.lat);
                setLongitude(coords.lng);
                setAddress(addressQuery);
                setActiveTab(0); // Muda para a aba do mapa
                setSuccess(true);
            } else {
                setError('Não foi possível encontrar o endereço informado');
            }
        } catch (err) {
            console.error('Erro ao buscar coordenadas:', err);
            setError('Erro ao buscar coordenadas do endereço');
        } finally {
            setLoading(false);
        }
    };

    const clearLocation = () => {
        setLatitude(undefined);
        setLongitude(undefined);
        setCity('');
        setNeighborhood('');
        setStreet('');
        setNumber('');
        setReference('');
        setAddress('');
        setSuccess(false);
        setError(null);
    };

    const validateForm = () => {
        // Verifica se pelo menos um método de localização foi preenchido
        const hasMapLocation = latitude !== undefined && longitude !== undefined;
        const hasManualAddress = city && neighborhood && street;

        return hasMapLocation || hasManualAddress;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            setError('Por favor, informe uma localização válida no mapa ou preencha o endereço manualmente.');
            return;
        }

        // Monta objeto de localização com todos os dados disponíveis
        const locationData = {
            endereco: address || `${street}${number ? ` ${number}` : ''}, ${neighborhood}, ${city}`,
            cidade: city,
            bairro: neighborhood,
            rua: street,
            numero: number,
            referencia: reference,
            latitude,
            longitude
        };

        updateFormData({ localizacao: locationData });
        navigate('/confirmation');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleBackClick}
                        aria-label="voltar"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: .5 }}>
                        Local da Ocorrência
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleSubmit}
                        disabled={!validateForm() || loading}
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        {loading ? 'Processando...' : 'Continuar'}
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 2, flexGrow: 1 }}>
                <Box sx={{ mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                    >
                        <Tab label="Mapa" />
                        <Tab label="Endereço" />
                    </Tabs>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Localização definida com sucesso!
                    </Alert>
                )}

                <TabPanel value={activeTab} index={0}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={loading ? <CircularProgress size={20} /> : <LocationOnIcon />}
                                onClick={handleLocationGet}
                                disabled={loading}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {loading ? 'Obtendo localização...' : 'Usar minha localização atual'}
                            </Button>
                        </Box>

                        <MapComponent
                            latitude={latitude}
                            longitude={longitude}
                            onSelectLocation={handleMapLocationSelect}
                        />

                        {(latitude !== undefined && longitude !== undefined) && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                </Typography>

                                {address && (
                                    <Typography variant="body2" gutterBottom>
                                        Endereço: {address}
                                    </Typography>
                                )}

                                <Button
                                    startIcon={<ClearIcon />}
                                    onClick={clearLocation}
                                    size="small"
                                    sx={{ mt: 1 }}
                                >
                                    Limpar localização
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <form>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Cidade"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                        error={!city && !!error}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Bairro"
                                        value={neighborhood}
                                        onChange={(e) => setNeighborhood(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                        error={!neighborhood && !!error}
                                    />
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Rua"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                        error={!street && !!error}
                                    />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Número"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>

                                    <TextField
                                        fullWidth
                                        label="Ponto de referência"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>

                                    <Button
                                        variant="outlined"
                                        onClick={handleSearchAddress}
                                        disabled={loading || !city || !neighborhood || !street}
                                        startIcon={loading ? <CircularProgress size={20} /> : <LocationOnIcon />}
                                        sx={{ mt: 1 }}
                                    >
                                        Buscar no mapa
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </TabPanel>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={handleBackClick}
                        startIcon={<ArrowBackIcon />}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        endIcon={<ArrowForwardIcon />}
                        disabled={!validateForm() || loading}
                    >
                        Próximo
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}