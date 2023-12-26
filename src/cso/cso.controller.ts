import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CsoService } from './cso.service';
import { CreateCsoDto } from './dto/create-cso.dto';
import { UpdateCsoDto } from './dto/update-cso.dto';
import { Cso } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { CreateCsoAbility, ReadCsoAbility, UpdateCsoAbility, DeleteCsoAbility } from './abilities';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/cso')
@ApiTags('cso')
export class CsoController {
	constructor(private readonly csoService: CsoService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteCsoAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.csoService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateCsoAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createCsoDto: CreateCsoDto): Promise<CreateCsoDto> {
		return await this.csoService.create(createCsoDto);
	}

	@Get()
	@CheckAbilities( new ReadCsoAbility() )
	async findAll(): Promise<Cso[]> {
		return await this.csoService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadCsoAbility() )
	async findOne(@Param('id') id: string): Promise<Cso> {
		const cso = await this.csoService.findOne(id);
		return cso;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateCsoAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateCsoDto: UpdateCsoDto
	): Promise<Cso> {
		const updatedCso = await this.csoService.update(id, updateCsoDto);
		return updatedCso;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteCsoAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<{is_deleted: boolean}> {
		return await this.csoService.remove(id);
	}
}
