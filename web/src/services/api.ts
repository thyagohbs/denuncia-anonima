import axios, { AxiosError } from "axios";
import { env } from "../config/env";

// URL base do serviço de API
const API_URL = env.isDevelopment
  ? "http://localhost:3000"
  : process.env.REACT_APP_API_URL || "https://api.denunciaanonima.com.br";

// Interface para os dados de denúncia
export interface ReportData {
  tipo: string;
  detalhes: string;
  localizacao: string;
  // Adicione outros campos conforme necessário
  anexos?: File[];
  dataOcorrencia?: string;
}

// Criação da instância Axios para uso geral
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs e tratamento básico de erros
api.interceptors.response.use(
  (response) => {
    if (env.isDevelopment) {
      console.log(
        `[API] Resposta: ${response.status} - ${response.config.url}`
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (env.isDevelopment) {
      console.error(
        `[API] Erro: ${error.response?.status} - ${error.config?.url}`
      );
      console.error(error.response?.data || error.message);
    }

    // Tratamento básico para erros comuns
    if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
    } else if (error.response?.status === 404) {
      console.error("Recurso não encontrado");
    } else if (error.response?.status === 400) {
      console.error("Requisição inválida");
    }

    return Promise.reject(error);
  }
);

// Função específica para enviar denúncias anônimas
export const submitAnonymousReport = async (reportData: ReportData) => {
  try {
    const response = await api.post("/reports", reportData);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar denúncia anônima:", error);
    throw error;
  }
};

// Atualize a interface DenunciaData para incluir os novos campos
interface DenunciaData {
  tipo: string;
  localizacao: {
    endereco: string;
    latitude: number;
    longitude: number;
  };
  descricaoOcorrido: string; // Novo campo para descrição do ocorrido
  descricaoSuspeito: string; // Novo campo para descrição do suspeito
}

interface DenunciaResponse {
  protocolo: string;
  status: string;
  dataRegistro: string;
}

export const submitDenuncia = async (
  data: DenunciaData
): Promise<DenunciaResponse> => {
  try {
    const response = await api.post("/denuncias", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar denúncia:", error);
    throw error;
  }
};

export const getDenuncia = async (protocolo: string) => {
  try {
    const response = await api.get(`/denuncias/${protocolo}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar denúncia:", error);
    throw error;
  }
};

export default api;
