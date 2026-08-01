import { IsIn, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../shared-core/enums/appointment-status.enum';

export class AppointmentStatusDto {
  @IsNotEmpty()
  @IsIn([AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED])
  status: AppointmentStatus;
}