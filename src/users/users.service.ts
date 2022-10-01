import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const errorMessages: string[] = [];
    const username = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    const email = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (username) errorMessages.push('username is already exist');
    if (email) errorMessages.push('email is already exist');
    if (errorMessages.length)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: errorMessages,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    const hash = await bcrypt.hash(createUserDto.password, 12);
    return this.userRepository.save({ ...createUserDto, password: hash });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: { username: false },
    });
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        `user not found with an id of ${id}`,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        `user not found with an id of ${id}`,
        HttpStatus.NOT_FOUND,
      );
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
    if (errorMessages.length)
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: errorMessages,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        `user not found with an id of ${id}`,
        HttpStatus.NOT_FOUND,
      );
    return await this.userRepository.remove(user);
  }
}
