import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientController } from './controllers/patient.controller';
import { PatientAuthController } from './controllers/patient-auth.controller';
import { PatientService } from './services/patient.service';
import { PatientAuthService } from './services/patient-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController, PatientAuthController],
  providers: [PatientService, PatientAuthService],
  exports: [TypeOrmModule],
})
export class PatientModule {}
