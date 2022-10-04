import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/index';
import { PermissionInterface } from './interfaces/index';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionInterface> {
    const errorMessages: string[] = [];
    const name = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });
    if (name) errorMessages.push('permission name already exist.');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    return this.permissionRepository.save(createPermissionDto);
  }

  async findAll(): Promise<PermissionInterface[]> {
    return this.permissionRepository.find();
  }

  async findOne(id: number): Promise<PermissionInterface> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`permission not found with an id of ${id}`);
    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionInterface> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`permission not found with an id of ${id}`);
    const errorMessages: string[] = [];
    if (
      updatePermissionDto.name &&
      permission.name !== updatePermissionDto.name
    ) {
      const name = await this.permissionRepository.findOne({
        where: {
          name: updatePermissionDto.name,
        },
      });
      if (name) errorMessages.push('permission name already exist.');
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.permissionRepository.merge(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<PermissionInterface> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`permission not found with an id of ${id}`);
    const deletedPermission = await this.permissionRepository.remove(
      permission,
    );
    return { ...deletedPermission, id };
  }
}
