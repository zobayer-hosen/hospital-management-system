import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', '12345'), // Replace with your database password or set DB_PASSWORD in your .env file
  database: configService.get<string>('DB_NAME', 'hospital_db'), // Defaulting to your database name
  autoLoadEntities: true,
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Automatically creates database tables based on entities
});