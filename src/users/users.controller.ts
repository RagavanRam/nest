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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { LocalAuthGaurd } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto, LocalSigninDto, UpdateUserDto, UserDto } from './dto';
import { UserInterface } from './interfaces';

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
@ApiTags('users')
@Controller('local')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOkResponse({ description: 'OK', type: UserDto })
  @Post('signup')
  signUpLocal(@Body() createUserDto: CreateUserDto): Promise<UserInterface> {
    return this.usersService.create(createUserDto);
  }

  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            user: { $ref: getSchemaPath(UserDto) },
          },
        },
      },
    },
  })
  @ApiBody({ type: LocalSigninDto })
  @UseGuards(LocalAuthGaurd)
  @Post('signin')
  signInLocal(@Request() request: any): any {
    return this.authService.signin(request.user);
  }

  @ApiOkResponse({
    description: 'OK',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(UserDto) },
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll(): Promise<UserInterface[]> {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ description: 'OK', type: UserDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  findOne(@Param('id') id: string): Promise<UserInterface> {
    return this.usersService.findOne(id);
  }

  @ApiOkResponse({ description: 'OK', type: UserDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOkResponse({ description: 'OK', type: UserDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  remove(@Param('id') id: string): Promise<UserInterface> {
    return this.usersService.remove(id);
  }
}
