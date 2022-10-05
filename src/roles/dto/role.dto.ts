import { ApiProperty } from '@nestjs/swagger';
import { PermissionsDto } from './permissions.dto';

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty({ isArray: true })
  permissions: PermissionsDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
