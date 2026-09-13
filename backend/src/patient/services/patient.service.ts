import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from '../entities/patient.entity';
import { User } from '../../shared-core/entities/user.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Department } from '../../admin/entities/department.entity';
import { Appointment } from '../../receptionist/entities/appointment.entity';
import { MedicalRecord } from '../../doctor/entities/medical-record.entity';
import { AppointmentStatus } from '../../shared-core/enums/appointment-status.enum';
import { Role } from '../../shared-core/enums/role.enum';
import {
  UpdatePatientProfileDto,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  CancelAppointmentDto,
  GetDoctorsQueryDto,
} from '../dto/patient-form.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
  ) {}

  /**
   * Helper to fetch or initialize a patient record by user id
   */
  private async getPatientByUserId(userId: string): Promise<Patient> {
    let patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!patient) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Patient user not found');
      }
      patient = this.patientRepository.create({ user });
      patient = await this.patientRepository.save(patient);
    }

    return patient;
  }

  // ==============================
  // PROFILE MANAGEMENT
  // ==============================

  async getProfile(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    return {
      id: patient.id,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      user: {
        id: patient.user?.id,
        name: patient.user?.name,
        email: patient.user?.email,
        phone: patient.user?.phone,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdatePatientProfileDto) {
    const patient = await this.getPatientByUserId(userId);

    if (dto.phone !== undefined && patient.user) {
      patient.user.phone = dto.phone.trim();
      await this.userRepository.save(patient.user);
    }

    if (dto.dateOfBirth !== undefined) {
      patient.dateOfBirth = dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : (null as any);
    }

    if (dto.gender !== undefined) {
      patient.gender = dto.gender;
    }

    if (dto.bloodGroup !== undefined) {
      patient.bloodGroup = dto.bloodGroup;
    }

    if (dto.address !== undefined) {
      patient.address = dto.address.trim();
    }

    const updated = await this.patientRepository.save(patient);

    return {
      id: updated.id,
      dateOfBirth: updated.dateOfBirth,
      gender: updated.gender,
      bloodGroup: updated.bloodGroup,
      address: updated.address,
      user: {
        id: patient.user?.id,
        name: patient.user?.name,
        email: patient.user?.email,
        phone: patient.user?.phone,
      },
    };
  }

  // ==============================
  // DOCTORS DIRECTORY
  // ==============================

  async getDoctors(query?: GetDoctorsQueryDto) {
    // Check if initial doctor seed is needed
    await this.seedInitialDoctorsIfEmpty();

    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.department', 'department');

    if (query?.search?.trim()) {
      const s = `%${query.search.trim().toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(user.name) LIKE :s OR LOWER(doctor.specialization) LIKE :s)',
        { s },
      );
    }

    if (query?.department?.trim()) {
      const d = `%${query.department.trim().toLowerCase()}%`;
      queryBuilder.andWhere('LOWER(department.name) LIKE :d', { d });
    }

    const doctors = await queryBuilder.getMany();

    return doctors.map((doc) => ({
      id: doc.id,
      specialization: doc.specialization,
      qualification: doc.qualification || 'MBBS, FCPS',
      experience: doc.experience,
      availableTime: doc.availableTime || '09:00 AM - 04:00 PM',
      department: {
        id: doc.department?.id,
        name: doc.department?.name || 'General Medicine',
      },
      user: {
        id: doc.user?.id,
        name: doc.user?.name,
        email: doc.user?.email,
        phone: doc.user?.phone,
      },
    }));
  }

  async getDoctorById(id: string) {
    const doc = await this.doctorRepository.findOne({
      where: { id },
      relations: { user: true, department: true },
    });

    if (!doc) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return {
      id: doc.id,
      specialization: doc.specialization,
      qualification: doc.qualification || 'MBBS, FCPS',
      experience: doc.experience,
      availableTime: doc.availableTime || '09:00 AM - 04:00 PM',
      department: {
        id: doc.department?.id,
        name: doc.department?.name || 'General Medicine',
      },
      user: {
        id: doc.user?.id,
        name: doc.user?.name,
        email: doc.user?.email,
        phone: doc.user?.phone,
      },
    };
  }

  // ==============================
  // APPOINTMENTS MANAGEMENT
  // ==============================

  async getAppointments(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    const appointments = await this.appointmentRepository.find({
      where: { patient: { id: patient.id } },
      relations: { doctor: { user: true, department: true } },
      order: { appointmentDate: 'DESC' },
    });

    return appointments.map((app) => ({
      id: app.id,
      appointmentDate: app.appointmentDate,
      status: app.status,
      reason: app.reason,
      doctor: {
        id: app.doctor?.id,
        specialization: app.doctor?.specialization,
        qualification: app.doctor?.qualification,
        user: {
          name: app.doctor?.user?.name,
          email: app.doctor?.user?.email,
          phone: app.doctor?.user?.phone,
        },
        department: app.doctor?.department?.name,
      },
    }));
  }

  async getAppointmentById(userId: string, appointmentId: string) {
    const patient = await this.getPatientByUserId(userId);

    const app = await this.appointmentRepository.findOne({
      where: { id: appointmentId, patient: { id: patient.id } },
      relations: { doctor: { user: true, department: true } },
    });

    if (!app) {
      throw new NotFoundException('Appointment not found');
    }

    return {
      id: app.id,
      appointmentDate: app.appointmentDate,
      status: app.status,
      reason: app.reason,
      doctor: {
        id: app.doctor?.id,
        specialization: app.doctor?.specialization,
        qualification: app.doctor?.qualification,
        user: {
          name: app.doctor?.user?.name,
          email: app.doctor?.user?.email,
          phone: app.doctor?.user?.phone,
        },
        department: app.doctor?.department?.name,
      },
    };
  }

  async createAppointment(userId: string, dto: CreateAppointmentDto) {
    const patient = await this.getPatientByUserId(userId);

    const doctor = await this.doctorRepository.findOne({
      where: { id: dto.doctorId },
      relations: { user: true, department: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const appDate = new Date(dto.appointmentDate);
    if (isNaN(appDate.getTime())) {
      throw new BadRequestException('Invalid appointment date format');
    }

    const appointment = this.appointmentRepository.create({
      patient,
      doctor,
      appointmentDate: appDate,
      reason: dto.reason.trim(),
      status: AppointmentStatus.PENDING,
    });

    const saved = await this.appointmentRepository.save(appointment);

    return {
      id: saved.id,
      appointmentDate: saved.appointmentDate,
      status: saved.status,
      reason: saved.reason,
      doctor: {
        id: doctor.id,
        specialization: doctor.specialization,
        user: {
          name: doctor.user?.name,
          email: doctor.user?.email,
        },
      },
    };
  }

  async rescheduleAppointment(
    userId: string,
    appointmentId: string,
    dto: RescheduleAppointmentDto,
  ) {
    const patient = await this.getPatientByUserId(userId);

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, patient: { id: patient.id } },
      relations: { doctor: { user: true } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot reschedule a cancelled appointment');
    }

    const newDate = new Date(dto.newAppointmentDate);
    if (isNaN(newDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (newDate <= new Date()) {
      throw new BadRequestException(
        'New appointment date must be scheduled in the future',
      );
    }

    appointment.appointmentDate = newDate;
    appointment.status = AppointmentStatus.PENDING;

    const updated = await this.appointmentRepository.save(appointment);

    return {
      id: updated.id,
      appointmentDate: updated.appointmentDate,
      status: updated.status,
      reason: updated.reason,
      doctor: {
        id: updated.doctor?.id,
        specialization: updated.doctor?.specialization,
        user: {
          name: updated.doctor?.user?.name,
          email: updated.doctor?.user?.email,
        },
      },
    };
  }

  async cancelAppointment(
    userId: string,
    appointmentId: string,
    dto: CancelAppointmentDto,
  ) {
    const patient = await this.getPatientByUserId(userId);

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, patient: { id: patient.id } },
      relations: { doctor: { user: true } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    if (dto.reason?.trim()) {
      appointment.reason = appointment.reason
        ? `${appointment.reason} (Cancelled: ${dto.reason.trim()})`
        : `Cancelled: ${dto.reason.trim()}`;
    }

    const updated = await this.appointmentRepository.save(appointment);

    return {
      id: updated.id,
      appointmentDate: updated.appointmentDate,
      status: updated.status,
      reason: updated.reason,
    };
  }

  // ==============================
  // MEDICAL RECORDS & PRESCRIPTIONS
  // ==============================

  async getMedicalRecords(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    const records = await this.medicalRecordRepository.find({
      where: { patient: { id: patient.id } },
      relations: { doctor: { user: true } },
      order: { createdAt: 'DESC' },
    });

    return records.map((rec) => ({
      id: rec.id,
      diagnosis: rec.diagnosis,
      prescription: rec.prescription,
      report: rec.report,
      createdAt: rec.createdAt,
      doctor: {
        id: rec.doctor?.id,
        specialization: rec.doctor?.specialization,
        user: {
          name: rec.doctor?.user?.name,
        },
      },
    }));
  }

  async getMedicalRecordById(userId: string, recordId: string) {
    const patient = await this.getPatientByUserId(userId);

    const rec = await this.medicalRecordRepository.findOne({
      where: { id: recordId, patient: { id: patient.id } },
      relations: { doctor: { user: true } },
    });

    if (!rec) {
      throw new NotFoundException('Medical record not found');
    }

    return {
      id: rec.id,
      diagnosis: rec.diagnosis,
      prescription: rec.prescription,
      report: rec.report,
      createdAt: rec.createdAt,
      doctor: {
        id: rec.doctor?.id,
        specialization: rec.doctor?.specialization,
        user: {
          name: rec.doctor?.user?.name,
        },
      },
    };
  }

  // ==============================
  // INITIAL SEED HELPER
  // ==============================

  private async seedInitialDoctorsIfEmpty(): Promise<void> {
    try {
      const count = await this.doctorRepository.count();
      if (count > 0) return;

      // Seed departments
      const departmentsData = [
        { name: 'Cardiology', description: 'Heart and cardiovascular care' },
        { name: 'Neurology', description: 'Brain and nervous system disorders' },
        { name: 'Pediatrics', description: 'Comprehensive child healthcare' },
        { name: 'Orthopedics', description: 'Bones, joints, and spine care' },
        { name: 'Dermatology', description: 'Skin, hair, and nail health' },
      ];

      const departments: Department[] = [];
      for (const d of departmentsData) {
        let dept = await this.departmentRepository.findOne({
          where: { name: d.name },
        });
        if (!dept) {
          dept = this.departmentRepository.create(d);
          dept = await this.departmentRepository.save(dept);
        }
        departments.push(dept);
      }

      // Seed sample doctors
      const sampleDoctors = [
        {
          name: 'Dr. Mahmud Hasan',
          email: 'dr.mahmud@hospital.com',
          phone: '+8801711111111',
          specialization: 'Cardiologist',
          qualification: 'MBBS, FCPS (Cardiology), FACC',
          experience: 12,
          department: departments[0],
          availableTime: '09:00 AM - 03:00 PM',
        },
        {
          name: 'Dr. Farzana Rahman',
          email: 'dr.farzana@hospital.com',
          phone: '+8801722222222',
          specialization: 'Neurologist',
          qualification: 'MBBS, MD (Neurology)',
          experience: 9,
          department: departments[1],
          availableTime: '10:00 AM - 04:00 PM',
        },
        {
          name: 'Dr. Tariqul Islam',
          email: 'dr.tariqul@hospital.com',
          phone: '+8801733333333',
          specialization: 'Pediatrician',
          qualification: 'MBBS, DCH, MRCPCH (UK)',
          experience: 8,
          department: departments[2],
          availableTime: '08:30 AM - 02:30 PM',
        },
      ];

      for (const docData of sampleDoctors) {
        let user = await this.userRepository.findOne({
          where: { email: docData.email },
        });
        if (!user) {
          user = this.userRepository.create({
            name: docData.name,
            email: docData.email,
            password: 'hashed_dummy_password_doctor',
            phone: docData.phone,
            role: Role.DOCTOR,
          });
          user = await this.userRepository.save(user);
        }

        const doctor = this.doctorRepository.create({
          user,
          department: docData.department,
          specialization: docData.specialization,
          qualification: docData.qualification,
          experience: docData.experience,
          availableTime: docData.availableTime,
        });
        await this.doctorRepository.save(doctor);
      }
    } catch (e) {
      // In case of parallel execution or constraint, ignore seeding failure
      console.warn('Initial doctor seeding notice:', e.message);
    }
  }
}
