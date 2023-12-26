import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { JwtAuthGuard, AbilitiesGuard } from 'src/auth/guards';
import { CreateItemCategoryAbility, ReadItemCategoryAbility, UpdateItemCategoryAbility, DeleteItemCategoryAbility } from './abilities';
import { ItemCategory } from './entities';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/item-category')
@ApiTags('item-category')
export class ItemCategoryController {
	constructor(private readonly itemCategoryService: ItemCategoryService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteItemCategoryAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.itemCategoryService.truncate();
	}

	@Post()
	@CheckAbilities( new ReadItemCategoryAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createItemCategoryDto: CreateItemCategoryDto): Promise<ItemCategory> {
		return await this.itemCategoryService.create(createItemCategoryDto);
	}

	@Get()
	@CheckAbilities( new ReadItemCategoryAbility() )
	async findAll(): Promise<ItemCategory[]> {
		return await this.itemCategoryService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadItemCategoryAbility() )
	async findOne(@Param('id') id: string): Promise<ItemCategory> {
		return await this.itemCategoryService.findOne(id);
	}

	@Patch(':id')
	@CheckAbilities( new UpdateItemCategoryAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateItemCategoryDto: UpdateItemCategoryDto
	): Promise<ItemCategory> {
		return await this.itemCategoryService.update(id, updateItemCategoryDto);
	}

	@Delete(':id')
	@CheckAbilities( new DeleteItemCategoryAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.itemCategoryService.remove(id);
	}
}
