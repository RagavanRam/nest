import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/index';
import { UserInterface } from './interfaces/index';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const errorMessages: string[] = [];
    const username = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    const email = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (username) errorMessages.push('username is already exist');
    if (email) errorMessages.push('email is already exist');
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    const hash = await bcrypt.hash(createUserDto.password, 12);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.userRepository.save({
      ...createUserDto,
      password: hash,
    });
    return createdUser;
  }

  async findAll(): Promise<UserInterface[]> {
    const users = await this.userRepository.find();
    return users.map((user) => plainToClass(UserDto, user));
  }

  async findOne(id: string): Promise<UserInterface | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`user not found with an id of ${id}`);
    const errorMessages: string[] = [];
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
    if (errorMessages.length) throw new BadRequestException(errorMessages);
    this.userRepository.merge(user, updateUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(id: string): Promise<UserInterface> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`user not found with an id of ${id}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...deletedUser } = await this.userRepository.remove(user);
    return { ...deletedUser, id };
  }
}
