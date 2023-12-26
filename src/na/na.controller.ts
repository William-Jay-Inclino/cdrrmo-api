import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { NaService } from './na.service';
import { CreateNaDto } from './dto/create-na.dto';
import { UpdateNaDto } from './dto/update-na.dto';
import { Na } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNaAbility, ReadNaAbility, UpdateNaAbility, DeleteNaAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/na')
@ApiTags('na')
export class NaController {
	constructor(private readonly naService: NaService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteNaAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.naService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateNaAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createNaDto: CreateNaDto): Promise<CreateNaDto> {
		return await this.naService.create(createNaDto);
	}

	@Get()
	@CheckAbilities( new ReadNaAbility() )
	async findAll(): Promise<Na[]> {
		return await this.naService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadNaAbility() )
	async findOne(@Param('id') id: string): Promise<Na> {
		const na = await this.naService.findOne(id);
		return na;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateNaAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateNaDto: UpdateNaDto
	): Promise<Na> {
		const updatedNa = await this.naService.update(id, updateNaDto);
		return updatedNa;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteNaAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.naService.remove(id);
	}
}
