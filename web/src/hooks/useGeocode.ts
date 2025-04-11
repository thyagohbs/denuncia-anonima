import { useState } from "react";
import api from "../services/api";

interface GeocodingResult {
  lat: number;
  lng: number;
}

export function useGeocode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string): Promise<GeocodingResult | null> => {
    if (!address.trim()) {
      setError("Endereço não fornecido");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Em produção, use uma API real como Google Maps ou Nominatim
      // Para fins de demonstração, simularemos um resultado bem-sucedido

      // Simulação de chamada à API
      // const response = await api.get('/geocode', { params: { address } });
      // return response.data;

      // Simulando uma pequena latência para demonstrar o carregamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Retornando coordenadas simuladas
      return {
        lat: -23.55052 + Math.random() * 0.01,
        lng: -46.633308 + Math.random() * 0.01,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao geocodificar endereço";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { geocode, isLoading, error };
}
