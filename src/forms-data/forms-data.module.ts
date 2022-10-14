import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormsDatum } from './entities/forms-datum.entity';
import { FormsDataService } from './forms-data.service';
import { FormsDataController } from './forms-data.controller';
import { Form } from 'src/forms/entities/form.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormsDatum, Form, User]),
    AuthModule,
    SharedModule,
  ],
  controllers: [FormsDataController],
  providers: [FormsDataService],
})
export class FormsDataModule {}
