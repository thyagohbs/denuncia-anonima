import { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useReportStore from "../../../store/useReportStore";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import * as z from "zod";
import { useGeocode } from "../../../hooks/useGeocode";

// Esquema de validação
const schema = z.object({
    endereco: z.string().min(5, "Informe um endereço válido"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

type FormValues = {
    endereco: string;
    latitude?: number;
    longitude?: number;
};

interface ReportLocationFormProps {
    onNext: () => void;
    onBack: () => void;
}

export default function ReportLocationForm({
    onNext,
    onBack,
}: ReportLocationFormProps) {
    const { formData, updateFormData } = useReportStore();
    const { geocode, isLoading, error: geocodeError } = useGeocode();
    const [locationError, setLocationError] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            endereco: formData.localizacao?.endereco || "",
            latitude: formData.localizacao?.latitude,
            longitude: formData.localizacao?.longitude,
        },
    });

    const watchedAddress = watch("endereco");
    const watchedLat = watch("latitude");
    const watchedLng = watch("longitude");

    // Se o usuário mudou o endereço, limpe as coordenadas
    useEffect(() => {
        if (watchedAddress && watchedAddress !== formData.localizacao?.endereco) {
            setValue("latitude", undefined);
            setValue("longitude", undefined);
        }
    }, [watchedAddress, formData.localizacao?.endereco, setValue]);

    const onSubmit = async (data: FormValues) => {
        // Se o usuário digitou endereço mas não usou geocode ou localização atual
        if (!data.latitude || !data.longitude) {
            try {
                setLocationError(null);
                const coords = await geocode(data.endereco);
                if (coords) {
                    updateFormData({
                        localizacao: {
                            endereco: data.endereco,
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
                endereco: data.endereco,
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
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="endereco"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Endereço completo"
                                variant="outlined"
                                placeholder="Rua, número, bairro, cidade"
                                error={!!errors.endereco}
                                helperText={errors.endereco?.message}
                                margin="normal"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={getCurrentLocation}
                                                disabled={locating}
                                                edge="end"
                                                color="primary"
                                                title="Usar minha localização atual"
                                            >
                                                {locating ? <CircularProgress size={24} /> : <MyLocationIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Latitude"
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Longitude"
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        )}
                    />
                </Grid>

                {(locationError || geocodeError) && (
                    <Grid size={{ xs: 12 }}>
                        <Alert severity="error">{locationError || geocodeError}</Alert>
                    </Grid>
                )}

                {watchedLat && watchedLng && (
                    <Grid size={{ xs: 12 }}>
                        <Alert severity="success">
                            Localização definida com sucesso!
                        </Alert>
                    </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                        Para melhor precisão, informe o endereço completo ou use o botão de localização atual.
                        Caso saiba as coordenadas exatas, pode informá-las diretamente.
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between",
                gap: 2,
                mt: 4
            }}>
                <Button
                    onClick={onBack}
                    variant="outlined"
                    fullWidth={false}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Voltar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading || locating}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    {isLoading ? <CircularProgress size={24} /> : "Próximo"}
                </Button>
            </Box>
        </Box>
    );
}

// Função para converter coordenadas em endereço (implementação simplificada)
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    // Esta seria uma implementação real usando uma API como Google Maps ou Nominatim
    // Para este exemplo, vamos retornar um endereço fictício
    return "Endereço obtido a partir da sua localização atual";
}