import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentStatusDto } from '../dto/appointment-form.dto';

@Controller('receptionists/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async listAppointments() {
    return this.appointmentService.listAppointments();
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: AppointmentStatusDto,
  ) {
    return this.appointmentService.updateStatus(id, dto);
  }

  @Delete(':id')
  async cancelAppointment(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(id);
  }
}