import { ApiProperty } from '@nestjs/swagger';

export class FormDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  config: JSON;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  emailTemplate: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
