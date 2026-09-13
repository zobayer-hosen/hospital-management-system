import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Department } from './entities/department.entity';
import { AdminController } from './controllers/admin.controller';
import { DepartmentController } from './controllers/department.controller';
import { AdminService } from './services/admin.service';
import { DepartmentService } from './services/department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Department])],
  controllers: [AdminController, DepartmentController],
  providers: [AdminService, DepartmentService],
  exports: [TypeOrmModule],
})
export class AdminModule {}
