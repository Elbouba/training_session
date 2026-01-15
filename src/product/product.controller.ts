import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // --- ROUTES ADMIN (À mettre AVANT les routes avec :id) ---

  @UseGuards(RolesGuard) // Seul l'Admin peut voir la corbeille
  @Get('archived')
  findArchived() {
    return this.productService.findArchived();
  }

  @UseGuards(RolesGuard) // Seul l'Admin peut restaurer
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.productService.restore(+id);
  }

  // --- ROUTES STANDARDS ---

  @Get()
  findAll(@Req() req: any) {
    return this.productService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.productService.findOne(+id, req.user.userId, req.user.role);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: any) {
    return this.productService.update(+id, dto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.productService.remove(+id, req.user.userId, req.user.role);
  }
}