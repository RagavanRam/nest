import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from 'src/permissions/dto';

export class PermissionsDto {
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
  permission: PermissionDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
