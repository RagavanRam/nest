import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class RolesDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: boolean;

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
  role: RoleDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
