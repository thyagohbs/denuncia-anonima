import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const API_URL = "http://localhost:3000";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT às requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Verificar se o erro é de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirecionar para login apenas se não estiver já na página de login ou registro
      const currentPath = window.location.pathname;
      if (!["/login", "/register"].includes(currentPath)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
