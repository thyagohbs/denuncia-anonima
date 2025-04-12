import axios, { AxiosError } from "axios";
import { env } from "../config/env";

const API_URL = env.isDevelopment
  ? "http://localhost:3000"
  : process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs em desenvolvimento e tratamento básico de erros
api.interceptors.response.use(
  (response) => {
    if (env.isDevelopment) {
      console.log(
        `[API RESPONSE] Status: ${response.status} - ${response.config.url}`
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (env.isDevelopment) {
      console.error(
        `[API ERROR] Status: ${error.response?.status} - ${error.config?.url}`
      );
      console.error(error.response?.data || error.message);
    }

    // Tratamento básico de erros (sem autenticação)
    if (error.response?.status === 500) {
      console.error("Erro interno do servidor");
    }

    return Promise.reject(error);
  }
);

export default api;
