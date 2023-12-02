import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { SearchQueryDto } from './dto/search-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { AbilitiesGuard } from 'src/auth/guards/abilities.guard';
import { ReadUserAbility } from 'src/auth/abilities/ability';
@ApiBearerAuth() // used for swagger 
@ApiTags('user') // used for swagger 
@UseGuards(JwtAuthGuard, AbilitiesGuard) // authentication = JwtAuthGuard and authorization = AbilitiesGuard
@Controller('/api/v1/user') // route

export class UserController {
	constructor(
		private readonly userService: UserService,
	) {}

	@Delete('/truncate')
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.userService.truncate();
	}

	@Post('/check-username')
	@HttpCode(200)
	async checkUsername(@Body('user_name') user_name: string): Promise<{ taken: boolean }> {

		console.log('checkUsername()', user_name)
	  	const isUsernameTaken = await this.userService.isUsernameTaken(user_name);
  
	  	return { taken: isUsernameTaken };
	}

	@Post()
	@UsePipes(new ValidationPipe())
	async create(@Body() createUserDto: CreateUserDto) {
		return await this.userService.create(createUserDto);
	}

	@Get()
	@CheckAbilities( new ReadUserAbility() )
	async findAll(@Query() query: SearchQueryDto) {
	  	return await this.userService.findAll(query.page, query.pageSize, query.searchField, query.searchValue);
	}

	@Get('/orphan-team-leaders')
	async findOrphanLeaders() {
		return await this.userService.findOrphanLeaders();
	}

	@Get('/dispatchers')
	async findDispatchers() {
		return await this.userService.findDispatchers();
	}

	@Get('/no-team')
	async findUsersWithoutTeam() {
		return await this.userService.findUsersWithoutTeam();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const user = await this.userService.findOne(id);
		return user;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		const updatedUser = await this.userService.update(id, updateUserDto);
		return updatedUser;
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.userService.remove(id);
	}



}
