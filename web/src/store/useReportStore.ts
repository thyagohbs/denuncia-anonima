import { create } from "zustand";

export type ReportType =
  | "VIOLENCIA_FISICA"
  | "VIOLENCIA_SEXUAL"
  | "AMEACA"
  | "INTOLERANCIA"
  | "ABUSO_AUTORIDADE"
  | "FURTO"
  | "ROUBO"
  | "AGRESSAO"
  | "DANO_AO_PATRIMONIO"
  | "OUTROS";

export interface Location {
  latitude: number;
  longitude: number;
  endereco: string;
}

// Interface para formData
export interface FormData {
  tipo: ReportType | null;
  localizacao: Location | null;
  detalhes?: string | null;
  descricaoOcorrido?: string | null; // Novo campo
  descricaoSuspeito?: string | null; // Novo campo
  // adicione mais campos conforme necessário
}

interface ReportStore {
  // Mantenha as propriedades individuais para compatibilidade
  reportType: ReportType | null;
  location: Location | null;
  details: string | null;

  // Adicione o objeto formData
  formData: FormData;

  // Métodos setters individuais
  setReportType: (type: ReportType) => void;
  setLocation: (location: Location) => void;
  setDetails: (details: string) => void;

  // Método para atualizar formData diretamente
  updateFormData: (data: Partial<FormData>) => void;

  setDescricaoOcorrido: (descricao: string) => void;
  setDescricaoSuspeito: (descricao: string) => void;

  resetReport: () => void;
}

// Estado inicial do formData
const initialFormData: FormData = {
  tipo: null,
  localizacao: null,
  detalhes: null,
  descricaoOcorrido: null,
  descricaoSuspeito: null,
};

const useReportStore = create<ReportStore>((set) => ({
  // Estado individual para compatibilidade
  reportType: null,
  location: null,
  details: null,

  // Novo estado formData
  formData: initialFormData,

  // Métodos setters individuais que também atualizam formData
  setReportType: (type) =>
    set((state) => ({
      reportType: type,
      formData: {
        ...state.formData,
        tipo: type,
      },
    })),

  setLocation: (location) =>
    set((state) => ({
      location,
      formData: {
        ...state.formData,
        localizacao: location,
      },
    })),

  setDetails: (details) =>
    set((state) => ({
      details,
      formData: {
        ...state.formData,
        detalhes: details,
      },
    })),

  // Método para atualizar formData diretamente
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setDescricaoOcorrido: (descricao) =>
    set((state) => ({
      formData: {
        ...state.formData,
        descricaoOcorrido: descricao,
      },
    })),

  setDescricaoSuspeito: (descricao) =>
    set((state) => ({
      formData: {
        ...state.formData,
        descricaoSuspeito: descricao,
      },
    })),

  // Reset do estado
  resetReport: () =>
    set({
      reportType: null,
      location: null,
      details: null,
      formData: initialFormData,
    }),
}));

export default useReportStore;
