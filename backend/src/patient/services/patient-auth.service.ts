import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../../shared-core/entities/user.entity';
import { Patient } from '../entities/patient.entity';
import { Role } from '../../shared-core/enums/role.enum';
import { RegisterPatientDto, LoginPatientDto } from '../dto/patient-auth.dto';

@Injectable()
export class PatientAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterPatientDto) {
    const emailNormalized = dto.email.trim().toLowerCase();
    const existing = await this.userRepository.findOne({
      where: { email: emailNormalized },
    });

    if (existing) {
      throw new ConflictException('Email address is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      name: dto.name.trim(),
      email: emailNormalized,
      password: hashedPassword,
      phone: dto.phone?.trim(),
      role: Role.PATIENT,
    });

    const savedUser = await this.userRepository.save(user);

    const patient = this.patientRepository.create({
      user: savedUser,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      address: dto.address?.trim(),
    });

    const savedPatient = await this.patientRepository.save(patient);

    return {
      message: 'Patient registered successfully',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      patientId: savedPatient.id,
    };
  }

  async login(dto: LoginPatientDto) {
    const emailNormalized = dto.email.trim().toLowerCase();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = :email', { email: emailNormalized })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.role !== Role.PATIENT) {
      throw new UnauthorizedException(
        'Access restricted: Please log in using a Patient account',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        process.env.JWT_SECRET || 'carepoint_hospital_jwt_secret_key_2026',
      expiresIn: '7d',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
