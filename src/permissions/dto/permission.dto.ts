import { ApiProperty } from '@nestjs/swagger';
import { RolesDto } from './roles.dto';

export class PermissionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty({ isArray: true })
  roles: RolesDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
