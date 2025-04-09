import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
  FURTO = 'furto',
  ROUBO = 'roubo',
  AGRESSAO = 'agressao',
  DANO_AO_PATRIMONIO = 'dano_ao_patrimonio',
  OUTROS = 'outros',
}

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
  detalhes: string;

  @Column({ unique: true })
  protocolo: string;

  @CreateDateColumn()
  criadoEm: Date;

  @ManyToOne(() => User, (user) => user.reports, { nullable: true })
  user: User;
}
