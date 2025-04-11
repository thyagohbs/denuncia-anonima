import { api } from "./api";
import { Report, ReportFilters } from "../types";

class ReportsService {
  async getAllReports(filters: ReportFilters = {}): Promise<Report[]> {
    // Construir query params baseado nos filtros
    const queryParams = new URLSearchParams();

    if (filters.tipo) {
      queryParams.append("tipo", filters.tipo);
    }

    if (filters.startDate && filters.endDate) {
      queryParams.append("startDate", filters.startDate);
      queryParams.append("endDate", filters.endDate);
    }

    if (filters.location) {
      queryParams.append("location", filters.location);
    }

    const url = `/admin/reports?${queryParams.toString()}`;
    const response = await api.get<Report[]>(url);
    return response.data;
  }

  async getReportByProtocol(protocol: string): Promise<Report> {
    const response = await api.get<Report>(`/reports/protocolo/${protocol}`);
    return response.data;
  }

  async getUserReports(): Promise<Report[]> {
    const response = await api.get<Report[]>("/reports/minhas-denuncias");
    return response.data;
  }
}

export default new ReportsService();
