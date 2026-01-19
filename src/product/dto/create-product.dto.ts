import { IsNotEmpty, IsOptional, IsString, MinLength, IsNumber, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer'; // Pour la conversion automatique

export class CreateProductDto {
    
    @IsString()
    @IsNotEmpty({ message: "Le nom ne peut pas être vide" })
    @MinLength(3, { message: "Le nom doit faire au moins 3 caractères" })
    name: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @Type(() => Number) // Convertit la string de Postman en Number
    @IsNumber({}, { message: "Le prix doit être un nombre" })
    @Min(0, { message: "Le prix ne peut pas être inférieur à 0" })
    price: number;
     
    @Type(() => Number) // Convertit la string de Postman en Number
    @IsInt({ message: "La quantité doit être un nombre entier" })
    @Min(0, { message: "La quantité ne peut pas être négative" })
    quantity: number;
}