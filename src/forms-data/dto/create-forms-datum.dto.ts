import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormsDatumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  data: JSON;

  @Exclude()
  stage: number;

  @ApiProperty({ required: false, default: 'submitted' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  rejected: boolean;

  @Exclude()
  logs: JSON[];
}
