import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Unique } from 'src/validators/decorators/unique.decorator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Unique([
    User,
    {
      select: 'entity.id',
      where: 'entity.username = :username',
      parameters: { username: 'value' },
    },
  ])
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
