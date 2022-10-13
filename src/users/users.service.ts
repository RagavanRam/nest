import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import {
  CreateUserDto,
  ResetPasswordFinishDto,
  ResetPasswordInitDto,
  UpdateUserDto,
  UserTransformDto,
} from './dto';
import { UserInterface } from './interfaces';
import { Role } from 'src/roles/entities/role.entity';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const errorMessages: string[] = [];
    const request = { role: null };
    const username = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    const email = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (createUserDto.roleid) {
      const role = await this.roleRepository.findOne({
        where: { id: createUserDto.roleid },
        relations: ['permissions'],
      });
      if (!role)
        throw new NotFoundException(
          `role not found with an id of ${createUserDto.roleid}`,
        );
      request.role = role;
    }
    if (username) errorMessages.push('username is already exist');
    if (email) errorMessages.push('email is already exist');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    const hash = await bcrypt.hash(createUserDto.password, 12);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.userRepository.save({
      ...createUserDto,
      password: hash,
      role: request.role,
    });
    return createdUser;
  }

  async findAll(): Promise<UserInterface[]> {
    const users = await this.userRepository.find({
      relations: ['role', 'role.permissions', 'role.permissions.permission'],
    });
    return users.map((user) => plainToClass(UserTransformDto, user));
  }

  async findOne(id: string): Promise<UserInterface | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
    if (!user)
      throw new NotFoundException(`user not found with an id of ${id}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...foundedUser } = user;
    return foundedUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
    if (!user)
      throw new NotFoundException(`user not found with an id of ${id}`);
    const errorMessages: string[] = [];
    const request: any = { role: user.role };
    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const username = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (username) errorMessages.push('username is already exist');
    }
    if (updateUserDto.email && user.email !== updateUserDto.email) {
      const email = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (email) errorMessages.push('email is already exist');
    }
    if (updateUserDto.roleid) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleid },
        relations: ['permissions'],
      });
      if (!role)
        throw new NotFoundException(
          `role not found with an id of ${updateUserDto.roleid}`,
        );
      request.role = role;
    }
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.userRepository.merge(user, updateUserDto, request);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(id: string): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user)
      throw new NotFoundException(`user not found with an id of ${id}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...deletedUser } = await this.userRepository.remove(user);
    return { ...deletedUser, id };
  }

  async resetPasswordInit(
    resetPasswordInit: ResetPasswordInitDto,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordInit.email },
    });

    if (!user)
      throw new NotFoundException(
        'No account associated with the provided email address.',
      );

    user.resetKey = uuidv4();

    await this.userRepository.save(user);

    const nodemailer = await this.emailService.sendResetPasswordMail(user);

    if (nodemailer.accepted.length) {
      return 'An email with password reset instructions has been sent to the provided email';
    }

    throw new InternalServerErrorException(
      'Error sending reset password email',
    );
  }

  async resetPasswordFinish(
    resetPasswordFinish: ResetPasswordFinishDto,
  ): Promise<string> {
    if (resetPasswordFinish.password !== resetPasswordFinish.confirmPassword)
      throw new UnprocessableEntityException(
        'Password and confirmation password do not match',
      );

    const user = await this.userRepository.findOne({
      where: { resetKey: resetPasswordFinish.resetKey },
    });

    if (!user)
      throw new NotFoundException(
        'No associated account for the provided reset key',
      );

    const hash = await bcrypt.hash(resetPasswordFinish.password, 12);

    await this.userRepository.save({ ...user, resetKey: null, password: hash });

    return 'Password reset request completed successfully';
  }
}
