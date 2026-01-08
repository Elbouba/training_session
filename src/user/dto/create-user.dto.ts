import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

    @IsEmpty()
    email: string;

    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;
}
