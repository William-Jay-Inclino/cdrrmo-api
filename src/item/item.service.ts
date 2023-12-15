import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateItemDto, CreateStockMovementDto, UpdateItemDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';
import { MovementTypeEnum } from './entities';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    try {
      const itemCreated = await this.prisma.item.create({
        data: { ...createItemDto },
      });

      const item = await this.findOne(itemCreated.id)

      return item

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Item with the same data already exists.');
      } else {
        throw new InternalServerErrorException('Failed to create Item.');
      }
    }
  }

  async findAll() {
    return await this.prisma.item.findMany(
      {
        include: {
          Category: true,
        }
      }
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { 
        Category: true,
        StockMovement: true
       }
    });

    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    console.log('find success')

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const existingItem = await this.findOne(id);
  
    const itemWithSameName = await this.prisma.item.findFirst({
      where: {
        name: updateItemDto.name,
        id: { not: id }, 
      },
    });
  
    if (itemWithSameName) {
      throw new ConflictException('Item with the same data already exists.');
    }
  
    // Continue with the update logic
    const updatedItem = await this.prisma.item.update({
      where: { id },
      data: { ...updateItemDto },
    });

    console.log('update success')

    const item = await this.findOne(updatedItem.id)

    return item
  
  }
  
  async remove(id: string) {
    const existingItem = await this.findOne(id);
  
    await this.prisma.item.delete({
      where: { id },
    });

    console.log('remove success')
  
    return true;
  }

  async truncate() {
    return await this.prisma.item.deleteMany({});
  }

  async stockIn(itemId: string, createStockMovementDto: CreateStockMovementDto): Promise<void> {
    await this.updateStock(itemId, createStockMovementDto, MovementTypeEnum.StockIn);
  }
  
  async stockOut(itemId: string, createStockMovementDto: CreateStockMovementDto): Promise<void> {
    await this.updateStock(itemId, createStockMovementDto, MovementTypeEnum.StockOut);
  }

  private async updateStock(itemId: string, dto: CreateStockMovementDto, movementType: MovementTypeEnum): Promise<void> {
    const { quantity, remarks } = dto;

    // Start a database transaction
    await this.prisma.$transaction([
      // Fetch the item within the transaction
      this.prisma.item.findUnique({
        where: { id: itemId },
        include: { StockMovement: true },
      }),
      // Create a new stock movement record within the transaction
      this.prisma.stockMovement.create({
        data: {
          item: { connect: { id: itemId } },
          quantity,
          movement_type: movementType,
          movement_date: new Date(),
          remarks,
        },
      }),
      // Update the item quantity within the transaction
      this.prisma.item.update({
        where: { id: itemId },
        data: 
          { 
            quantity: { 
              [movementType === MovementTypeEnum.StockIn ? 'increment' : 'decrement']: quantity 
            } 
          },
      }),
    ]);
  }


}
