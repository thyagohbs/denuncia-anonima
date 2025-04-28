import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportType, Location, FormData } from "../../types/report";

// Estado inicial do formData (o mesmo que tinha no Zustand)
const initialFormData: FormData = {
  tipo: "",
  localizacao: "",
  detalhes: "",
  descricaoOcorrido: "",
  descricaoSuspeito: "",
};

// Interface para o estado
export interface ReportState {
  reportType: ReportType | null;
  location: Location | null;
  details: string | null;
  formData: FormData;
}

// Estado inicial
const initialState: ReportState = {
  reportType: null,
  location: null,
  details: null,
  formData: initialFormData,
};

// Criar o slice
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    // Action para definir o tipo de denúncia
    setReportType: (state, action: PayloadAction<ReportType>) => {
      state.reportType = action.payload;
      state.formData.tipo = action.payload;
    },

    // Action para definir a localização
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
      state.formData.localizacao = action.payload;
    },

    // Action para definir detalhes
    setDetails: (state, action: PayloadAction<string>) => {
      state.details = action.payload;
      state.formData.detalhes = action.payload;
    },

    // Action para atualizar formData diretamente
    updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // Action para definir descrição do ocorrido
    setDescricaoOcorrido: (state, action: PayloadAction<string>) => {
      state.formData.descricaoOcorrido = action.payload;
    },

    // Action para definir descrição do suspeito
    setDescricaoSuspeito: (state, action: PayloadAction<string>) => {
      state.formData.descricaoSuspeito = action.payload;
    },

    // Action para resetar o estado
    resetReport: (state) => {
      state.reportType = null;
      state.location = null;
      state.details = null;
      state.formData = initialFormData;
    },
  },
});

// Exportar actions e reducer
export const {
  setReportType,
  setLocation,
  setDetails,
  updateFormData,
  setDescricaoOcorrido,
  setDescricaoSuspeito,
  resetReport,
} = reportSlice.actions;

export default reportSlice.reducer;
