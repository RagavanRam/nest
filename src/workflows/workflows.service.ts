import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWorkflowDto, UpdateWorkflowDto } from './dto';
import { Workflow } from './entities/workflow.entity';
import { WorkflowInterface } from './interfaces';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  async create(
    createWorkflowDto: CreateWorkflowDto,
  ): Promise<WorkflowInterface> {
    const errorMessages: string[] = [];
    const workflow = await this.workflowRepository.findOne({
      where: { name: createWorkflowDto.name },
    });
    if (workflow) errorMessages.push('workflow name is already exist');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    return this.workflowRepository.save(createWorkflowDto);
  }

  async findAll(): Promise<WorkflowInterface[]> {
    return this.workflowRepository.find({ relations: ['forms'] });
  }

  async findOne(id: number): Promise<WorkflowInterface> {
    const workflow = await this.workflowRepository.findOne({
      where: { id },
      relations: ['forms'],
    });
    if (!workflow)
      throw new NotFoundException(`workflow not found with an id of ${id}`);
    return workflow;
  }

  async update(
    id: number,
    updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<WorkflowInterface> {
    const errorMessages: string[] = [];
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow)
      throw new NotFoundException(`workflow not found with an id of ${id}`);
    if (updateWorkflowDto.name && updateWorkflowDto.name !== workflow.name) {
      const name = await this.workflowRepository.findOne({
        where: { name: updateWorkflowDto.name },
      });
      if (name) errorMessages.push('workflow name is already exist');
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.workflowRepository.merge(workflow, updateWorkflowDto);
    return this.workflowRepository.save(workflow);
  }

  async remove(id: number): Promise<WorkflowInterface> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow)
      throw new NotFoundException(`workflow not found with an id of ${id}`);
    return this.workflowRepository.remove(workflow);
  }
}
