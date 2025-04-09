import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../entities/report.entity';

class LocalizacaoDto {
  @ApiProperty({ example: -23.5505 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -46.6333 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 'Av. Paulista, 1000', required: false })
  @IsString()
  @IsOptional()
  endereco?: string;
}

export class CreateReportDto {
  @ApiProperty({ enum: ReportType, example: ReportType.ROUBO })
  @IsEnum(ReportType, { message: 'Tipo de denúncia inválido' })
  @IsNotEmpty({ message: 'O tipo da denúncia é obrigatório' })
  tipo: ReportType;

  @ApiProperty({ type: LocalizacaoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizacaoDto)
  localizacao: LocalizacaoDto;

  @ApiProperty({ example: 'Descrição detalhada da ocorrência...' })
  @IsString()
  @IsNotEmpty({ message: 'Os detalhes da denúncia são obrigatórios' })
  detalhes: string;
}
