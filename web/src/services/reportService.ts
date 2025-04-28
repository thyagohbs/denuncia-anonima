import { useState } from "react";
import api from "./api";
import {
  FormData,
  DenunciaData,
  DenunciaResponse,
  SubmitReportResult,
} from "../types/report";

// Hook simplificado para gerenciar operações de denúncia
export function useReportService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função única para enviar denúncias
  const submitReportWithState = async (
    data: FormData | DenunciaData
  ): Promise<SubmitReportResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await submitDenuncia(data);
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

  // Função única para consultar denúncias
  const getReportWithState = async (protocolo: string) => {
    setLoading(true);
    setError(null);

    try {
      return await getDenuncia(protocolo);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao consultar denúncia";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const submitDenuncia = async (
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

  const getDenuncia = async (protocolo: string) => {
    try {
      const response = await api.get(`/reports/protocolo/${protocolo}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar denúncia:", error);
      throw error;
    }
  };

  return {
    submitDenuncia: submitReportWithState,
    getDenuncia: getReportWithState,
    loading,
    error,
  };
}
