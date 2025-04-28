import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../enums/report-type.enum';

export class LocalizacaoDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  endereco?: string;
}

export class CreateReportDto {
  @IsEnum(ReportType)
  @IsNotEmpty()
  tipo: ReportType;

  @IsObject()
  @ValidateNested()
  @Type(() => LocalizacaoDto)
  localizacao: LocalizacaoDto;

  @IsString()
  @IsNotEmpty()
  descricaoOcorrido: string;

  @IsString()
  @IsOptional()
  descricaoSuspeito?: string;
}
