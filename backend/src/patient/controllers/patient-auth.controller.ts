import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PatientAuthService } from '../services/patient-auth.service';
import { RegisterPatientDto, LoginPatientDto } from '../dto/patient-auth.dto';

@Controller('patient/auth')
export class PatientAuthController {
  constructor(private readonly authService: PatientAuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterPatientDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginPatientDto) {
    return this.authService.login(dto);
  }
}
