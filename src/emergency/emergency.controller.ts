import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ValidationPipe, UsePipes, HttpCode, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';
import { Emergency } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEmergencyAbility, ReadEmergencyAbility, UpdateEmergencyAbility, DeleteEmergencyAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/emergency')
@ApiTags('emergency')
export class EmergencyController {
    constructor(private readonly emergencyService: EmergencyService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteEmergencyAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.emergencyService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateEmergencyAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createEmergencyDto: CreateEmergencyDto): Promise<CreateEmergencyDto> {
		return await this.emergencyService.create(createEmergencyDto);
	}

	@Get()
	@CheckAbilities( new ReadEmergencyAbility() )
	async findAll(): Promise<Emergency[]> {
		return await this.emergencyService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadEmergencyAbility() )
	async findOne(@Param('id') id: string): Promise<Emergency> {
		const emergency = await this.emergencyService.findOne(id);
		return emergency;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateEmergencyAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateEmergencyDto: UpdateEmergencyDto
	): Promise<Emergency> {
		const updatedEmergency = await this.emergencyService.update(id, updateEmergencyDto);
		return updatedEmergency;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteEmergencyAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.emergencyService.remove(id);
	}

}
