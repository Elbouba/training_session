import {  IsNotEmpty,  MinLength, MaxLength, IsEmail } from 'class-validator';

export class  RegisterDto {

    @IsEmail()
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
