import { ApiProperty } from '@nestjs/swagger';

export class FormsDatumDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  formData: JSON;

  @ApiProperty()
  stage: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  logs: object;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
