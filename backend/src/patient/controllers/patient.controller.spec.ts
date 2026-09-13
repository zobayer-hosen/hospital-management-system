import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from '../services/patient.service';
import { JwtAuthGuard } from '../../shared-core/guards/jwt-auth.guard';
import { PatientRolesGuard } from '../security/patient-roles.guard';
import { JwtService } from '@nestjs/jwt';

describe('PatientController', () => {
  let controller: PatientController;
  let patientService: Partial<PatientService>;

  beforeEach(async () => {
    patientService = {
      getProfile: jest.fn().mockResolvedValue({
        id: 'p1',
        gender: 'male',
        user: { id: 'u1', name: 'Rahim', email: 'rahim@test.com' },
      }),
      updateProfile: jest.fn().mockResolvedValue({
        id: 'p1',
        phone: '+8801700000000',
      }),
      getDoctors: jest.fn().mockResolvedValue([
        {
          id: 'd1',
          specialization: 'Cardiologist',
          user: { name: 'Dr. Mahmud' },
        },
      ]),
      getDoctorById: jest.fn().mockResolvedValue({
        id: 'd1',
        specialization: 'Cardiologist',
      }),
      getAppointments: jest.fn().mockResolvedValue([
        { id: 'a1', status: 'pending', reason: 'Fever' },
      ]),
      createAppointment: jest.fn().mockResolvedValue({
        id: 'a1',
        status: 'pending',
      }),
      getAppointmentById: jest.fn().mockResolvedValue({
        id: 'a1',
        status: 'pending',
      }),
      rescheduleAppointment: jest.fn().mockResolvedValue({
        id: 'a1',
        status: 'pending',
      }),
      cancelAppointment: jest.fn().mockResolvedValue({
        id: 'a1',
        status: 'cancelled',
      }),
      getMedicalRecords: jest.fn().mockResolvedValue([
        { id: 'm1', diagnosis: 'Flu' },
      ]),
      getMedicalRecordById: jest.fn().mockResolvedValue({
        id: 'm1',
        diagnosis: 'Flu',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: patientService,
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        JwtAuthGuard,
        PatientRolesGuard,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PatientRolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PatientController>(PatientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return patient profile', async () => {
    const res = await controller.getProfile('u1');
    expect(patientService.getProfile).toHaveBeenCalledWith('u1');
    expect(res).toHaveProperty('id', 'p1');
  });

  it('should return doctors list', async () => {
    const res = await controller.getDoctors({});
    expect(patientService.getDoctors).toHaveBeenCalled();
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].specialization).toBe('Cardiologist');
  });

  it('should return doctor details by ID', async () => {
    const res = await controller.getDoctorById('d1');
    expect(patientService.getDoctorById).toHaveBeenCalledWith('d1');
    expect(res.id).toBe('d1');
  });

  it('should return appointments', async () => {
    const res = await controller.getAppointments('u1');
    expect(patientService.getAppointments).toHaveBeenCalledWith('u1');
    expect(res).toHaveLength(1);
  });

  it('should create an appointment', async () => {
    const res = await controller.createAppointment('u1', {
      doctorId: 'd1',
      appointmentDate: '2026-10-01T10:00:00Z',
      reason: 'Checkup',
    });
    expect(patientService.createAppointment).toHaveBeenCalledWith('u1', expect.anything());
    expect(res.status).toBe('pending');
  });

  it('should reschedule an appointment', async () => {
    const res = await controller.rescheduleAppointment('u1', 'a1', {
      newAppointmentDate: '2026-10-02T10:00:00Z',
    });
    expect(patientService.rescheduleAppointment).toHaveBeenCalledWith('u1', 'a1', expect.anything());
    expect(res.id).toBe('a1');
  });

  it('should cancel an appointment', async () => {
    const res = await controller.cancelAppointment('u1', 'a1', {
      reason: 'Feeling better',
    });
    expect(patientService.cancelAppointment).toHaveBeenCalledWith('u1', 'a1', expect.anything());
    expect(res.status).toBe('cancelled');
  });

  it('should return medical records', async () => {
    const res = await controller.getMedicalRecords('u1');
    expect(patientService.getMedicalRecords).toHaveBeenCalledWith('u1');
    expect(res[0].diagnosis).toBe('Flu');
  });

  it('should return medical record detail', async () => {
    const res = await controller.getMedicalRecordById('u1', 'm1');
    expect(patientService.getMedicalRecordById).toHaveBeenCalledWith('u1', 'm1');
    expect(res.id).toBe('m1');
  });
});
