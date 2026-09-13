import { Test, TestingModule } from '@nestjs/testing';
import { PatientAuthController } from './patient-auth.controller';
import { PatientAuthService } from '../services/patient-auth.service';
import { RegisterPatientDto, LoginPatientDto } from '../dto/patient-auth.dto';

describe('PatientAuthController', () => {
  let controller: PatientAuthController;
  let authService: Partial<PatientAuthService>;

  beforeEach(async () => {
    authService = {
      register: jest.fn().mockResolvedValue({
        message: 'Patient registered successfully',
        user: { id: 'u1', name: 'Rahim', email: 'rahim@test.com', role: 'patient' },
        patientId: 'p1',
      }),
      login: jest.fn().mockResolvedValue({
        accessToken: 'fake_jwt_token',
        user: { id: 'u1', name: 'Rahim', email: 'rahim@test.com', role: 'patient' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientAuthController],
      providers: [
        {
          provide: PatientAuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<PatientAuthController>(PatientAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a patient', async () => {
    const dto: RegisterPatientDto = {
      name: 'Rahim',
      email: 'rahim@test.com',
      password: 'password123',
    };
    const res = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('patientId', 'p1');
    expect(res.user.role).toBe('patient');
  });

  it('should login a patient', async () => {
    const dto: LoginPatientDto = {
      email: 'rahim@test.com',
      password: 'password123',
    };
    const res = await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('accessToken', 'fake_jwt_token');
    expect(res.user.email).toBe('rahim@test.com');
  });
});
