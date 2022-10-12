import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  workflow: JSON;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}
