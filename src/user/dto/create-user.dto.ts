import { IsEmpty, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {

    @IsEmpty()
    email: string;

    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;

    @IsNotEmpty()
    @MinLength(4) 
    @MaxLength(6)
    password: string;
}
