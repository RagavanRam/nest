import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/forms/entities/form.entity';
import { EmailService } from 'src/shared/services/email.service';
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
    private emailService: EmailService,
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
    const workflow = await this.workFlowEngine(
      'create',
      null,
      null,
      form,
      createFormsDatumDto,
    );
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
      'update',
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
    } else if (form.workflow && form.workflow.workflow[0]) {
      return {
        stage: 0,
        status: form.workflow.workflow[0]?.status
          ? form.workflow.workflow[0]?.status
          : 'submitted',
        logs: {
          0: {
            status: form.workflow.workflow[0]?.status
              ? form.workflow.workflow[0]?.status
              : 'submitted',
            user: null,
            date: new Date(),
          },
        },
      };
    }
  }

  async workFlowEngine(
    type: string,
    userId: string | null,
    formData: FormsDatum | null,
    form: Form,
    FormsDatumDto: UpdateFormsDatumDto | CreateFormsDatumDto,
  ) {
    if (type === 'create') {
      if (!form.workflow) {
        return {
          stage: 0,
          status: FormsDatumDto?.status ? FormsDatumDto?.status : 'submitted',
          logs: {
            0: {
              status: FormsDatumDto?.status
                ? FormsDatumDto?.status
                : 'submitted',
              user: null,
              date: new Date(),
            },
          },
        };
      } else if (form.workflow && form.workflow.workflow[0]) {
        if (form.workflow.workflow[0]?.notification) {
          for (const email of FormsDatumDto.emails) {
            await this.emailService.sendFormDataStatusMail({
              email,
              template: form.emailTemplate,
            });
          }
        }
        return {
          stage: 0,
          status: form.workflow.workflow[0]?.status
            ? form.workflow.workflow[0]?.status
            : 'submitted',
          logs: {
            0: {
              status: form.workflow.workflow[0]?.status
                ? form.workflow.workflow[0]?.status
                : 'submitted',
              user: null,
              date: new Date(),
            },
          },
        };
      }
    } else if (type === 'update') {
      const requestUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      const user = {
        id: requestUser.id,
        name: requestUser.username,
        role: requestUser.role.name,
      };
      const currentStage = formData.stage;
      const currentStatus = formData.status;
      const currentLogs = formData.logs;
      const logsLength = Object.keys(currentLogs).length;
      // if the workflow exist or not
      if (!form.workflow) {
        currentLogs[logsLength] = {
          status: FormsDatumDto.status ? FormsDatumDto.status : currentStatus,
          user,
          date: new Date(),
        };
        return { ...FormsDatumDto, logs: { ...currentLogs } };
      } else if (
        form.workflow &&
        (formData.status === 'rejected' || formData.status === 'modified') &&
        FormsDatumDto.action === 'approve'
      ) {
        if (!(requestUser.role.name === 'admin'))
          throw new ForbiddenException();
        if (form.workflow.workflow[0]?.status) {
          currentLogs[logsLength] = {
            status: form.workflow.workflow[0]?.status,
            user,
            date: new Date(),
          };
          return {
            ...FormsDatumDto,
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
            ...FormsDatumDto,
            stage: currentStage,
            status: currentStatus,
            logs: { ...currentLogs },
          };
        }
      } else if (FormsDatumDto.action === 'manage') {
        currentLogs[logsLength] = {
          status: 'modified',
          user,
          date: new Date(),
        };
        return {
          ...FormsDatumDto,
          stage: -1,
          status: 'modified',
          logs: { ...currentLogs },
        };
      } else if (
        FormsDatumDto.action === 'reject' &&
        (requestUser.role.name ===
          form.workflow.workflow[currentStage]?.rolename ||
          requestUser.username ===
            form.workflow.workflow[currentStage]?.username ||
          requestUser.role.name === 'admin')
      ) {
        currentLogs[logsLength] = {
          status: 'rejected',
          user,
          date: new Date(),
        };
        return {
          ...FormsDatumDto,
          stage: -1,
          status: 'rejected',
          logs: { ...currentLogs },
        };
      } else if (FormsDatumDto.action === 'approve') {
        const nextStage = currentStage + 1;
        if (form.workflow.workflow[nextStage]) {
          if (
            !form.workflow.workflow[nextStage]?.status ||
            !(
              form.workflow.workflow[currentStage]?.rolename ===
                requestUser.role.name ||
              form.workflow.workflow[currentStage]?.username ===
                requestUser.username
            )
          )
            throw new ForbiddenException();
          currentLogs[logsLength] = {
            status: form.workflow.workflow[nextStage]?.status,
            user,
            date: new Date(),
          };
          if (
            form.workflow.workflow[nextStage]?.notification &&
            formData.emails.length &&
            formData.form.emailTemplate
          ) {
            for (const email of formData.emails) {
              await this.emailService.sendFormDataStatusMail({
                email,
                template: formData.form.emailTemplate,
              });
            }
          }
          return {
            ...FormsDatumDto,
            stage: nextStage,
            status: form.workflow.workflow[nextStage]?.status,
            logs: { ...currentLogs },
          };
        } else {
          return;
        }
      } else {
        throw new ForbiddenException();
      }
    }
  }
}
