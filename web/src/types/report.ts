// Tipos fundamentais
export type ReportType =
  | "VIOLENCIA_FISICA"
  | "VIOLENCIA_SEXUAL"
  | "AMEACA"
  | "INTOLERANCIA"
  | "ABUSO_AUTORIDADE"
  | "AGRESSAO"
  | "FURTO"
  | "ROUBO"
  | "DANO_AO_PATRIMONIO"
  | "OUTROS";

// Tipo base para localização
export interface Location {
  latitude: number;
  longitude: number;
  endereco: string;
}

// Base de dados para uma denúncia (entrada)
export interface DenunciaBase {
  tipo: ReportType | string;
  localizacao:
    | Location
    | {
        endereco: string;
        latitude: number;
        longitude: number;
      }
    | string;
}

// Interface para os dados enviados pelo formulário web
export interface FormData extends DenunciaBase {
  detalhes?: string;
  anexos?: File[];
  dataOcorrencia?: string;
  descricaoOcorrido?: string;
  descricaoSuspeito?: string;
}

// Interface para dados formatados para a API
export interface DenunciaData extends DenunciaBase {
  descricaoOcorrido: string;
  descricaoSuspeito?: string;
}

// Interface para a resposta da API ao criar denúncia
export interface DenunciaResponse {
  protocolo: string;
  status: string;
  dataRegistro: string;
}

// Interface para resultado de envio de denúncia
export interface SubmitReportResult {
  success: boolean;
  protocol?: string;
  error?: string;
}

// Interface para resultado de consulta de denúncia
export interface TrackReportResult {
  status: string;
  lastUpdate: string;
  details: string;
}

// Interface para representar uma denúncia completa (resposta da API)
export interface Report {
  protocolo: string;
  tipo: string;
  status: string;
  detalhes: string;
  criadoEm: string;
  atualizadoEm: string;
}

// Aliases para compatibilidade com código existente
export type ReportData = FormData;
