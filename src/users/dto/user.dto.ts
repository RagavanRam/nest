import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RoleDto } from 'src/roles/dto';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  password: string;

  @ApiProperty()
  role: RoleDto;
}
