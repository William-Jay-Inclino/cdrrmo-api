import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';

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

}
