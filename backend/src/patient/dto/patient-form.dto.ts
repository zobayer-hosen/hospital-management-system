import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePatientProfileDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Doctor ID is required' })
  @IsString()
  doctorId: string;

  @IsNotEmpty({ message: 'Appointment date and time is required' })
  @IsString()
  appointmentDate: string;

  @IsNotEmpty({ message: 'Reason or symptoms for the consultation is required' })
  @IsString()
  reason: string;
}

export class RescheduleAppointmentDto {
  @IsNotEmpty({ message: 'New appointment date and time is required' })
  @IsString()
  newAppointmentDate: string;
}

export class CancelAppointmentDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetDoctorsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  department?: string;
}
