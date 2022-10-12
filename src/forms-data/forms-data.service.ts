import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/forms/entities/form.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateFormsDatumDto, UpdateFormsDatumDto } from './dto';
import { FormsDatum } from './entities/forms-datum.entity';
import { FormDatumInterface } from './interfaces';

@Injectable()
export class FormsDataService {
  constructor(
    @InjectRepository(FormsDatum)
    private formsDatumRepository: Repository<FormsDatum>,
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createFormsDatumDto: CreateFormsDatumDto) {
    const form = await this.formRepository.findOne({
      where: { id: createFormsDatumDto.formId },
      relations: ['workflow'],
    });
    if (!form)
      throw new NotFoundException(
        `form not found with an id of ${createFormsDatumDto.formId}`,
      );
    const workflow = await this.addFormData(form, createFormsDatumDto);
    const formDatum = {
      ...createFormsDatumDto,
      form,
      stage: workflow.stage,
      status: workflow.status,
      logs: workflow.logs,
    };
    return this.formsDatumRepository.save(formDatum);
  }

  async findAll() {
    return this.formsDatumRepository.find({ relations: ['form'] });
  }

  async findOne(id: number): Promise<FormDatumInterface> {
    const formData = await this.formsDatumRepository.findOne({
      where: { id },
      relations: ['form', 'form.workflow'],
    });
    if (!formData)
      throw new NotFoundException(`formData not found with an id of ${id}`);
    return formData;
  }

  async update(
    id: number,
    updateFormsDatumDto: UpdateFormsDatumDto,
    userId: string,
  ): Promise<FormDatumInterface> {
    const formData = await this.formsDatumRepository.findOne({
      where: { id },
      relations: ['form', 'form.workflow'],
    });
    if (!formData)
      throw new NotFoundException(`formData not found with an id of ${id}`);
    const request: any = { form: formData.form };
    if (
      updateFormsDatumDto.formId &&
      updateFormsDatumDto.formId !== formData.form.id
    ) {
      const form = await this.formRepository.findOne({
        where: { id: updateFormsDatumDto.formId },
        relations: ['workflow'],
      });
      if (!form)
        throw new NotFoundException(
          `form not found with an id of ${updateFormsDatumDto.formId}`,
        );
      request.form = form;
    }
    const workflow: any = await this.workFlowEngine(
      userId,
      formData,
      request.form,
      updateFormsDatumDto,
    );
    this.formsDatumRepository.merge(
      formData,
      updateFormsDatumDto,
      request,
      workflow,
    );
    return this.formsDatumRepository.save(formData);
  }

  async remove(id: number): Promise<FormDatumInterface> {
    const formData = await this.formsDatumRepository.findOne({ where: { id } });
    if (!formData)
      throw new NotFoundException(`formData not found with an id of ${id}`);
    return this.formsDatumRepository.remove(formData);
  }

  async addFormData(form: Form, crateFormData?: CreateFormsDatumDto) {
    if (!form.workflow) {
      return {
        stage: 0,
        status: crateFormData?.status ? crateFormData?.status : 'submitted',
        logs: {
          0: {
            status: crateFormData?.status ? crateFormData?.status : 'submitted',
            user: null,
            date: new Date(),
          },
        },
      };
    }
    if (form.workflow[0]?.status) {
      return {
        stage: 0,
        status: form.workflow[0]?.status,
        logs: {
          0: {
            status: form.workflow[0]?.status,
            user: null,
            date: new Date(),
          },
        },
      };
    } else {
      return {
        stage: 0,
        status: 'submitted',
        logs: {
          0: {
            status: 'submitted',
            user: null,
            date: new Date(),
          },
        },
      };
    }
  }

  async workFlowEngine(
    userId: string,
    formData: FormsDatum,
    form: Form,
    updateFormsDatumDto: UpdateFormsDatumDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    const currentStage = formData.stage;
    const currentStatus = formData.status;
    const currentLogs = formData.logs;
    const logsLength = Object.keys(currentLogs).length;
    if (!form.workflow) {
      currentLogs[logsLength] = {
        status: updateFormsDatumDto.status
          ? updateFormsDatumDto.status
          : currentStatus,
        user,
        date: new Date(),
      };
      return { ...updateFormsDatumDto, logs: { ...currentLogs } };
    } else if (
      form.workflow &&
      formData.status === 'rejected' &&
      !updateFormsDatumDto.rejected
    ) {
      if (!(user.role.name === 'admin')) throw new ForbiddenException();
      if (form.workflow.workflow[0]?.status) {
        currentLogs[logsLength] = {
          status: form.workflow.workflow[0]?.status,
          user,
          date: new Date(),
        };
        return {
          ...updateFormsDatumDto,
          stage: 0,
          status: form.workflow.workflow[0]?.status,
          logs: { ...currentLogs },
        };
      } else {
        currentLogs[logsLength] = {
          status: 'submitted',
          user,
          date: new Date(),
        };
        return {
          ...updateFormsDatumDto,
          stage: 0,
          status: 'submitted',
          logs: { ...currentLogs },
        };
      }
    } else if (
      updateFormsDatumDto.rejected &&
      (user.role.name === form.workflow.workflow[currentStage]?.rolename ||
        user.role.name === 'admin')
    ) {
      currentLogs[logsLength] = {
        status: 'rejected',
        user,
        date: new Date(),
      };
      return {
        ...updateFormsDatumDto,
        stage: -1,
        status: 'rejected',
        logs: { ...currentLogs },
      };
    } else if (!updateFormsDatumDto.rejected) {
      const nextStage = currentStage + 1;
      if (form.workflow.workflow[nextStage]) {
        if (
          !form.workflow.workflow[nextStage]?.status ||
          !(form.workflow.workflow[currentStage]?.rolename === user.role.name)
        )
          throw new ForbiddenException();
        currentLogs[logsLength] = {
          status: form.workflow.workflow[nextStage]?.status,
          user,
          date: new Date(),
        };
        return {
          ...updateFormsDatumDto,
          stage: nextStage,
          status: form.workflow.workflow[nextStage]?.status,
          logs: { ...currentLogs },
        };
      } else {
        return {};
      }
    } else {
      throw new ForbiddenException();
    }
  }
}
