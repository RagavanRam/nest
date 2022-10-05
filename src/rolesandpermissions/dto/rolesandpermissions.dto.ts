import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from 'src/permissions/dto';
import { RoleDto } from 'src/roles/dto';

export class RolesAndPermissionsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: RoleDto;

  @ApiProperty()
  permission: PermissionDto;

  @ApiProperty()
  manage: boolean;

  @ApiProperty()
  create: boolean;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  update: boolean;

  @ApiProperty()
  delete: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
