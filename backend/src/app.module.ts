import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SharedCoreModule } from './shared-core/shared-core.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { ReceptionistModule } from './receptionist/receptionist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    DatabaseModule,
    SharedCoreModule,
    AdminModule,
    DoctorModule,
    PatientModule,
    ReceptionistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
