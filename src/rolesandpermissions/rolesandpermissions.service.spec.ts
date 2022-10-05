import { Test, TestingModule } from '@nestjs/testing';
import { RolesandpermissionsService } from './rolesandpermissions.service';

describe('RolesandpermissionsService', () => {
  let service: RolesandpermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesandpermissionsService],
    }).compile();

    service = module.get<RolesandpermissionsService>(RolesandpermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
