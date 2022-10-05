import { Module } from '@nestjs/common';
import { RolesandpermissionsService } from './rolesandpermissions.service';
import { RolesandpermissionsController } from './rolesandpermissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rolesandpermission } from './entities/rolesandpermission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rolesandpermission, Role, Permission]),
    AuthModule,
  ],
  controllers: [RolesandpermissionsController],
  providers: [RolesandpermissionsService],
})
export class RolesandpermissionsModule {}
