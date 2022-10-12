import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Form } from './entities/form.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Workflow } from 'src/workflows/entities/workflow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Workflow])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
