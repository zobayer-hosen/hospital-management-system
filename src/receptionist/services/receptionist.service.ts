import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Receptionist } from '../entities/receptionist.entity';
import { User } from '../../shared-core/entities/user.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Role } from '../../shared-core/enums/role.enum';
import { ReceptionistFormDto } from '../dto/receptionist-form.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class ReceptionistService {
  constructor(
    @InjectRepository(Receptionist)
    private readonly receptionistRepo: Repository<Receptionist>,
    private readonly dataSource: DataSource,
  ) {}

  async registerWalkInPatient(dto: ReceptionistFormDto) {
    const existingUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

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
        tempPassword,
      };
    });
  }

  async getPatientById(id: string) {
    const patient = await this.dataSource.getRepository(Patient).findOne({
      where: { id },
      relations: { user: true },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async updatePatient(id: string, dto: UpdatePatientDto) {
    const patient = await this.dataSource.getRepository(Patient).findOne({
      where: { id },
      relations: { user: true },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (dto.dateOfBirth) patient.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.gender) patient.gender = dto.gender as any;
    if (dto.bloodGroup) patient.bloodGroup = dto.bloodGroup;
    if (dto.address) patient.address = dto.address;
    await this.dataSource.getRepository(Patient).save(patient);

    if (dto.name) patient.user.name = dto.name;
    if (dto.phone) patient.user.phone = dto.phone;
    await this.dataSource.getRepository(User).save(patient.user);

    return patient;
  }

}