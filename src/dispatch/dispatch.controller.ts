import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, BadRequestException, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { Dispatch } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDispatchAbility, ReadDispatchAbility, UpdateDispatchAbility, DeleteDispatchAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/dispatch')
@ApiTags('dispatch')
export class DispatchController {
	constructor(private readonly dispatchService: DispatchService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteDispatchAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.dispatchService.truncate();
	}

  	@Post()
	@CheckAbilities( new CreateDispatchAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createDispatchDtos: CreateDispatchDto[] | CreateDispatchDto): Promise<Dispatch[]> {
		console.log('create()')
		if (!Array.isArray(createDispatchDtos)) {
		throw new BadRequestException('Invalid input. Expected an array.');
		}

		return await this.dispatchService.create(createDispatchDtos);
	}

	@Get()
	@CheckAbilities( new ReadDispatchAbility() )
	async findAll(): Promise<Dispatch[]> {
		console.log('findAll()')
		return await this.dispatchService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadDispatchAbility() )
	async findOne(@Param('id') id: string): Promise<Dispatch> {
		console.log('findOne()', id)
		const dispatch = await this.dispatchService.findOne(id);
		return dispatch;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateDispatchAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateDispatchDto: UpdateDispatchDto
	): Promise<Dispatch> {
		console.log('update()', id, updateDispatchDto)
		const updatedDispatch = await this.dispatchService.update(id, updateDispatchDto);
		return updatedDispatch;
	}

	@Patch(':id/update-time/:fieldName')
	@CheckAbilities( new UpdateDispatchAbility() )
	async updateTimeField(
	  @Param('id', new ParseUUIDPipe()) dispatchId: string,
	  @Param('fieldName') fieldName: string,
	  @Body() updateDispatchDto: UpdateDispatchDto
	): Promise<Dispatch> {
		console.log('updateTimeField()', dispatchId, fieldName)
		console.log('updateDispatchDto', updateDispatchDto)
	  return await this.dispatchService.updateTimeField(dispatchId, fieldName, updateDispatchDto);
	}

	@Delete(':id')
	@CheckAbilities( new DeleteDispatchAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		console.log('remove()', id)
		await this.dispatchService.remove(id);
	}
}
