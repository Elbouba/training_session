import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      return {
        message: 'Produit créé avec succès',
        product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Ce produit existe déjà');
      }
      throw error;
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return {
      message: 'Liste des produits récupérée avec succès',
      products,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    return {
      message: 'Produit récupéré avec succès',
      product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      return {
        message: 'Produit mis à jour avec succès',
        product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const product = await this.prisma.product.delete({ where: { id } });
      return {
        message: 'Produit supprimé avec succès',
        product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
