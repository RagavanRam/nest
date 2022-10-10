import { Test, TestingModule } from '@nestjs/testing';
import { FormsDataController } from './forms-data.controller';
import { FormsDataService } from './forms-data.service';

describe('FormsDataController', () => {
  let controller: FormsDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsDataController],
      providers: [FormsDataService],
    }).compile();

    controller = module.get<FormsDataController>(FormsDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
