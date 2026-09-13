import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { JwtAuthGuard } from '../../shared-core/guards/jwt-auth.guard';
import { PatientRolesGuard } from '../security/patient-roles.guard';
import { CurrentUser } from '../../shared-core/decorators/current-user.decorator';
import {
  UpdatePatientProfileDto,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  CancelAppointmentDto,
  GetDoctorsQueryDto,
} from '../dto/patient-form.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // ==============================
  // PROFILE ENDPOINTS
  // ==============================

  @Get('profile/me')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.patientService.getProfile(userId);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdatePatientProfileDto,
  ) {
    return this.patientService.updateProfile(userId, dto);
  }

  // ==============================
  // DOCTORS DIRECTORY ENDPOINTS
  // ==============================

  @Get('doctors')
  async getDoctors(@Query() query: GetDoctorsQueryDto) {
    return this.patientService.getDoctors(query);
  }

  @Get('doctors/:id')
  async getDoctorById(@Param('id') id: string) {
    return this.patientService.getDoctorById(id);
  }

  // ==============================
  // APPOINTMENTS ENDPOINTS
  // ==============================

  @Get('appointments')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async getAppointments(@CurrentUser('sub') userId: string) {
    return this.patientService.getAppointments(userId);
  }

  @Post('appointments')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAppointment(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.patientService.createAppointment(userId, dto);
  }

  @Get('appointments/:id')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async getAppointmentById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.patientService.getAppointmentById(userId, id);
  }

  @Patch('appointments/:id/reschedule')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async rescheduleAppointment(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.patientService.rescheduleAppointment(userId, id, dto);
  }

  @Patch('appointments/:id/cancel')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async cancelAppointment(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.patientService.cancelAppointment(userId, id, dto);
  }

  // ==============================
  // MEDICAL RECORDS ENDPOINTS
  // ==============================

  @Get('medical-records')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async getMedicalRecords(@CurrentUser('sub') userId: string) {
    return this.patientService.getMedicalRecords(userId);
  }

  @Get('medical-records/:id')
  @UseGuards(JwtAuthGuard, PatientRolesGuard)
  async getMedicalRecordById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.patientService.getMedicalRecordById(userId, id);
  }
}
