import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, Typography, Grid, TextField, Button, Autocomplete, CircularProgress, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useReportStore from "../../../store/useReportStore";

const schema = z.object({
    endereco: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ReportLocationFormProps {
    onNext: () => void;
    onBack: () => void;
}

// Simulação de serviço de geocodificação
const geocode = async () => {
    // Em um ambiente real, aqui você usaria uma API como Google Places ou MapBox
    // Para fins de demonstração, vamos simular uma resposta após um pequeno delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { lat: Math.random() * 90, lng: Math.random() * 180 };
};

// Simulação de serviço de geocodificação reversa
const reverseGeocode = async (lat: number, lng: number) => {
    // Simular chamada a API de geocodificação reversa
    await new Promise(resolve => setTimeout(resolve, 500));
    return `Endereço encontrado para coordenadas (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

// Simulação de sugestões de endereço
const getAddressSuggestions = async (input: string): Promise<string[]> => {
    // Simular chamada a API de sugestões
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!input) return [];

    return [
        `${input}, Centro`,
        `${input}, Zona Norte`,
        `${input}, Zona Sul`,
        `${input}, Zona Leste`,
        `${input}, Zona Oeste`,
    ];
};

export default function ReportLocationForm({
    onNext,
    onBack,
}: ReportLocationFormProps) {
    const { formData, updateFormData } = useReportStore();
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            endereco: formData.localizacao?.endereco || "",
            latitude: formData.localizacao?.latitude,
            longitude: formData.localizacao?.longitude,
        },
    });

    const watchedAddress = watch("endereco");

    // Efeito para buscar sugestões de endereço quando o usuário digita
    useEffect(() => {
        if (!inputValue) {
            setAddressSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoadingSuggestions(true);
            try {
                const suggestions = await getAddressSuggestions(inputValue);
                setAddressSuggestions(suggestions);
            } catch (error) {
                console.error("Erro ao buscar sugestões:", error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        // Debounce para evitar chamadas excessivas
        const timer = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Reset das coordenadas quando o endereço muda manualmente
    useEffect(() => {
        if (watchedAddress !== formData.localizacao?.endereco) {
            setValue("latitude", undefined);
            setValue("longitude", undefined);
        }
    }, [watchedAddress, formData.localizacao?.endereco, setValue]);

    const onSubmit = async (data: FormValues) => {
        // Se o usuário digitou endereço mas não usou geocode ou localização atual
        if (!data.latitude || !data.longitude) {
            try {
                setLocationError(null);
                const coords = await geocode(data.endereco || '');
                if (coords) {
                    updateFormData({
                        localizacao: {
                            endereco: data.endereco || '',
                            latitude: coords.lat,
                            longitude: coords.lng,
                        },
                    });
                    onNext();
                }
            } catch (error) {
                setLocationError("Não foi possível converter o endereço em coordenadas. Verifique se o endereço está correto.");
            }
            return;
        }

        // Se já tem coordenadas
        updateFormData({
            localizacao: {
                endereco: data.endereco || '',
                latitude: data.latitude,
                longitude: data.longitude,
            },
        });
        onNext();
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocalização não é suportada pelo seu navegador");
            return;
        }

        setLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Obter o endereço a partir das coordenadas (reverse geocoding)
                    const address = await reverseGeocode(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    setValue("endereco", address);
                    setValue("latitude", position.coords.latitude);
                    setValue("longitude", position.coords.longitude);
                    setLocating(false);
                } catch (error) {
                    setLocationError("Não foi possível obter seu endereço atual");
                    setLocating(false);
                }
            },
            (error) => {
                setLocationError(
                    error.code === 1
                        ? "Permissão de localização negada"
                        : "Não foi possível obter sua localização atual"
                );
                setLocating(false);
            }
        );
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
                Local da Ocorrência
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }} >
                    <Controller
                        name="endereco"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                freeSolo
                                options={addressSuggestions}
                                loading={loadingSuggestions}
                                onInputChange={(_, newValue) => {
                                    setInputValue(newValue);
                                }}
                                onChange={(_, newValue) => {
                                    field.onChange(newValue || '');
                                }}
                                value={field.value || ''}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Endereço completo"
                                        variant="outlined"
                                        placeholder="Digite a rua, número, bairro, cidade..."
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                {locationError && (
                    <Grid size={{ xs: 12 }} >
                        <Alert severity="error">{locationError}</Alert>
                    </Grid>
                )}

                <Grid size={{ xs: 12 }} >
                    <Button
                        startIcon={<LocationOnIcon />}
                        onClick={getCurrentLocation}
                        variant="outlined"
                        disabled={locating}
                        sx={{ mr: 1 }}
                    >
                        {locating ? "Obtendo localização..." : "Usar minha localização atual"}
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Button onClick={onBack} variant="outlined">
                    Voltar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Próximo
                </Button>
            </Box>
        </Box>
    );
}