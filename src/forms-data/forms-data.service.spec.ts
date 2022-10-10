import { Test, TestingModule } from '@nestjs/testing';
import { FormsDataService } from './forms-data.service';

describe('FormsDataService', () => {
  let service: FormsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsDataService],
    }).compile();

    service = module.get<FormsDataService>(FormsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
