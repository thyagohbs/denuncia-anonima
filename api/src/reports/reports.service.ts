import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Report, ReportType } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ProtocoloService } from './services/protocolo.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    private protocoloService: ProtocoloService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId?: number,
  ): Promise<Report> {
    // Remova o DeepPartial explícito e deixe o TypeORM inferir os tipos
    const report = this.reportsRepository.create({
      ...createReportDto,
      protocolo: this.protocoloService.gerarProtocolo(),
      // Use undefined em vez de uma estrutura com objeto quando não houver userId
      ...(userId ? { user: { id: userId } } : {}),
    });

    return await this.reportsRepository.save(report);
  }

  async findAll(tipo?: ReportType): Promise<Report[]> {
    if (tipo) {
      return this.reportsRepository.find({ where: { tipo } });
    }
    return this.reportsRepository.find();
  }

  async findByProtocol(protocolo: string): Promise<Report> {
    if (!this.protocoloService.validarProtocolo(protocolo)) {
      throw new NotFoundException('Formato de protocolo inválido');
    }

    const report = await this.reportsRepository.findOne({
      where: { protocolo },
    });

    if (!report) {
      throw new NotFoundException(
        `Denúncia com protocolo ${protocolo} não encontrada`,
      );
    }

    return report;
  }

  async findByUserId(userId: number): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { user: { id: userId } },
    });
  }
}
