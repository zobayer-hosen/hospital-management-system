import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../../shared-core/enums/appointment-status.enum';
import { AppointmentStatusDto } from '../dto/appointment-form.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async listAppointments() {
    return this.appointmentRepo.find({
        relations: {
        patient: { user: true },
        doctor: { user: true },
      },      
        order: { appointmentDate: 'ASC' },
    });
  }

  async updateStatus(id: string, dto: AppointmentStatusDto) {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    appointment.status = dto.status;
    return this.appointmentRepo.save(appointment);
  }

  async cancelAppointment(id: string) {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    appointment.status = AppointmentStatus.CANCELLED;
    await this.appointmentRepo.save(appointment);
    return { message: 'Appointment cancelled successfully' };
  }
  async getAppointmentById(id: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: {
        patient: { user: true },
        doctor: { user: true },
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }
}