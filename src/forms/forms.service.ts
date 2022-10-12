import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from 'src/workflows/entities/workflow.entity';
import { Repository } from 'typeorm';

import { CreateFormDto, UpdateFormDto } from './dto';
import { Form } from './entities/form.entity';
import { FormInterface } from './interfaces';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form) private formRepository: Repository<Form>,
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<FormInterface> {
    const errorMessages: string[] = [];
    const request: any = { workflow: null };
    const name = await this.formRepository.findOne({
      where: { name: createFormDto.name },
    });
    if (name) errorMessages.push('form name already exist');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    if (createFormDto.workflowId) {
      const workflow = await this.workflowRepository.findOne({
        where: { id: createFormDto.workflowId },
      });
      request.workflow = workflow;
    }
    const form = { ...createFormDto, workflow: request.workflow };
    return this.formRepository.save(form);
  }

  async findAll(): Promise<FormInterface[]> {
    return this.formRepository.find({ relations: ['workflow'] });
  }

  async findOne(id: number): Promise<FormInterface> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['workflow', 'formsDatum'],
    });
    if (!form)
      throw new NotFoundException(`form not found with an id of ${id}`);
    return form;
  }

  async update(
    id: number,
    updateFormDto: UpdateFormDto,
  ): Promise<FormInterface> {
    const errorMessages: string[] = [];
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['workflow', 'formsDatum'],
    });
    if (!form)
      throw new NotFoundException(`form not found with an id of ${id}`);
    const request: any = { workflow: form.workflow };
    if (
      updateFormDto.workflowId &&
      updateFormDto.workflowId !== form.workflow.id
    ) {
      const workflow = await this.workflowRepository.findOne({
        where: { id: updateFormDto.workflowId },
      });
      request.workflow = workflow;
    }
    if (updateFormDto.name && updateFormDto.name !== form.name) {
      const name = await this.formRepository.findOne({
        where: { name: updateFormDto.name },
      });
      if (name) errorMessages.push('form name already exist');
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.formRepository.merge(form, updateFormDto, request);
    return this.formRepository.save(form);
  }

  async remove(id: number): Promise<FormInterface> {
    const form = await this.formRepository.findOne({
      where: { id },
    });
    if (!form)
      throw new NotFoundException(`form not found with an id of ${id}`);
    return this.formRepository.remove(form);
  }
}
