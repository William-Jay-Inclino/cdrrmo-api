import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateItemDto, CreateStockMovementDto, UpdateItemDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Item, User } from '@prisma/client';
import { MovementTypeEnum, SearchFieldEnum } from './entities';

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

  async findAll(page: number = 1, pageSize: number = 10, searchField?: SearchFieldEnum, searchValue?: string | number) {

    const skip = (page - 1) * pageSize;
	  
		let whereCondition: Record<string, any> = {};
	  
		if (searchField && searchValue !== undefined) {
		  if (searchField === SearchFieldEnum.Name) {
			whereCondition = {
			  [searchField]: {
				contains: searchValue,
				mode: 'insensitive',
			  },
			};
		  }
		}

    whereCondition = {
			is_deleted: false
		}

    const items = await this.prisma.item.findMany({
      include: {
        Category: true,
      },
      orderBy: {name: 'asc'},
      skip,
      take: pageSize,
      where: whereCondition,
    });

    const totalItems = await this.prisma.item.count({
			where: whereCondition,
		});
	  
		return {
		  items,
		  totalItems,
		  currentPage: page,
		  totalPages: Math.ceil(totalItems / pageSize),
		};

  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id, is_deleted: false },
      include: { 
        Category: true,
        StockMovement: {
          include: {
            user: true
          },
          orderBy: {
            movement_date: 'desc'
          }
        }
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
  
  // async remove(id: string) {
  //   const existingItem = await this.findOne(id);
  
  //   await this.prisma.item.delete({
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
	
		await this.prisma.item.update({
			where: { id },
			data: {
				is_deleted: true,
			},
		});
	
		return {is_deleted: true}
	}

  async truncate() {
    return await this.prisma.item.deleteMany({});
  }

  async stockIn(itemId: string, createStockMovementDto: CreateStockMovementDto, currentUser: User): Promise<Item> {
    return await this.updateStock(itemId, createStockMovementDto, MovementTypeEnum.StockIn, currentUser);
  }
  
  async stockOut(itemId: string, createStockMovementDto: CreateStockMovementDto, currentUser: User): Promise<Item> {
    return await this.updateStock(itemId, createStockMovementDto, MovementTypeEnum.StockOut, currentUser);
  }

// ... other imports ...

  private async updateStock(itemId: string, dto: CreateStockMovementDto, movementType: MovementTypeEnum, currentUser: User): Promise<Item> {
    const { quantity, remarks } = dto;

    // Fetch the current item within the transaction
    const currentItem = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: { StockMovement: true },
    });

    if (!currentItem) {
      throw new Error(`Item with id ${itemId} not found.`);
    }

    // Validate stock-out quantity
    if (movementType === MovementTypeEnum.StockOut && currentItem.quantity < quantity) {
      throw new Error(`Insufficient stock for item ${itemId}.`);
    }

    // Start a database transaction
    await this.prisma.$transaction([
      // Create a new stock movement record within the transaction
      this.prisma.stockMovement.create({
        data: {
          item: { connect: { id: itemId } },
          user: { connect: { id: currentUser.id } }, 
          quantity,
          movement_type: movementType,
          movement_date: new Date(),
          remarks,
        },
      }),
      // Update the item quantity within the transaction
      this.prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: {
            [movementType === MovementTypeEnum.StockIn ? 'increment' : 'decrement']: quantity,
          },
        },
      }),
    ]);

    // Fetch and return the updated item within the transaction
    const updatedItem = await this.findOne(itemId);

    return updatedItem;
  }

  


}
