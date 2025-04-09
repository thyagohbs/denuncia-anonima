import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportType } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId?: number,
  ): Promise<Report> {
    const report = this.reportsRepository.create({
      ...createReportDto,
      protocolo: `DEN-${uuidv4().substring(0, 8).toUpperCase()}`,
      user: userId ? { id: userId } : null,
    });

    return this.reportsRepository.save(report);
  }

  async findAll(tipo?: ReportType): Promise<Report[]> {
    if (tipo) {
      return this.reportsRepository.find({ where: { tipo } });
    }
    return this.reportsRepository.find();
  }

  async findByProtocol(protocolo: string): Promise<Report> {
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
