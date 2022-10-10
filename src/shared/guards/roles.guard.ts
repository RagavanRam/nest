import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rolesandpermission } from 'src/rolesandpermissions/entities/rolesandpermission.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflecter: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Rolesandpermission)
    private rolesandpermissionRepository: Repository<Rolesandpermission>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const required = this.reflecter.getAllAndOverride<string[]>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    return this.userRepository
      .findOne({ where: { id: user?.id }, relations: ['role'] })
      .then(async (res) => {
        if (res) {
          const user = res;
          if (!user.role) {
            return false;
          }
          const rolesandpermission =
            await this.rolesandpermissionRepository.findOne({
              where: {
                role: {
                  name: user.role.name,
                },
                permission: { name: required[0] },
              },
            });
          if (!rolesandpermission) {
            return false;
          }
          return (
            rolesandpermission[required[1]] === true ||
            rolesandpermission.manage == true
          );
        }
        return false;
      });
  }
}
