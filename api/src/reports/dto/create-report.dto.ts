import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../entities/report.entity';

class LocalizacaoDto {
  @ApiProperty({ example: -23.5505 })
  latitude: number;

  @ApiProperty({ example: -46.6333 })
  longitude: number;

  @ApiProperty({ example: 'Av. Paulista, 1000', required: false })
  endereco?: string;
}

export class CreateReportDto {
  @ApiProperty({ enum: ReportType, example: ReportType.ROUBO })
  @IsEnum(ReportType)
  tipo: ReportType;

  @ApiProperty({ type: LocalizacaoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizacaoDto)
  localizacao: LocalizacaoDto;

  @ApiProperty({ example: 'Descrição detalhada da ocorrência...' })
  @IsString()
  @IsNotEmpty()
  detalhes: string;
}
