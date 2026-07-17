import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { AppointmentStatus } from '../../shared-core/enums/appointment-status.enum';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ type: 'timestamptz' })
  appointmentDate: Date;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ nullable: true })
  reason: string;
}
