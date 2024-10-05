import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'invalid_email_format' })
  email: string;

  @MinLength(6, { message: 'min_length_6' })
  password: string;
}
