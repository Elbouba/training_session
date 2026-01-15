import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    
    @IsString()
    @IsNotEmpty({ message: "Le nom ne peut pas être vide" })
    @MinLength(3, { message: "Le nom doit faire au moins 3 caractères" })
    name: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber({}, { message: "Le prix doit être un nombre" })
    @Min(0, { message: "Le prix ne peut pas être inférieur à 0" })
    
    price: number;
     
    @IsInt({ message: "La quantité doit être un nombre entier" })
    @Min(0, { message: "La quantité ne peut pas être négative" })
    quantity: number;
}