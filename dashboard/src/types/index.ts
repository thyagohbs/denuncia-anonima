export interface User {
  id: string;
  email: string;
  roles?: string[];
}

export interface AuthResponse {
  access_token: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  endereco?: string;
}

export interface Report {
  id: string;
  protocolo: string;
  tipo: ReportType;
  detalhes: string;
  localizacao: Location;
  criadoEm: string;
  atualizadoEm: string;
  status: ReportStatus;
}

export enum ReportType {
  FURTO = "furto",
  ROUBO = "roubo",
  AGRESSAO = "agressao",
  DANO_AO_PATRIMONIO = "dano_ao_patrimonio",
  OUTROS = "outros",
}

export enum ReportStatus {
  RECEBIDA = "recebida",
  EM_ANALISE = "em_analise",
  EM_INVESTIGACAO = "em_investigacao",
  CONCLUIDA = "concluida",
  ARQUIVADA = "arquivada",
}

export interface ReportFilters {
  tipo?: ReportType;
  startDate?: string;
  endDate?: string;
  location?: string;
}
