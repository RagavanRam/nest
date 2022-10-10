import { Injectable } from '@nestjs/common';

import { CreateWorkflowDto, UpdateWorkflowDto } from './dto';

@Injectable()
export class WorkflowsService {
  create(createWorkflowDto: CreateWorkflowDto) {
    return 'This action adds a new workflow';
  }

  findAll() {
    return `This action returns all workflows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflow`;
  }

  update(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    return `This action updates a #${id} workflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }
}
