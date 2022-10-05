import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from 'src/permissions/dto';

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  permissions: PermissionDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
