import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RoleInterface } from './interfaces';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    const errorMessages: string[] = [];
    const role = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (role) errorMessages.push('role name already exist.');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    return this.roleRepository.save(createRoleDto);
  }

  async findAll(): Promise<RoleInterface[]> {
    return this.roleRepository.find({
      relations: ['permissions', 'permissions.permission'],
    });
  }

  async findOne(id: number): Promise<RoleInterface> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'permissions.permission'],
    });
    if (!role)
      throw new NotFoundException(`role not found with an id of ${id}`);
    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleInterface> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new NotFoundException(`role not found with an id of ${id}`);
    const errorMessages: string[] = [];
    if (updateRoleDto.name && role.name !== updateRoleDto.name) {
      const name = this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (name) errorMessages.push('role name is already exist.');
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<RoleInterface> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new NotFoundException(`role not found with an id of ${id}`);
    const deletedRole = await this.roleRepository.remove(role);
    return { ...deletedRole, id };
  }
}
