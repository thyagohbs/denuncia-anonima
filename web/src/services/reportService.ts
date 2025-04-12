import { useState } from "react";
import api from "./api";
import { ReportFormData } from "../store/useReportStore";

interface SubmitReportResult {
  success: boolean;
  protocol: string;
}

interface TrackReportResult {
  status: string;
  lastUpdate: string;
  details?: string;
}

// Função para gerar protocolo aleatório (apenas para ambiente de desenvolvimento)

export function useReportService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (
    data: ReportFormData
  ): Promise<SubmitReportResult> => {
    setLoading(true);
    setError(null);

    try {
      // Preparar apenas os dados essenciais da denúncia
      const reportData = {
        tipo: data.tipo,
        detalhes: data.detalhes,
        localizacao: data.localizacao,
      };

      // Enviar para o backend de forma anônima
      const response = await api.post("/reports", reportData);

      return {
        success: true,
        protocol: response.data.protocolo,
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

  return {
    submitReport,
    trackReport,
    loading,
    error,
  };
}
