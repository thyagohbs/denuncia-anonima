import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProtocoloService {
  /**
   * Gera um protocolo único para denúncias no formato 'DEN-XXXXXXXX'
   * onde X são caracteres alfanuméricos
   */
  gerarProtocolo(): string {
    // Formato: DEN- seguido por 8 caracteres do UUID em maiúsculas
    return `DEN-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  /**
   * Valida se um formato de protocolo é válido
   */
  validarProtocolo(protocolo: string): boolean {
    // Verifica se o protocolo segue o formato DEN-XXXXXXXX (8 caracteres após DEN-)
    const regex = /^DEN-[A-Z0-9]{8}$/;
    return regex.test(protocolo);
  }
}
