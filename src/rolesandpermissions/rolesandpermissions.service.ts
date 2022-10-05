import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Rolesandpermission } from './entities/rolesandpermission.entity';
import {
  CreateRolesandpermissionDto,
  UpdateRolesandpermissionDto,
} from './dto';
import { RolesAndPermissionsInterface } from './interfaces';

@Injectable()
export class RolesandpermissionsService {
  constructor(
    @InjectRepository(Rolesandpermission)
    private rolesandpermissionRepository: Repository<Rolesandpermission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createRolesandpermissionDto: CreateRolesandpermissionDto,
  ): Promise<RolesAndPermissionsInterface> {
    const errorMessages: string[] = [];
    const role = await this.roleRepository.findOne({
      where: { id: createRolesandpermissionDto.roleid },
    });
    const permission = await this.permissionRepository.findOne({
      where: { id: createRolesandpermissionDto.permissionid },
    });
    const roleandpermission = await this.rolesandpermissionRepository.findOne({
      where: {
        role: { id: createRolesandpermissionDto.roleid },
        permission: { id: createRolesandpermissionDto.permissionid },
      },
    });
    if (!role)
      throw new NotFoundException(
        `role not found with an id of ${createRolesandpermissionDto.roleid}`,
      );
    if (!permission)
      throw new NotFoundException(
        `permission not found with an id of ${createRolesandpermissionDto.permissionid}`,
      );
    if (roleandpermission)
      errorMessages.push(
        'the combination of role and permission already exist',
      );
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    return this.rolesandpermissionRepository.save({ role, permission });
  }

  async findAll(): Promise<RolesAndPermissionsInterface[]> {
    return this.rolesandpermissionRepository.find({
      relations: ['role', 'permission'],
    });
  }

  async findOne(id: number): Promise<RolesAndPermissionsInterface> {
    const roleandpermission = await this.rolesandpermissionRepository.findOne({
      where: { id },
      relations: ['role', 'permission'],
    });
    if (!roleandpermission)
      throw new NotFoundException(
        `role and permission not found with an id of ${id}`,
      );
    return roleandpermission;
  }

  async update(
    id: number,
    updateRolesandpermissionDto: UpdateRolesandpermissionDto,
  ): Promise<RolesAndPermissionsInterface> {
    const errorMessages: string[] = [];
    const existRoleAndPermission =
      await this.rolesandpermissionRepository.findOne({
        where: { id },
        relations: ['role', 'permission'],
      });
    if (!existRoleAndPermission)
      throw new NotFoundException(
        `role and permission not found with an id of ${updateRolesandpermissionDto.roleid}`,
      );
    const request = {
      role: existRoleAndPermission.role,
      permission: existRoleAndPermission.permission,
    };
    if (updateRolesandpermissionDto.roleid) {
      const role = await this.roleRepository.findOne({
        where: { id: updateRolesandpermissionDto.roleid },
      });
      if (!role)
        throw new NotFoundException(
          `role not found with an id of ${updateRolesandpermissionDto.roleid}`,
        );
      request.role = role;
    }
    if (updateRolesandpermissionDto.permissionid) {
      const permission = await this.permissionRepository.findOne({
        where: { id: updateRolesandpermissionDto.permissionid },
      });
      if (!permission)
        throw new NotFoundException(
          `permission not found with an id of ${updateRolesandpermissionDto.permissionid}`,
        );
      request.permission = permission;
    }
    if (
      updateRolesandpermissionDto.roleid &&
      updateRolesandpermissionDto.permissionid &&
      (updateRolesandpermissionDto.roleid !== existRoleAndPermission.role.id ||
        updateRolesandpermissionDto.permissionid !==
          existRoleAndPermission.permission?.id)
    ) {
      const roleandpermission = await this.rolesandpermissionRepository.findOne(
        {
          where: {
            role: { id: updateRolesandpermissionDto.roleid },
            permission: { id: updateRolesandpermissionDto.permissionid },
          },
        },
      );
      if (roleandpermission)
        errorMessages.push(
          'the combination of role and permission already exist',
        );
    } else if (
      updateRolesandpermissionDto.roleid &&
      !updateRolesandpermissionDto.permissionid &&
      existRoleAndPermission.role.id !== updateRolesandpermissionDto.roleid
    ) {
      const roleandpermission = await this.rolesandpermissionRepository.findOne(
        {
          where: {
            role: { id: updateRolesandpermissionDto.roleid },
            permission: { id: existRoleAndPermission.permission.id },
          },
        },
      );
      if (roleandpermission)
        errorMessages.push(
          'the combination of role and permission already exist',
        );
    } else if (
      updateRolesandpermissionDto.permissionid &&
      !updateRolesandpermissionDto.roleid &&
      existRoleAndPermission.permission.id !==
        updateRolesandpermissionDto.permissionid
    ) {
      const roleandpermission = await this.rolesandpermissionRepository.findOne(
        {
          where: {
            role: { id: existRoleAndPermission.role.id },
            permission: { id: updateRolesandpermissionDto.permissionid },
          },
        },
      );
      if (roleandpermission)
        errorMessages.push(
          'the combination of role and permission already exist',
        );
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.rolesandpermissionRepository.merge(
      existRoleAndPermission,
      updateRolesandpermissionDto,
      request,
    );
    return this.roleRepository.save(existRoleAndPermission);
  }

  async remove(id: number): Promise<RolesAndPermissionsInterface> {
    const existRoleAndPermission =
      await this.rolesandpermissionRepository.findOne({
        where: { id },
        relations: ['role', 'permission'],
      });
    if (!existRoleAndPermission)
      throw new NotFoundException(
        `role and permission not found with an id of ${id}`,
      );
    const deletedRoleAndPermission =
      await this.rolesandpermissionRepository.remove(existRoleAndPermission);
    return { ...deletedRoleAndPermission, id };
  }
}
