import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsString
} from 'class-validator';

export class RegisterDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string; // firstName

  @IsNotEmpty()
  @IsString()
  lastName: string; // lastName

  @IsOptional()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(6)
  password: string;
}
