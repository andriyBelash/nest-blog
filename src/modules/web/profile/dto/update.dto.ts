import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'invalid_email_format' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'min_length_3' })
  username?: string;
}
