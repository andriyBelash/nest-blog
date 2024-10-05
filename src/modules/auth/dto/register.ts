import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/common/types/enum';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: 'invalid_email_format' })
  email: string;

  @MinLength(6, { message: 'min_length_6' })
  password: string;

  @IsEnum(Role)
  role: Role;
}
