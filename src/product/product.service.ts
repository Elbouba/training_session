import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto, userId: string, imageUrl?: string) {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          price: Number(createProductDto.price),
          quantity: Number(createProductDto.quantity),
          userId: userId,
          imageUrl: imageUrl,
        },
      });
      return { message: 'Produit créé avec succès', product };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Ce produit existe déjà');
      }
      throw error;
    }
  }

  async findAll(userId: string, userRole: string) {
    const filter = userRole === 'ADMIN' ? { isActive: true } : { isActive: true, userId: userId };
    const products = await this.prisma.product.findMany({
      where: filter,
      include: { createdBy: { select: { firstName: true, lastName: true, role: true } } }
    });
    return { message: userRole === 'ADMIN' ? 'Liste globale (Admin)' : 'Vos produits', products };
  }

  async findOne(id: number, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { createdBy: { select: { firstName: true, lastName: true, id: true } } }
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Produit ${id} non trouvé ou archivé`);
    }

    if (userRole !== 'ADMIN' && product.userId !== userId) {
      throw new ForbiddenException("Accès refusé");
    }

    return { message: 'Produit récupéré avec succès', product };
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: string, userRole: string, newImageUrl?: string) {
    const response = await this.findOne(id, userId, userRole);
    const oldProduct = response.product;

    // Suppression de l'ancienne image si une nouvelle est uploadée
    if (newImageUrl && oldProduct.imageUrl) {
      const fileName = oldProduct.imageUrl.split('/').pop();
      if (fileName) {
        const oldPath = join(process.cwd(), 'uploads', fileName);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          price: updateProductDto.price ? Number(updateProductDto.price) : undefined,
          quantity: updateProductDto.quantity ? Number(updateProductDto.quantity) : undefined,
          imageUrl: newImageUrl ? newImageUrl : oldProduct.imageUrl,
        },
      });
      return { message: 'Produit mis à jour avec succès', product: updatedProduct };
    } catch (error) {
      throw new BadRequestException("Erreur lors de la mise à jour");
    }
  }

  async remove(id: number, userId: string, userRole: string) {
    await this.findOne(id, userId, userRole);
    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
    return { message: 'Produit archivé avec succès', product };
  }

  async findArchived() {
    return {
      message: 'Liste des archives',
      products: await this.prisma.product.findMany({ where: { isActive: false } })
    };
  }

  async restore(id: number) {

    const product = await this.prisma.product.findUnique({
      where: { id },
    });
   if (!product) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas`);
    }
   if (product.isActive === true) {
      throw new BadRequestException(`Le produit "${product.name}" n'est pas archivé, il ne peut donc pas être restauré.`);
    }
    const restoredProduct = await this.prisma.product.update({
      where: { id },
      data: { isActive: true },
    });

    return {
      message: 'Produit restauré avec succès',
      product: restoredProduct
    };
  }

  async hardDelete(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Produit ${id} inexistant`);

    if (product.imageUrl) {
      const fileName = product.imageUrl.split('/').pop();
      if (fileName) {
        const filePath = join(process.cwd(), 'uploads', fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Produit et image supprimés définitivement' };
  }
}