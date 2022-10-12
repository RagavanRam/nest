import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { FormsService } from './forms.service';
import { CreateFormDto, FormDto, UpdateFormDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormInterface } from './interfaces';

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
@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOkResponse({ description: 'OK', type: FormDto })
  @Post()
  create(@Body() createFormDto: CreateFormDto): Promise<FormInterface> {
    return this.formsService.create(createFormDto);
  }

  @ApiOkResponse({ description: 'OK', type: FormDto, isArray: true })
  @Get()
  findAll(): Promise<FormInterface[]> {
    return this.formsService.findAll();
  }

  @ApiOkResponse({ description: 'OK', type: FormDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FormInterface> {
    return this.formsService.findOne(+id);
  }

  @ApiOkResponse({ description: 'OK', type: FormDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<FormInterface> {
    return this.formsService.update(+id, updateFormDto);
  }

  @ApiOkResponse({ description: 'OK', type: FormDto })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FormInterface> {
    return this.formsService.remove(+id);
  }
}
