import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}


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
      include: {
        createdBy: { select: { firstName: true, lastName: true, role: true } }
      }
    });

    return {
      message: userRole === 'ADMIN' ? 'Liste globale (Admin)' : 'Vos produits',
      products,
    };
  }

  async findOne(id: number, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: { createdBy: { select: { firstName: true, lastName: true } } }
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Produit ${id} non trouvé ou archivé`);
    }

    if (userRole !== 'ADMIN' && product.userId !== userId) {
      throw new ForbiddenException("Accès refusé");
    }

    return { message: 'Produit récupéré avec succès', product };
  }

  
  async update(id: number, updateProductDto: UpdateProductDto, userId: string, userRole: string) {
    await this.findOne(id, userId, userRole);
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return { message: 'Produit mis à jour', product };
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
    const products = await this.prisma.product.findMany({
      where: { isActive: false },
      include: { createdBy: { select: { firstName: true, lastName: true } } }
    });
    return { message: 'Liste des archives', products };
  }

  async restore(id: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { isActive: true }
      });
      return { message: 'Produit restauré avec succès', product };
    } catch (error) {
      throw new NotFoundException(`Impossible de restaurer le produit ${id}`);
    }
  }

  async hardDelete(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Produit ${id} inexistant`);

  
    if (product.imageUrl) {
      const relativePath = product.imageUrl.startsWith('/') ? product.imageUrl.substring(1) : product.imageUrl;
      const filePath = join(process.cwd(), relativePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Produit et image supprimés définitivement' };
  }
}