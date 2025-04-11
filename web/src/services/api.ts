import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";

// Criando instância do Axios com base na variável de ambiente
const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logs em ambiente de desenvolvimento
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (env.isDevelopment) {
      console.log(
        `[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    const token = localStorage.getItem("token");

    // Se houver token, inclui no header de autorização
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
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
    // Tratamento centralizado de erros
    if (error.response) {
      // Erros com resposta do servidor
      const status = error.response.status;

      if (status === 401) {
        // Não autorizado - pode redirecionar para login ou renovar token
        localStorage.removeItem("token");
      }

      if (status === 403) {
        // Acesso proibido
        console.error("Acesso proibido");
      }

      if (status === 500) {
        // Erro interno do servidor
        console.error("Erro interno do servidor");
      }
    } else if (error.request) {
      // Sem resposta do servidor
      console.error("Não foi possível conectar ao servidor");
    } else {
      // Erro na configuração da requisição
      console.error("Erro ao configurar requisição", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
