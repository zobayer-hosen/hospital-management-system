import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Receptionist } from '../entities/receptionist.entity';
import { User } from '../../shared-core/entities/user.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Role } from '../../shared-core/enums/role.enum';
import { ReceptionistFormDto } from '../dto/receptionist-form.dto';

@Injectable()
export class ReceptionistService {
  constructor(
    @InjectRepository(Receptionist)
    private readonly receptionistRepo: Repository<Receptionist>,
    private readonly dataSource: DataSource,
  ) {}

  async registerWalkInPatient(dto: ReceptionistFormDto) {
    // Check if email already exists
    const existingUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate a temporary password and hash it
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Use a transaction so User + Patient are created together
    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: Role.PATIENT,
      });
      const savedUser = await manager.save(user);

      const patient = manager.create(Patient, {
        user: savedUser,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        address: dto.address,
      });
      const savedPatient = await manager.save(patient);

      return {
        id: savedPatient.id,
        name: savedUser.name,
        email: savedUser.email,
        tempPassword, // shown once so receptionist can share it with patient
      };
    });
  }
}