import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, SearchQueryDto, UpdateLocationDto } from './dto';
import { AbilitiesGuard, JwtAuthGuard } from '../auth/guards';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLocationAbility, ReadLocationAbility, UpdateLocationAbility, DeleteLocationAbility } from './abilities';
import { DispatchLocation } from './entities';

@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('/api/v1/location')
@ApiTags('location')
export class LocationController {
	constructor(private readonly locationService: LocationService) {}

	@Delete('/truncate')
	@CheckAbilities( new DeleteLocationAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.locationService.truncate();
	}

	@Post()
	@CheckAbilities( new CreateLocationAbility() )
	@UsePipes(new ValidationPipe())
	async create(@Body() createLocationDto: CreateLocationDto): Promise<CreateLocationDto> {
		return await this.locationService.create(createLocationDto);
	}

	@Get()
	@CheckAbilities( new ReadLocationAbility() )
	async findAll(): Promise<DispatchLocation[]> {
		return await this.locationService.findAll();
	}

	@Get('/per-page')
	@CheckAbilities( new ReadLocationAbility() )
	async findPerPage(@Query() query: SearchQueryDto) {
		return await this.locationService.findPerPage(query.page, query.pageSize, query.searchField, query.searchValue);
	}

	@Get(':id')
	@CheckAbilities( new ReadLocationAbility() )
	async findOne(@Param('id') id: string): Promise<DispatchLocation> {
		return await this.locationService.findOne(id);
	}

	@Patch(':id')
	@CheckAbilities( new UpdateLocationAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateLocationDto: UpdateLocationDto
	): Promise<UpdateLocationDto> {
		return await this.locationService.update(id, updateLocationDto);
	}

	@Delete(':id')
	@CheckAbilities( new DeleteLocationAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.locationService.remove(id);
	}
}
