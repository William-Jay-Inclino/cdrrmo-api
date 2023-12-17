import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateAccountDto, RenewPwDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { GenderEnum, UserLevelEnum, UserStatusEnum, UserTypeEnum } from 'src/user/entities';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

  async validateUser(username: string, password: string): Promise<any> {

    console.log('AuthService: validateUser()', username, password)

    const user = await this.userService.findByUserName(username);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }

    console.log('invalid user')
    return null;
  }

  async validateUserById(userId: string): Promise<any | undefined> {
    console.log('AuthService: validateUserById()')
    return this.userService.findOne(userId)
  }

  async login(user: any) {
    console.log('AuthService: login()', user);

    const payload = {
      username: user.user_name,
      sub: user.id,
    };

    return {
      user: {
        id: user.id,
        user_name: user.user_name,
        user_level: user.user_level,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateAccount(id: string, updateAccountDto: UpdateAccountDto): Promise<boolean>{
    console.log('updateAccount()', updateAccountDto)
    
    try {
      const existingUser = await this.userService.findOne(id)
      const password_hash = await this.userService.hashPassword(updateAccountDto.password) 

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password_hash,
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }

  }

	async renewPassword(id: string, renewPwDto: RenewPwDto): Promise<boolean> {
		console.log('renewPassword()', id, renewPwDto)
		const user = await this.prisma.user.findUnique({
				select: {
						password_hash: true
				},
				where: { id }
		});

		if (!user) {
				throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (!(await bcrypt.compare(renewPwDto.currentPassword, user.password_hash))) {
				throw new BadRequestException('Current password is incorrect');
		}

		const password_hash = await this.userService.hashPassword(renewPwDto.newPassword);

		const updatedUser = await this.prisma.user.update({
				where: { id },
				data: {
						password_hash,
				},
		});

		if (updatedUser) {
				return true
		} else {
			throw new BadRequestException('Password renewal failed');
		}
    
}

  async createAdmin(username: string, password: string): Promise<User> {
    try {
      const passwordHash = await this.userService.hashPassword(password);

      const data = {
        user_name: username,
        user_level: UserLevelEnum.Admin,
        password_hash: passwordHash,
        last_name: 'admin',
        first_name: 'admin',
        gender: GenderEnum.Male,
        address: 'Ormoc City',
        birth_date: new Date('1990-01-01T00:00:00.000Z'),
        contact_no: '9106024371',
        blood_type: 'A+',
        status: UserStatusEnum.Active,
        type: UserTypeEnum.LGU_Regular,
      }

      // Create an admin user
      const createdAdmin = await this.prisma.user.create({data});

      console.log('Admin created:', createdAdmin);

      return createdAdmin
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new Error('Failed to create admin');
    }
  }


}
