import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from './abilities/ability.decorator';
import { UpdateUserAbility } from 'src/user/abilities';
import { UpdateAccountDto, LoginDto } from './dto';
import { UserService } from 'src/user/user.service';

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

  @Patch('/update-password/:id')
  @UseGuards(JwtAuthGuard)
	@CheckAbilities( new UpdateUserAbility() )
	@UsePipes(new ValidationPipe())
	async update(
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

}
