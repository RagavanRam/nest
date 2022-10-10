import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  config: JSON;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
