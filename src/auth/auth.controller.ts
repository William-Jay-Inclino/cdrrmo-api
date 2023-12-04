import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from './abilities/ability.decorator';
import { UpdateUserAbility } from 'src/user/abilities';
import { UpdateAccountDto, LoginDto, RenewPwDto } from './dto';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Controller('/api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    description: 'Login credentials',
    type: LoginDto, 
  })
  async login(@Request() req) {
    console.log('AuthController: login()')
    return this.authService.login(req.user);
  }

  @Post('/create-admin')
  @ApiBody({
    description: 'Create Admin',
    type: LoginDto, 
  })
	async create(@Body() loginDto: LoginDto): Promise<User> {
		return await this.authService.createAdmin(loginDto.username, loginDto.password)
	}

  @Patch('/update-password/:id')
  @UseGuards(JwtAuthGuard)
	@CheckAbilities( new UpdateUserAbility() )
	@UsePipes(new ValidationPipe())
	async updateAccount(
		@Param('id') id: string,
		@Body() updateAccountDto: UpdateAccountDto,
		@Req() req
	) {

		// only admin and user (own profile) can update 
		if(!this.userService.canManage({currentUser: req.user, id})){
			throw new ForbiddenException()
		}

		return await this.authService.updateAccount(id, updateAccountDto);
	}

  @Patch('/renew-password/:id')
  @UseGuards(JwtAuthGuard)
	@CheckAbilities( new UpdateUserAbility() )
	@UsePipes(new ValidationPipe())
	async renewPassword(
		@Param('id') id: string,
		@Body() renewPwDto: RenewPwDto,
		@Req() req
	) {

		// only admin and user (own profile) can update 
		if(!this.userService.canManage({currentUser: req.user, id})){
			throw new ForbiddenException()
		}

		return await this.authService.renewPassword(id, renewPwDto);
	}

}
