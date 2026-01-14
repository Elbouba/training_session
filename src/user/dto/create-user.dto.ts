import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean
} from 'class-validator';

export class CreateUserDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
