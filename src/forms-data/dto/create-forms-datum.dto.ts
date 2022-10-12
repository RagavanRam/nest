import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormsDatumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  formData: JSON;

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
  logs: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  formId: number;
}
