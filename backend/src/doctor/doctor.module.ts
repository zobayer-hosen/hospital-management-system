import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { DoctorController } from './controllers/doctor.controller';
import { MedicalRecordController } from './controllers/medical-record.controller';
import { DoctorService } from './services/doctor.service';
import { MedicalRecordService } from './services/medical-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, MedicalRecord])],
  controllers: [DoctorController, MedicalRecordController],
  providers: [DoctorService, MedicalRecordService],
  exports: [TypeOrmModule],
})
export class DoctorModule {}
