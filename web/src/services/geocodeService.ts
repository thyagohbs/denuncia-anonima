import axios from "axios";
import { env } from "../config/env";

interface AddressData {
  cidade: string;
  bairro: string;
  rua: string;
  numero?: string;
  endereco: string;
}

/**
 * Obtém dados de endereço a partir de coordenadas geográficas usando a API OpenCage
 * @param lat Latitude
 * @param lng Longitude
 * @returns Dados do endereço ou null se não encontrado
 */
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<AddressData | null> => {
  try {
    if (!env.geocodeApiKey) {
      console.error("Chave de API do OpenCage não foi configurada");
      return null;
    }

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: `${lat},${lng}`,
          key: env.geocodeApiKey,
          language: "pt",
          no_annotations: 1,
        },
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = result.components;
      const formatted = result.formatted;

      return {
        cidade: components.city || components.county || components.state || "",
        bairro:
          components.suburb ||
          components.neighbourhood ||
          components.district ||
          "",
        rua: components.road || components.street || "",
        numero: components.house_number || "",
        endereco: formatted || `${lat}, ${lng}`,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao obter endereço:", error);
    return null;
  }
};

/**
 * Obtém coordenadas geográficas a partir de um endereço usando a API OpenCage
 * @param address Endereço para geocodificação
 * @returns Coordenadas (latitude e longitude) ou null se não encontrado
 */
export const getCoordinatesFromAddress = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    if (!env.geocodeApiKey) {
      console.error("Chave de API do OpenCage não foi configurada");
      return null;
    }

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: address,
          key: env.geocodeApiKey,
          language: "pt",
          no_annotations: 1,
          countrycode: "br", // Limitar resultados ao Brasil
        },
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const { lat, lng } = result.geometry;

      return { lat, lng };
    }

    return null;
  } catch (error) {
    console.error("Erro ao obter coordenadas:", error);
    return null;
  }
};
