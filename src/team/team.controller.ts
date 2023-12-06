import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';
import { TeamMemberDto } from './dto';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTeamAbility, ReadTeamAbility, UpdateTeamAbility, DeleteTeamAbility, CreateTeamMemberAbility, DeleteTeamMemberAbility } from './abilities';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/team')
@ApiTags('team')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteTeamAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.teamService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateTeamAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createTeamDto: CreateTeamDto): Promise<CreateTeamDto> {
		return await this.teamService.create(createTeamDto);
	}

	@Post('/member')
	@CheckAbilities( new CreateTeamMemberAbility() )
	@UsePipes(new ValidationPipe())
	async addMemberToTeam(@Body() teamMemberDto: TeamMemberDto): Promise<TeamMemberDto> {
		return await this.teamService.addMemberToTeam(teamMemberDto);
	}

	@Get()
	@CheckAbilities( new ReadTeamAbility() )
	async findAll(): Promise<Team[]> {
		return await this.teamService.findAll();
	}

	@Get('/status')
	@CheckAbilities( new ReadTeamAbility() )
	async findAllActive(): Promise<Team[]> {
		return await this.teamService.findAllActive();
	}

	@Get(':id')
	@CheckAbilities( new ReadTeamAbility() )
	async findOne(@Param('id') id: string): Promise<Team> {
		const team = await this.teamService.findOne(id);
		return team;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateTeamAbility() )
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: string,@Body() updateTeamDto: UpdateTeamDto): Promise<Team> {
		const updatedTeam = await this.teamService.update(id, updateTeamDto);
		return updatedTeam;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteTeamAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.teamService.remove(id);
	}

	@Delete('/member/:id')
	@CheckAbilities( new DeleteTeamMemberAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async removeMemberInTeam(@Param('id') id: string): Promise<void> {
		await this.teamService.removeMemberInTeam(id);
	}
}
