import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Rolesandpermission } from 'src/rolesandpermissions/entities/rolesandpermission.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Rolesandpermission]),
    AuthModule,
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
