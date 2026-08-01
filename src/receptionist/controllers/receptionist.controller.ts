import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { ReceptionistService } from '../services/receptionist.service';
import { ReceptionistFormDto } from '../dto/receptionist-form.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('receptionists')
export class ReceptionistController {
  constructor(private readonly receptionistService: ReceptionistService) {}

  @Post('patients')
  async registerWalkInPatient(@Body() dto: ReceptionistFormDto) {
    return this.receptionistService.registerWalkInPatient(dto);
  }

  @Get('patients/:id')
  async getPatientById(@Param('id') id: string) {
    return this.receptionistService.getPatientById(id);
  }

  @Put('patients/:id')
  async updatePatient(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.receptionistService.updatePatient(id, dto);
  }
}