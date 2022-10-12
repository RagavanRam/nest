import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowDto } from './dto';
import { WorkflowInterface } from './interfaces';

@ApiBadRequestResponse({
  description: 'Error: Bad Request',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', default: 400 },
          message: { type: 'array', items: { type: 'string' } },
          error: { type: 'string', default: 'Bad Request' },
        },
      },
    },
  },
})
@ApiUnauthorizedResponse({
  description: 'Error: Unauthorized',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', default: 401 },
          message: { type: 'string', default: 'Unauthorized' },
        },
      },
    },
  },
})
@ApiNotFoundResponse({
  description: 'Error: Not Found',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', default: 404 },
          message: { type: 'string' },
        },
      },
    },
  },
})
@ApiInternalServerErrorResponse({
  description: 'Error: Internal server error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', default: 500 },
          message: { type: 'string', default: 'Internal server error' },
        },
      },
    },
  },
})
@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @ApiOkResponse({ description: 'OK', type: WorkflowDto })
  @Post()
  create(
    @Body() createWorkflowDto: CreateWorkflowDto,
  ): Promise<WorkflowInterface> {
    return this.workflowsService.create(createWorkflowDto);
  }

  @ApiOkResponse({ description: 'OK', type: WorkflowDto, isArray: true })
  @Get()
  findAll(): Promise<WorkflowInterface[]> {
    return this.workflowsService.findAll();
  }

  @ApiOkResponse({ description: 'OK', type: WorkflowDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<WorkflowInterface> {
    return this.workflowsService.findOne(+id);
  }

  @ApiOkResponse({ description: 'OK', type: WorkflowDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<WorkflowInterface> {
    return this.workflowsService.update(+id, updateWorkflowDto);
  }

  @ApiOkResponse({ description: 'OK', type: WorkflowDto })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<WorkflowInterface> {
    return this.workflowsService.remove(+id);
  }
}
