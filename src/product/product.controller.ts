import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard) // Protection de base : il faut être connecté
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get() // Tout utilisateur connecté peut voir
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id') // Tout utilisateur connecté peut voir un détail
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  // ROUTES RÉSERVÉES À L'ADMIN
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}