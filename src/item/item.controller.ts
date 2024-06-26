import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, CreateStockMovementDto, SearchQueryDto, UpdateItemDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard, JwtAuthGuard } from 'src/auth/guards';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { CreateItemAbility, ReadItemAbility, UpdateItemAbility, DeleteItemAbility } from './abilities';
import { Item } from '@prisma/client';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/item')
@ApiTags('item')
export class ItemController {
	constructor(private readonly itemService: ItemService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteItemAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.itemService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateItemAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
		return await this.itemService.create(createItemDto);
	}

	@Get()
	@CheckAbilities( new ReadItemAbility() )
	async findAll(@Query() query: SearchQueryDto) {
		return await this.itemService.findAll(query.page, query.pageSize, query.searchField, query.searchValue);
	}

	@Get(':id')
	@CheckAbilities( new ReadItemAbility() )
	async findOne(@Param('id') id: string): Promise<Item> {
		return await this.itemService.findOne(id);
	}

	@Patch(':id')
	@CheckAbilities( new ReadItemAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateItemDto: UpdateItemDto
	): Promise<Item> {
		const updatedItem = await this.itemService.update(id, updateItemDto);
		return updatedItem;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteItemAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.itemService.remove(id);
	}

	@CheckAbilities( new CreateItemAbility() )
	@UsePipes(new ValidationPipe())
	@Post(':itemId/stock-in')
	async stockIn(@Param('itemId') itemId: string, @Body() createStockMovementDto: CreateStockMovementDto, @Req() req): Promise<Item> {
		return await this.itemService.stockIn(itemId, createStockMovementDto, req.user);
	}

	@CheckAbilities( new CreateItemAbility() )
	@UsePipes(new ValidationPipe())
	@Post(':itemId/stock-out')
	async stockOut(@Param('itemId') itemId: string, @Body() createStockMovementDto: CreateStockMovementDto, @Req() req): Promise<Item> {
		return await this.itemService.stockOut(itemId, createStockMovementDto, req.user);
	}

}
