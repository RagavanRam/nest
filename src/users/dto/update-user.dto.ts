import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @Exclude()
  email?: string;

  @Exclude()
  password?: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsNumber()
  roleid: number;
}
