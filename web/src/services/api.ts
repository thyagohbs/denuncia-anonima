import axios, { AxiosError } from "axios";
import { env } from "../config/env";
import { DenunciaData, DenunciaResponse, FormData } from "../types/report";
// URL base do serviço de API
const API_URL = env.isDevelopment
  ? "http://localhost:3000"
  : process.env.REACT_APP_API_URL || "https://api.denunciaanonima.com.br";

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

export const submitDenuncia = async (
  data: DenunciaData | FormData
): Promise<DenunciaResponse> => {
  try {
    const response = await api.post("/reports", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar denúncia:", error);
    throw error;
  }
};

export const getDenuncia = async (protocolo: string) => {
  try {
    const response = await api.get(`/reports/protocolo/${protocolo}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar denúncia:", error);
    throw error;
  }
};

export default api;
