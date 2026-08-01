import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentStatusDto } from '../dto/appointment-form.dto';
import { JwtAuthGuard } from '../../shared-core/guards/jwt-auth.guard';
import { ReceptionistRolesGuard } from '../security/receptionist-roles.guard';
import { Roles } from '../../shared-core/decorators/roles.decorator';
import { Role } from '../../shared-core/enums/role.enum';

@Controller('receptionists/appointments')
@UseGuards(JwtAuthGuard, ReceptionistRolesGuard)
@Roles(Role.RECEPTIONIST)
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