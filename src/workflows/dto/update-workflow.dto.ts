import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateWorkflowDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  workflow: JSON;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}
