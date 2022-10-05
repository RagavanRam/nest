import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePermissionDto, UpdatePermissionDto, PermissionDto } from './dto';
import { PermissionInterface } from './interfaces';

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
@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOkResponse({
    description: 'OK',
    type: PermissionDto,
  })
  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.create(createPermissionDto);
  }

  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(PermissionDto) },
        },
      },
    },
  })
  @Get()
  findAll(): Promise<PermissionInterface[]> {
    return this.permissionsService.findAll();
  }

  @ApiOkResponse({
    description: 'OK',
    type: PermissionDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PermissionInterface> {
    return this.permissionsService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'OK',
    type: PermissionDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @ApiOkResponse({
    description: 'OK',
    type: PermissionDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<PermissionInterface> {
    return this.permissionsService.remove(+id);
  }
}
