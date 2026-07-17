import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receptionist } from './entities/receptionist.entity';
import { Appointment } from './entities/appointment.entity';
import { ReceptionistController } from './controllers/receptionist.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { ReceptionistService } from './services/receptionist.service';
import { AppointmentService } from './services/appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Receptionist, Appointment])],
  controllers: [ReceptionistController, AppointmentController],
  providers: [ReceptionistService, AppointmentService],
  exports: [TypeOrmModule],
})
export class ReceptionistModule {}
