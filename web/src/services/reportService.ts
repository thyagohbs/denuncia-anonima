import { useState } from "react";
import api from "./api";
import { FormData } from "../store/useReportStore";

// Interface para os dados de envio de denúncia
export interface ReportData {
  tipo: string;
  detalhes: string;
  localizacao: string;
  anexos?: File[];
  dataOcorrencia?: string;
}

// Interface para os dados formatados de denúncia para a API
export interface DenunciaData {
  tipo: string;
  localizacao: {
    endereco: string;
    latitude: number;
    longitude: number;
  };
  descricaoOcorrido: string;
  descricaoSuspeito: string;
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

// Função específica para enviar denúncias anônimas
export const submitAnonymousReport = async (
  reportData: ReportData
): Promise<DenunciaResponse> => {
  try {
    const response = await api.post("/reports", reportData);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar denúncia anônima:", error);
    throw error;
  }
};

// Função para enviar denúncia
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

// Função para consultar denúncia por protocolo
export const getDenuncia = async (protocolo: string) => {
  try {
    const response = await api.get(`/denuncias/${protocolo}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar denúncia:", error);
    throw error;
  }
};

// Hook para gerenciar operações de denúncia
export function useReportService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (data: FormData): Promise<SubmitReportResult> => {
    setLoading(true);
    setError(null);

    try {
      // Preparar apenas os dados essenciais da denúncia
      const reportData: ReportData = {
        tipo: data.tipo as string,
        detalhes: data.detalhes || "",
        localizacao: data.localizacao ? JSON.stringify(data.localizacao) : "",
      };

      // Usar a função específica para envio anônimo
      const response = await submitAnonymousReport(reportData);

      return {
        success: true,
        protocol: response.protocolo,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar denúncia";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const trackReport = async (protocol: string): Promise<TrackReportResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/reports/protocolo/${protocol}`);
      return {
        status: response.data.status,
        lastUpdate: response.data.atualizadoEm,
        details: response.data.detalhes,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao consultar denúncia";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Função para utilizar submitDenuncia com gerenciamento de estado
  const enviarDenuncia = async (
    data: DenunciaData
  ): Promise<DenunciaResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await submitDenuncia(data);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar denúncia";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Função para utilizar getDenuncia com gerenciamento de estado
  const consultarDenuncia = async (protocolo: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDenuncia(protocolo);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao consultar denúncia";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitReport,
    trackReport,
    enviarDenuncia,
    consultarDenuncia,
    loading,
    error,
  };
}
