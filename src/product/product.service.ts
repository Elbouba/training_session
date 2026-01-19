import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

 
  async create(createProductDto: CreateProductDto, userId: string, imageUrl?: string) {
    try {
      const product = await this.prisma.product.create({
       data: {
          ...createProductDto,
          price: Number(createProductDto.price),       // Sécurité : conversion en nombre
          quantity: Number(createProductDto.quantity), // Sécurité : conversion en nombre
          userId: userId,
          imageUrl: imageUrl, // <-- Enregistrement du chemin de l'image
        },
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

  // --- LECTURE GLOBALE (Isolée) ---
  async findAll(userId: string, userRole: string) {
    // Si Admin : voit tout + infos du créateur
    const filter = userRole === 'ADMIN' ? { isActive: true } : { isActive: true, userId: userId };
    
    const products = await this.prisma.product.findMany({
      where: filter,
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, role: true }
        }
      }
    });

    return {
      message: userRole === 'ADMIN' 
        ? 'Liste globale des produits récupérée avec succès (Admin)' 
        : 'Votre liste de produits récupérée avec succès',
      products,
    };
  }

  // --- LECTURE UNIQUE (Sécurisée) ---
  async findOne(id: number, userId: string, userRole: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: { createdBy: { select: { firstName: true, lastName: true } } }
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé ou archivé`);
    }

    // Vérification de propriété
    if (userRole !== 'ADMIN' && product.userId !== userId) {
      throw new ForbiddenException("Accès refusé : ce produit ne vous appartient pas");
    }

    return {
      message: 'Produit récupéré avec succès',
      product,
    };
  }

  // --- MISE À JOUR (Sécurisée) ---
  async update(id: number, updateProductDto: UpdateProductDto, userId: string, userRole: string) {
    // On vérifie d'abord l'existence et la propriété
    await this.findOne(id, userId, userRole);

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
      throw error;
    }
  }

  // --- ARCHIVAGE (Soft Delete sécurisé) ---
  async remove(id: number, userId: string, userRole: string) {
    // On vérifie d'abord l'existence et la propriété
    await this.findOne(id, userId, userRole);

    try {
      const product = await this.prisma.product.update({ 
        where: { id },
        data: { isActive: false } 
      });
      return {
        message: 'Produit archivé (historisé) avec succès',
        product,
      };
    } catch (error) {
      throw error;
    }
  }


  // --- DANS PRODUCT.SERVICE.TS ---

// 1. Voir uniquement les produits supprimés (ADMIN ONLY)
async findArchived() {
  const products = await this.prisma.product.findMany({
    where: { isActive: false }, // On prend l'inverse
    include: {
      createdBy: { select: { firstName: true, lastName: true } }
    }
  });

  return {
    message: 'Liste des produits archivés récupérée avec succès',
    products,
  };
}

// 2. Restaurer un produit (ADMIN ONLY)
async restore(id: number) {
  try {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: true } // On repasse à true
    });

    return {
      message: 'Produit restauré avec succès',
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