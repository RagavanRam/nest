import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormsDatum } from './entities/forms-datum.entity';
import { FormsDataService } from './forms-data.service';
import { FormsDataController } from './forms-data.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormsDatum])],
  controllers: [FormsDataController],
  providers: [FormsDataService],
})
export class FormsDataModule {}
