import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
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

  @ApiProperty({ required: false, default: 'manage' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  action: string;

  @Exclude()
  logs: object;

  @ApiProperty({ required: false, default: [] })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  emails: [];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  formId: number;
}
