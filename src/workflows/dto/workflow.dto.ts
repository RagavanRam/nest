import { ApiProperty } from '@nestjs/swagger';

export class WorkflowDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  workflow: JSON;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
