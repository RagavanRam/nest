import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rolesandpermission } from 'src/rolesandpermissions/entities/rolesandpermission.entity';
import { User } from 'src/users/entities/user.entity';

import { RoleGuard } from './guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rolesandpermission])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class SharedModule {}
