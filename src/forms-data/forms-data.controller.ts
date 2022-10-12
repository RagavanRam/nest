import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { FormsDataService } from './forms-data.service';
import { CreateFormsDatumDto, FormsDatumDto, UpdateFormsDatumDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormDatumInterface } from './interfaces';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
@ApiTags('forms-data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forms-data')
export class FormsDataController {
  constructor(private readonly formsDataService: FormsDataService) {}

  @ApiOkResponse({ description: 'OK', type: FormsDatumDto })
  @Post()
  create(
    @Body() createFormsDatumDto: CreateFormsDatumDto,
  ): Promise<FormDatumInterface> {
    return this.formsDataService.create(createFormsDatumDto);
  }

  @ApiOkResponse({ description: 'OK', type: FormsDatumDto, isArray: true })
  @Get()
  findAll(): Promise<FormDatumInterface[]> {
    return this.formsDataService.findAll();
  }

  @ApiOkResponse({ description: 'OK', type: FormsDatumDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FormDatumInterface> {
    return this.formsDataService.findOne(+id);
  }

  @ApiOkResponse({ description: 'OK', type: FormsDatumDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormsDatumDto: UpdateFormsDatumDto,
    @Request() request: any,
  ): Promise<FormDatumInterface> {
    return this.formsDataService.update(
      +id,
      updateFormsDatumDto,
      request.user.id,
    );
  }

  @ApiOkResponse({ description: 'OK', type: FormsDatumDto })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<FormDatumInterface> {
    return this.formsDataService.remove(+id);
  }
}
