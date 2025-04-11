import { useState, useCallback } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (endpoint: string, options: any = {}) => {
    setState({ data: null, loading: true, error: null });

    try {
      const { method = "GET", data = null, params = null } = options;

      const response = await api({
        url: endpoint,
        method,
        data,
        params,
      });

      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError;
      const message =
        error.response?.data?.message ||
        "Ocorreu um erro ao processar a requisição";

      setState({
        data: null,
        loading: false,
        error: message,
      });

      return { success: false, error: message };
    }
  }, []);

  return { ...state, request };
}
