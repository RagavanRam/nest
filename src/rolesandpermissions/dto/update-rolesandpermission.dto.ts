import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateRolesandpermissionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  roleid: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  permissionid: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  manage: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  create: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  read: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  update: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  delete: boolean;
}
