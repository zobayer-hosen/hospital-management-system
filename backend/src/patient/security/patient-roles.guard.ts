import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../shared-core/enums/role.enum';

@Injectable()
export class PatientRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== Role.PATIENT) {
      throw new ForbiddenException('Access denied: Patient role required');
    }

    return true;
  }
}
