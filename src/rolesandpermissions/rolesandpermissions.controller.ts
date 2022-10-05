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

import { RolesandpermissionsService } from './rolesandpermissions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CreateRolesandpermissionDto,
  UpdateRolesandpermissionDto,
  RolesAndPermissionsDto,
} from './dto';
import { RolesAndPermissionsInterface } from './interfaces';

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
@ApiTags('roles-and-permissions (Middlewere)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rolesandpermissions')
export class RolesandpermissionsController {
  constructor(
    private readonly rolesandpermissionsService: RolesandpermissionsService,
  ) {}

  @ApiOkResponse({
    description: 'OK',
    type: RolesAndPermissionsDto,
  })
  @Post()
  create(
    @Body() createRolesandpermissionDto: CreateRolesandpermissionDto,
  ): Promise<RolesAndPermissionsInterface> {
    return this.rolesandpermissionsService.create(createRolesandpermissionDto);
  }

  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(RolesAndPermissionsDto) },
        },
      },
    },
  })
  @Get()
  findAll(): Promise<RolesAndPermissionsInterface[]> {
    return this.rolesandpermissionsService.findAll();
  }

  @ApiOkResponse({
    description: 'OK',
    type: RolesAndPermissionsDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<RolesAndPermissionsInterface> {
    return this.rolesandpermissionsService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'OK',
    type: RolesAndPermissionsDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolesandpermissionDto: UpdateRolesandpermissionDto,
  ): Promise<RolesAndPermissionsInterface> {
    return this.rolesandpermissionsService.update(
      +id,
      updateRolesandpermissionDto,
    );
  }

  @ApiOkResponse({
    description: 'OK',
    type: RolesAndPermissionsDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<RolesAndPermissionsInterface> {
    return this.rolesandpermissionsService.remove(+id);
  }
}
