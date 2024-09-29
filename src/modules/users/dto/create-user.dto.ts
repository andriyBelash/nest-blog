import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/types/enum';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role, { message: 'Role must be either admin or user' })
  readonly role: Role;
}
