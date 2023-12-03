import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TrainingSkillService } from './training-skill.service';
import { CreateTrainingSkillDto } from './dto/create-training-skill.dto';
import { UpdateTrainingSkillDto } from './dto/update-training-skill.dto';
import { TrainingSkill } from '@prisma/client';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTrainingSkillAbility, ReadTrainingSkillAbility, UpdateTrainingSkillAbility, DeleteTrainingSkillAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/training-skill')
@ApiTags('training-skill')
export class TrainingSkillController {
	constructor(private readonly trainingSkillService: TrainingSkillService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteTrainingSkillAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		// Clear all training skills.
		await this.trainingSkillService.truncate();
	}

	@Post()
	@UsePipes(new ValidationPipe())
	@CheckAbilities( new CreateTrainingSkillAbility() )
	async create(@Body() createTrainingSkillDto: CreateTrainingSkillDto): Promise<CreateTrainingSkillDto> {
		// Create a new training skill and return it.
		return await this.trainingSkillService.create(createTrainingSkillDto);
	}

	@Get()
	@CheckAbilities( new ReadTrainingSkillAbility() )
	async findAll(): Promise<TrainingSkill[]> {
		// Retrieve and return a list of all training skills.
		return await this.trainingSkillService.findAll();
	}

	@Get(':id')
	@CheckAbilities( new ReadTrainingSkillAbility() )
	async findOne(@Param('id') id: string): Promise<TrainingSkill> {
		// Retrieve a specific training skill by ID.
		const trainingSkill = await this.trainingSkillService.findOne(id);
		return trainingSkill;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateTrainingSkillAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateTrainingSkillDto: UpdateTrainingSkillDto
	): Promise<TrainingSkill> {
		// Update a training skill and return the updated result.
		const updatedSkill = await this.trainingSkillService.update(id, updateTrainingSkillDto);
		return updatedSkill;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteTrainingSkillAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		// Remove a training skill by ID. It throws an exception if not found.
		await this.trainingSkillService.remove(id);
	}
}
