import { 
  Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(RolesGuard)
  @Get('archived')
  findArchived() {
    return this.productService.findArchived();
  }

  @UseGuards(RolesGuard)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.productService.restore(+id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.productService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.productService.findOne(+id, req.user.userId, req.user.role);
  }

  // --- NOUVEAU : Création avec Upload d'image ---
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(
    @Body() dto: CreateProductDto, 
    @Req() req: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.productService.create(dto, req.user.userId, imageUrl);
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