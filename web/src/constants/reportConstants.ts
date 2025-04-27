export const TYPE_LABELS: Record<string, string> = {
  VIOLENCIA_FISICA: "Violência Física",
  VIOLENCIA_SEXUAL: "Violência Sexual",
  AMEACA: "Ameaça",
  INTOLERANCIA: "Intolerância",
  ABUSO_AUTORIDADE: "Abuso de Autoridade",
  AGRESSAO: "Agressão",
  OUTROS: "Outros",
};

export const STATUS_LABELS: Record<string, string> = {
  recebida: "Recebida",
  em_analise: "Em Análise",
  em_investigacao: "Em Investigação",
  concluida: "Concluída",
  arquivada: "Arquivada",
};

export const STATUS_VARIANTS: Record<string, string> = {
  recebida: "info",
  em_analise: "primary",
  em_investigacao: "warning",
  concluida: "success",
  arquivada: "secondary",
};
