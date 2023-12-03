import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SearchQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/auth/abilities/ability.decorator';
import { AbilitiesGuard } from 'src/auth/guards/abilities.guard';
import { CreateUserAbility, ReadUserAbility, UpdateUserAbility, DeleteUserAbility } from './abilities';
@ApiBearerAuth() // used for swagger 
@ApiTags('user') // used for swagger 
@UseGuards(JwtAuthGuard, AbilitiesGuard) // authentication = JwtAuthGuard and authorization = AbilitiesGuard
@Controller('/api/v1/user') // route

export class UserController {
	constructor(
		private readonly userService: UserService,
	) {}
	
	@Delete('/truncate')
	@CheckAbilities( new DeleteUserAbility() )
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
	@CheckAbilities( new CreateUserAbility() )
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
	@CheckAbilities( new ReadUserAbility() )
	async findOrphanLeaders() {
		return await this.userService.findOrphanLeaders();
	}

	@Get('/dispatchers')
	@CheckAbilities( new ReadUserAbility() )
	async findDispatchers() {
		return await this.userService.findDispatchers();
	}

	@Get('/no-team')
	@CheckAbilities( new ReadUserAbility() )
	async findUsersWithoutTeam() {
		return await this.userService.findUsersWithoutTeam();
	}

	@Get(':id')
	@CheckAbilities( new ReadUserAbility() )
	async findOne(@Param('id') id: string) {
		const user = await this.userService.findOne(id);
		return user;
	}

	@Patch(':id')
	@CheckAbilities( new UpdateUserAbility() )
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		const updatedUser = await this.userService.update(id, updateUserDto);
		return updatedUser;
	}

	@Delete(':id')
	@CheckAbilities( new DeleteUserAbility() )
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.userService.remove(id);
	}



}
