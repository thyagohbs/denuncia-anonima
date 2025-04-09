import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProtocoloService } from './services/protocolo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController, ProtocoloService],
  providers: [ReportsService, ProtocoloService],
  exports: [ReportsService],
})
export class ReportsModule {}
