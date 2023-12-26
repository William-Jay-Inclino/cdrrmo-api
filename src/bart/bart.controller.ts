import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { BartService } from './bart.service';
import { CreateBartDto } from './dto/create-bart.dto';
import { UpdateBartDto } from './dto/update-bart.dto';
import { Bart } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBartAbility, ReadBartAbility, UpdateBartAbility, DeleteBartAbility } from './abilities';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/bart')
@ApiTags('bart')
export class BartController {
	constructor(private readonly bartService: BartService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteBartAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.bartService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateBartAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createBartDto: CreateBartDto): Promise<CreateBartDto> {
		return await this.bartService.create(createBartDto);
	}

	@Get()
	@CheckAbilities( new ReadBartAbility() )
	async findAll(): Promise<Bart[]> {
		return await this.bartService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadBartAbility() )
	async findOne(@Param('id') id: string): Promise<Bart> {
		const bart = await this.bartService.findOne(id);
		return bart;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateBartAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateBartDto: UpdateBartDto
	): Promise<Bart> {
		const updatedBart = await this.bartService.update(id, updateBartDto);
		return updatedBart;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteBartAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.bartService.remove(id);
	}
}
