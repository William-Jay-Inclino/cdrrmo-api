import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from './dto';
import { ItemCategory } from '@prisma/client';

@Injectable()
export class ItemCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemCategoryDto: CreateItemCategoryDto) {
    try {
      return await this.prisma.itemCategory.create({
        data: { ...createItemCategoryDto },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Item Category with the same data already exists.');
      } else {
        throw new InternalServerErrorException('Failed to create Item Category.');
      }
    }
  }

  async findAll() {
    return await this.prisma.itemCategory.findMany({
      where: {
        is_deleted: false
      }
    });
  }

  async findOne(id: string) {
    const itemCategory = await this.prisma.itemCategory.findUnique({
      where: { id, is_deleted: false },
    });

    if (!itemCategory) {
      throw new NotFoundException('itemCategory not found.');
    }

    console.log('find success')

    return itemCategory;
  }

  async update(id: string, updateItemCategoryDto: UpdateItemCategoryDto): Promise<ItemCategory> {
    const existingItemCategory = await this.findOne(id);
  
    const itemCategoryWithSameName = await this.prisma.itemCategory.findFirst({
      where: {
        name: updateItemCategoryDto.name,
        id: { not: id }, 
      },
    });
  
    if (itemCategoryWithSameName) {
      throw new ConflictException('Item Category with the same data already exists.');
    }
  
    const updatedItemCategory = await this.prisma.itemCategory.update({
      where: { id },
      data: { ...updateItemCategoryDto },
    })

    console.log('update success')
  
    return updatedItemCategory;
  }
  
  // async remove(id: string) {
  //   const existingItemCategory = await this.findOne(id);
  
  //   await this.prisma.itemCategory.delete({
  //     where: { id },
  //   });

  //   console.log('remove success')
  
  //   return true;
  // }

  async remove(id: string): Promise<{is_deleted: boolean}> {
		const existingData = await this.findOne(id);
	
		if (!existingData) {
			return {is_deleted: false}
		}
	
		await this.prisma.itemCategory.update({
			where: { id },
			data: {
				is_deleted: true,
			},
		});
	
		return {is_deleted: true}
	}

  async truncate() {
    return await this.prisma.itemCategory.deleteMany({});
  }
}
