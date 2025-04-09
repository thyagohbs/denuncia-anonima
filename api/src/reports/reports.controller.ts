import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Report, ReportType } from './entities/report.entity';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova denúncia (anônima)' })
  @ApiResponse({
    status: 201,
    description: 'Denúncia criada com sucesso',
    type: Report,
  })
  createAnonymous(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }

  @Post('auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova denúncia (autenticada)' })
  @ApiResponse({
    status: 201,
    description: 'Denúncia criada com sucesso',
    type: Report,
  })
  createAuthenticated(
    @Request() req,
    @Body() createReportDto: CreateReportDto,
  ): Promise<Report> {
    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Get('protocolo/:protocolo')
  @ApiOperation({ summary: 'Buscar denúncia por protocolo' })
  @ApiResponse({
    status: 200,
    description: 'Denúncia encontrada',
    type: Report,
  })
  @ApiResponse({ status: 404, description: 'Denúncia não encontrada' })
  findByProtocol(@Param('protocolo') protocolo: string): Promise<Report> {
    return this.reportsService.findByProtocol(protocolo);
  }

  @Get('minhas-denuncias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar denúncias do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de denúncias',
    type: [Report],
  })
  findUserReports(@Request() req): Promise<Report[]> {
    return this.reportsService.findByUserId(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as denúncias' })
  @ApiQuery({ name: 'tipo', enum: ReportType, required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de denúncias',
    type: [Report],
  })
  findAll(@Query('tipo') tipo?: ReportType): Promise<Report[]> {
    return this.reportsService.findAll(tipo);
  }
}
