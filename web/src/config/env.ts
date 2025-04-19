interface EnvConfig {
  apiUrl: string;
  geocodeApiKey: string | undefined;
  isProduction: boolean;
  isDevelopment: boolean;
  logLevel: string;
}

export const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  geocodeApiKey: import.meta.env.VITE_GEOCODE_API_KEY,
  isProduction: import.meta.env.VITE_ENVIRONMENT === "production",
  isDevelopment: import.meta.env.VITE_ENVIRONMENT === "development",
  logLevel: import.meta.env.VITE_LOG_LEVEL || "info",
};
