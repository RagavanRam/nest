import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRoleDto, UpdateRoleDto, RoleDto } from './dto/index';
import { RoleInterface } from './interfaces/index';
import { RolesService } from './roles.service';

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
@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({
    description: 'OK',
    type: RoleDto,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(RoleDto) },
        },
      },
    },
  })
  @Get()
  findAll(): Promise<RoleInterface[]> {
    return this.rolesService.findAll();
  }

  @ApiOkResponse({
    description: 'OK',
    type: RoleDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleInterface> {
    return this.rolesService.findOne(id);
  }

  @ApiOkResponse({
    description: 'OK',
    type: RoleDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleInterface> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOkResponse({
    description: 'OK',
    type: RoleDto,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<RoleInterface> {
    return this.rolesService.remove(id);
  }
}
