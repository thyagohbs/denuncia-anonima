import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, InputLabel, Alert } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBR from "date-fns/locale/pt-BR";
import useReportStore from "../../../store/useReportStore";
import { format, isValid, parseISO } from "date-fns";
import * as z from "zod";

// Esquema de validação
const schema = z.object({
    detalhes: z
        .string()
        .min(20, "Descreva a ocorrência com pelo menos 20 caracteres")
        .max(3000, "Descrição muito longa, limite de 3000 caracteres"),
    data: z.string().refine((val) => {
        // Validar se é uma data válida não futura
        const date = parseISO(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return isValid(date) && date <= today;
    }, "Data inválida ou futura"),
});

type FormValues = z.infer<typeof schema>;

interface ReportDetailsFormProps {
    onNext: () => void;
    onBack: () => void;
}

export default function ReportDetailsForm({
    onNext,
    onBack,
}: ReportDetailsFormProps) {
    const { formData, updateFormData } = useReportStore();
    const [selectedFiles, setSelectedFiles] = useState<File[]>(formData.arquivos || []);

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            detalhes: formData.detalhes || "",
            data: formData.data || format(new Date(), "yyyy-MM-dd"),
        },
    });

    const onSubmit = (data: FormValues) => {
        updateFormData({
            detalhes: data.detalhes,
            data: data.data,
            arquivos: selectedFiles,
        });
        onNext();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
                Detalhes da Ocorrência
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                        <Controller
                            name="data"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label="Data da ocorrência"
                                    value={parseISO(field.value)}
                                    onChange={(date) => {
                                        if (date) {
                                            field.onChange(format(date, "yyyy-MM-dd"));
                                        }
                                    }}
                                    disableFuture
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: "outlined",
                                            error: !!errors.data,
                                            helperText: errors.data?.message,
                                            margin: "normal"
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="detalhes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                multiline
                                rows={6}
                                fullWidth
                                label="Descrição detalhada"
                                variant="outlined"
                                placeholder="Descreva com detalhes o que aconteceu, incluindo horário aproximado, local exato, descrição de pessoas envolvidas e outros detalhes relevantes."
                                error={!!errors.detalhes}
                                helperText={errors.detalhes?.message}
                                margin="normal"
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <InputLabel htmlFor="file-input" sx={{ mb: 1 }}>
                        Evidências (opcional)
                    </InputLabel>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1
                    }}>
                        <input
                            accept="image/*,video/*,application/pdf"
                            id="file-input"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-input">
                            <Button variant="outlined" component="span" fullWidth={false}>
                                Anexar arquivos
                            </Button>
                        </label>
                        <Typography variant="caption" display="block">
                            Formatos aceitos: imagens, vídeos e PDFs (máximo 10MB por arquivo)
                        </Typography>
                    </Box>

                    {selectedFiles.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Arquivos selecionados:
                            </Typography>
                            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {selectedFiles.map((file, index) => (
                                    <Alert
                                        key={index}
                                        severity="info"
                                        sx={{ mb: 1 }}
                                        onClose={() => removeFile(index)}
                                    >
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </Alert>
                                ))}
                            </Box>
                        </Box>
                    )}
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
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    Próximo
                </Button>
            </Box>
        </Box>
    );
}