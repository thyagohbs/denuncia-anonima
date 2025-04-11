import { Box, Typography, Grid, Radio, RadioGroup, FormControlLabel, FormControl, Button, FormHelperText } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useReportStore, { ReportType } from "../../../store/useReportStore";
import * as z from "zod";

const schema = z.object({
    tipo: z.enum([
        ReportType.FURTO,
        ReportType.ROUBO,
        ReportType.AGRESSAO,
        ReportType.DANO_AO_PATRIMONIO,
        ReportType.OUTROS
    ], {
        required_error: "Selecione um tipo de denúncia",
    }),
});

type FormValues = z.infer<typeof schema>;

interface ReportTypeFormProps {
    onNext: () => void;
}

export default function ReportTypeForm({ onNext }: ReportTypeFormProps) {
    const { formData, updateFormData } = useReportStore();

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            tipo: formData.tipo,
        },
    });

    const onSubmit = (data: FormValues) => {
        updateFormData({ tipo: data.tipo });
        onNext();
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>
                Selecione o tipo de ocorrência que deseja denunciar
            </Typography>

            <FormControl component="fieldset" error={!!errors.tipo} sx={{ mt: 2, width: "100%" }}>
                <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <Grid container spacing={2}>
                                {Object.values(ReportType).map((type) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={type}>
                                        <FormControlLabel
                                            value={type}
                                            control={<Radio />}
                                            label={getReportTypeLabel(type)}
                                            sx={{
                                                p: 2,
                                                border: 1,
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                display: 'flex',
                                                width: '100%',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>
                    )}
                />
                {errors.tipo && (
                    <FormHelperText>{errors.tipo.message}</FormHelperText>
                )}
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                >
                    Próximo
                </Button>
            </Box>
        </Box>
    );
}

// Função para obter label amigável do tipo de denúncia
function getReportTypeLabel(type: ReportType): string {
    const labels: Record<ReportType, string> = {
        [ReportType.FURTO]: 'Furto (sem violência)',
        [ReportType.ROUBO]: 'Roubo (com violência ou ameaça)',
        [ReportType.AGRESSAO]: 'Agressão',
        [ReportType.DANO_AO_PATRIMONIO]: 'Dano ao patrimônio',
        [ReportType.OUTROS]: 'Outros',
    };

    return labels[type];
}