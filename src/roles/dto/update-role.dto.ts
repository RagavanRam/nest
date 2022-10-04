import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
