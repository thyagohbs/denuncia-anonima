import { Test, TestingModule } from '@nestjs/testing';
import { ProtocoloService } from './protocolo.service';

describe('ProtocoloService', () => {
  let service: ProtocoloService;

  // Esta função é executada antes de cada teste
  beforeEach(async () => {
    // Configura um módulo de teste com o ProtocoloService
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocoloService],
    }).compile();

    // Obtém a instância do serviço do módulo de teste
    service = module.get<ProtocoloService>(ProtocoloService);
  });

  // Teste básico para garantir que o serviço foi instanciado corretamente
  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // Grupo de testes para o método gerarProtocolo
  describe('gerarProtocolo', () => {
    it('deve gerar um protocolo no formato DEN-XXXXXXXX', () => {
      const protocolo = service.gerarProtocolo();
      // Verifica se o formato segue o padrão usando regex
      expect(protocolo).toMatch(/^DEN-[A-Z0-9]{8}$/);
    });

    it('deve gerar protocolos únicos em chamadas consecutivas', () => {
      const protocolo1 = service.gerarProtocolo();
      const protocolo2 = service.gerarProtocolo();
      // Verifica se protocolos gerados são diferentes
      expect(protocolo1).not.toEqual(protocolo2);
    });
  });

  // Grupo de testes para o método validarProtocolo
  describe('validarProtocolo', () => {
    it('deve validar protocolos no formato correto', () => {
      // Testa casos válidos
      expect(service.validarProtocolo('DEN-ABCD1234')).toBe(true);
      expect(service.validarProtocolo('DEN-12345678')).toBe(true);
      expect(service.validarProtocolo('DEN-A1B2C3D4')).toBe(true);
    });

    it('deve rejeitar protocolos em formato inválido', () => {
      // Testa casos inválidos
      expect(service.validarProtocolo('DEN-ABC')).toBe(false); // Muito curto
      expect(service.validarProtocolo('DENABCD1234')).toBe(false); // Sem hífen
      expect(service.validarProtocolo('den-ABCD1234')).toBe(false); // Prefixo em minúsculas
      expect(service.validarProtocolo('DEN-abcd1234')).toBe(false); // Sufixo em minúsculas
      expect(service.validarProtocolo('DEN-ABCD123#')).toBe(false); // Caractere especial
      expect(service.validarProtocolo('')).toBe(false); // Vazio
    });
  });
});
