import { Test, TestingModule } from '@nestjs/testing';
import { RolesandpermissionsController } from './rolesandpermissions.controller';
import { RolesandpermissionsService } from './rolesandpermissions.service';

describe('RolesandpermissionsController', () => {
  let controller: RolesandpermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesandpermissionsController],
      providers: [RolesandpermissionsService],
    }).compile();

    controller = module.get<RolesandpermissionsController>(RolesandpermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
