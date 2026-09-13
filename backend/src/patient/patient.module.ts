import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Patient } from './entities/patient.entity';
import { User } from '../shared-core/entities/user.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Department } from '../admin/entities/department.entity';
import { Appointment } from '../receptionist/entities/appointment.entity';
import { MedicalRecord } from '../doctor/entities/medical-record.entity';

import { PatientController } from './controllers/patient.controller';
import { PatientAuthController } from './controllers/patient-auth.controller';
import { PatientService } from './services/patient.service';
import { PatientAuthService } from './services/patient-auth.service';
import { JwtAuthGuard } from '../shared-core/guards/jwt-auth.guard';
import { PatientRolesGuard } from './security/patient-roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      Doctor,
      Department,
      Appointment,
      MedicalRecord,
    ]),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'carepoint_hospital_jwt_secret_key_2026',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PatientController, PatientAuthController],
  providers: [
    PatientService,
    PatientAuthService,
    JwtAuthGuard,
    PatientRolesGuard,
  ],
  exports: [
    TypeOrmModule,
    PatientService,
    PatientAuthService,
    JwtAuthGuard,
    PatientRolesGuard,
  ],
})
export class PatientModule {}
