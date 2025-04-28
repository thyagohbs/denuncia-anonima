import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReportType })
  tipo: ReportType;

  @Column('json')
  localizacao: {
    latitude: number;
    longitude: number;
    endereco?: string;
  };

  @Column('text')
  descricaoOcorrido: string;

  @Column({ type: 'text', nullable: true })
  descricaoSuspeito?: string;

  @Column({ unique: true })
  protocolo: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.RECEBIDA,
  })
  status: ReportStatus;

  @ManyToOne(() => User, (user) => user.reports, { nullable: true })
  user: User;
}
export { ReportType };
