import { create } from "zustand";

// Definindo os tipos
export enum ReportType {
  ASSEDIO_SEXUAL = "ASSEDIO_SEXUAL",
  ASSEDIO_MORAL = "ASSEDIO_MORAL",
  DISCRIMINACAO_GENERO = "DISCRIMINACAO_GENERO",
  VIOLENCIA_VERBAL = "VIOLENCIA_VERBAL",
  ABUSO_AUTORIDADE = "ABUSO_AUTORIDADE",
  OUTROS = "OUTROS",
}

export interface Location {
  endereco?: string;
  latitude?: number;
  longitude?: number;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  referencia?: string;
}

export interface ReportFormData {
  tipo: ReportType;
  detalhes: string;
  data: string;
  localizacao: Location | null;
  arquivos: File[];
}

interface ReportStore {
  // Estado
  formData: ReportFormData;
  isSubmitting: boolean;
  currentStep: number;

  // Ações
  updateFormData: (data: Partial<ReportFormData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

// Estado inicial
const initialFormData: ReportFormData = {
  tipo: ReportType.OUTROS,
  detalhes: "",
  data: "",
  localizacao: null,
  arquivos: [],
};

// Criando o store
const useReportStore = create<ReportStore>((set) => ({
  formData: initialFormData,
  isSubmitting: false,
  currentStep: 0,

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 0,
    }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));

export default useReportStore;
