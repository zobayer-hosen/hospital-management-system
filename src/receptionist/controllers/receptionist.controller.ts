import { Controller, Post, Body } from '@nestjs/common';
import { ReceptionistService } from '../services/receptionist.service';
import { ReceptionistFormDto } from '../dto/receptionist-form.dto';

@Controller('receptionists')
export class ReceptionistController {
  constructor(private readonly receptionistService: ReceptionistService) {}

  @Post('patients')
  async registerWalkInPatient(@Body() dto: ReceptionistFormDto) {
    return this.receptionistService.registerWalkInPatient(dto);
  }
}