import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Doctor } from './doctor.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.medicalRecords, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.medicalRecords, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column()
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ type: 'text', nullable: true })
  report: string;

  @CreateDateColumn()
  createdAt: Date;
}
