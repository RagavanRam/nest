import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesandpermissionsModule } from './rolesandpermissions/rolesandpermissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    RolesandpermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
