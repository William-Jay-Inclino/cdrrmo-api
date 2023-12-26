import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { PoService } from './po.service';
import { CreatePoDto } from './dto/create-po.dto';
import { UpdatePoDto } from './dto/update-po.dto';
import { Po } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard, JwtAuthGuard } from 'src/auth/guards';
import { CreatePoAbility, ReadPoAbility, UpdatePoAbility, DeletePoAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/po')
@ApiTags('po')
export class PoController {
	constructor(private readonly poService: PoService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeletePoAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.poService.truncate();
	}

	@Post()
	@CheckAbilities( new CreatePoAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createPoDto: CreatePoDto): Promise<CreatePoDto> {
		return await this.poService.create(createPoDto);
	}

	@Get()
	@CheckAbilities( new ReadPoAbility() )
	async findAll(): Promise<Po[]> {
		return await this.poService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadPoAbility() )
	async findOne(@Param('id') id: string): Promise<Po> {
		const po = await this.poService.findOne(id);
		return po;
	}

	@Patch(':id')
	@CheckAbilities( new UpdatePoAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updatePoDto: UpdatePoDto
	): Promise<Po> {
		const updatedPo = await this.poService.update(id, updatePoDto);
		return updatedPo;
	}

	@Delete(':id')
	@CheckAbilities( new DeletePoAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.poService.remove(id);
	}
}
