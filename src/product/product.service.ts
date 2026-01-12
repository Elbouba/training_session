import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()

export class ProductService {
  constructor ( private readonly prisma: PrismaService) {}
 async create(createProductDto: CreateProductDto) {
  try {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new BadRequestException('Ce produit existe déjà');
    }
    throw error;
  }
}


  async findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {id},
    })
  }
}
