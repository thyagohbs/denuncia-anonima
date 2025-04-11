export function generateRandomProtocol(): string {
  // Gera um número de protocolo com formato XXX-YYYY-ZZZZZZ
  const part1 = Math.random().toString(36).substring(2, 5).toUpperCase();
  const part2 = new Date().getFullYear().toString();
  const part3 = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${part1}-${part2}-${part3}`;
}
