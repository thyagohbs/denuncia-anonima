import { useState } from "react";
import api from "./api";
import useReportStore, { ReportFormData } from "../store/useReportStore";
import { generateRandomProtocol } from "../utils/protocolGenerator";

interface SubmitReportResult {
  success: boolean;
  protocol: string;
  message?: string;
}

interface TrackReportResult {
  status: "RECEIVED" | "ANALYSIS" | "FORWARDED" | "CLOSED";
  lastUpdate: string;
  details?: string;
}

export function useReportService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (
    data: ReportFormData
  ): Promise<SubmitReportResult> => {
    setLoading(true);
    setError(null);

    try {
      // Preparar os dados para upload (incluindo arquivos)
      const formData = new FormData();

      // Adicionar dados básicos
      formData.append("tipo", data.tipo);
      formData.append("detalhes", data.detalhes);
      formData.append("data", data.data);

      // Adicionar localização
      if (data.localizacao) {
        formData.append("localizacao", JSON.stringify(data.localizacao));
      }

      // Adicionar arquivos
      if (data.arquivos && data.arquivos.length > 0) {
        data.arquivos.forEach((file, index) => {
          formData.append(`arquivo_${index}`, file);
        });
      }

      // Em um ambiente real, envie para o backend
      // const response = await api.post('/reports', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      // return response.data;

      // Simulando envio (remova em produção)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gerar um protocolo de teste (em produção, viria do backend)
      const protocol = generateRandomProtocol();

      return {
        success: true,
        protocol,
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
      // Em um ambiente real, consulte o backend
      // const response = await api.get(`/reports/track/${protocol}`);
      // return response.data;

      // Simulando consulta (remova em produção)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Status aleatório para demonstração
      const statuses: TrackReportResult["status"][] = [
        "RECEIVED",
        "ANALYSIS",
        "FORWARDED",
        "CLOSED",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      return {
        status: randomStatus,
        lastUpdate: new Date().toISOString(),
        details:
          randomStatus === "CLOSED"
            ? "Denúncia analisada e encaminhada aos órgãos competentes."
            : undefined,
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
