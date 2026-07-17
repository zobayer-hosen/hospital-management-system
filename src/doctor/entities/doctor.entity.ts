import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../shared-core/entities/user.entity';
import { Department } from '../../admin/entities/department.entity';
import { Appointment } from '../../receptionist/entities/appointment.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Department, (department) => department.doctors, { onDelete: 'SET NULL' })
  department: Department;

  @ManyToMany(() => Department)
  @JoinTable()
  coveredDepartments: Department[];

  @Column()
  specialization: string;

  @Column({ default: 0 })
  experience: number;

  @Column({ nullable: true })
  availableTime: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.doctor)
  medicalRecords: MedicalRecord[];
}
