import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
export class CreateProductDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;
     
    @IsInt()
    @IsNotEmpty()
    @Min(0)
    quantity: number;
}
