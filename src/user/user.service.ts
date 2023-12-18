import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { EmergencyContactDto, CreateUserDto, UpdateUserDto } from './dto';
import { SearchFieldEnum, User, UserLevelEnum, UserStatusEnum } from './entities';
import { FileService } from '../common/file/file.service';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) {
		console.log('=== UserService ===')
	}


	// password is hash using bcrypt
	async create(createUserDto: CreateUserDto) {
		try {
			const { skills, emergencyContacts, ...userData } = createUserDto;
	
			// validate if skills exist in training_skills table if provided
			if (skills && skills.length > 0) {
				const skillIds = skills.map((skill) => skill.training_skill_id);
				const skillsExist = await this.validateTrainingSkillsExist(skillIds);
	
				if (!skillsExist) {
					throw new NotFoundException('One or more training_skill_id values do not exist.');
				}
			}
	
			delete userData.password; // delete password prop since it's not included in user schema
	
			// use transaction so that if 1 transaction fails it will rollback
			const result = await this.prisma.$transaction(async (prismaClient) => {
				// Transform emergencyContacts to the Prisma nested input structure if provided
				const emergencyContactsInput: Prisma.EmergencyContactCreateNestedManyWithoutUserInput = emergencyContacts
					? {
						  create: emergencyContacts.map((emergencyContact: EmergencyContactDto) => {
							  return {
								  name: emergencyContact.name,
								  relationship: emergencyContact.relationship,
								  mobile: emergencyContact.mobile,
							  };
						  }),
					  }
					: undefined;
	
				const data: Prisma.UserCreateInput = {
					...userData,
					password_hash: await this.hashPassword(createUserDto.password),
					emergencyContacts: emergencyContactsInput,
				};
	
				console.log('data', data);
	
				const user = await prismaClient.user.create({ data });
	
				// save userSkills to user_skills table if skills are provided
				if (skills && skills.length > 0) {
					const userSkills: Prisma.UserSkillCreateManyInput[] = skills.map((skill) => {
						return {
							user_id: user.id,
							training_skill_id: skill.training_skill_id,
							image_url: skill.image_url
						};
					});
	
					await prismaClient.userSkill.createMany({ data: userSkills });
				}
	
				return user;
			});
	
			const addedUser = await this.findOne(result.id);
			return addedUser;
		} catch (error) {
			console.error('Error:', error);
	
			if (error.code === 'P2002') {
				throw new ConflictException('User with the same data already exists.');
			} else {
				throw new InternalServerErrorException('Failed to create User.');
			}
		}
	}
	

	// I use the remove and add (Replace) approach for updating the user skills 
	async update(userId: string, updateUserDto: UpdateUserDto) {
		console.log('update()', updateUserDto);
		try {
			const { skills, emergencyContacts, ...updatedUserData } = updateUserDto;
	
			// Check if the user with the provided userId exists
			const existingUser = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
	
			if (!existingUser) {
				throw new NotFoundException(`User with ID ${userId} not found.`);
			}
	
			// Validate if skills exist in the training_skills table if provided
			if (skills && skills.length > 0) {
				const skillIds = skills.map((skill) => skill.training_skill_id);
				const skillsExist = await this.validateTrainingSkillsExist(skillIds);
	
				if (!skillsExist) {
					throw new NotFoundException('One or more training_skill_id values do not exist.');
				}
			}
	
			// Use a transaction to ensure atomicity
			const result = await this.prisma.$transaction(async (prismaClient) => {
				// Define the data to update in the user record
				const userDataToUpdate: Prisma.UserUpdateInput = {
					...updatedUserData,
				};
	
				// Remove all existing skills for the user if skills are provided
				// if (skills && skills.length > 0) {
					console.log('has skills', skills)

					const existingSkills = await prismaClient.userSkill.findMany({
						where: {
						  user_id: userId,
						},
						select: {
						  image_url: true,
						},
					});

					// Delete the image files associated with the existing skills
					existingSkills.forEach((existingSkill) => {
						if (existingSkill.image_url) {
						  this.fileService.removeFile(existingSkill.image_url);
						}
					});

					await prismaClient.userSkill.deleteMany({
						where: {
							user_id: userId,
						},
					});
	
					// Add the new userSkills to the user_skills table
					const userSkillsToCreate: Prisma.UserSkillCreateManyInput[] = skills.map((skill) => {
						return {
							user_id: userId,
							training_skill_id: skill.training_skill_id,
							image_url: skill.image_url,
						};
					});

					console.log('userSkillsToCreate', userSkillsToCreate)
	
					await prismaClient.userSkill.createMany({ data: userSkillsToCreate });
				// }
	
				// Remove all existing emergency contacts for the user if emergencyContacts are provided
				if (emergencyContacts && emergencyContacts.length > 0) {
					await prismaClient.emergencyContact.deleteMany({
						where: {
							user_id: userId,
						},
					});
	
					// Add the new emergencyContacts to the emergency_contacts table
					const emergencyContactsToCreate: Prisma.EmergencyContactCreateManyInput[] = emergencyContacts.map(
						(emergencyContact: EmergencyContactDto) => {
							return {
								user_id: userId,
								name: emergencyContact.name,
								relationship: emergencyContact.relationship,
								mobile: emergencyContact.mobile,
							};
						}
					);
	
					await prismaClient.emergencyContact.createMany({ data: emergencyContactsToCreate });
				}
	
				// Update the user in the database
				const updatedUser = await prismaClient.user.update({
					where: {
						id: userId,
					},
					data: userDataToUpdate,
				});
	
				return updatedUser;
			});
	
			// Transaction was successful
			const updatedUser = await this.findOne(result.id);
	
			return updatedUser;
		} catch (error) {
			console.error('Error:', error);
	
			if (error.code === 'P2002') {
				throw new ConflictException('User with the same data already exists.');
			} else {
				throw new InternalServerErrorException('Failed to update User.');
			}
		}
	}
	
	
	async findAll(page: number = 1, pageSize: number = 10, searchField?: SearchFieldEnum, searchValue?: string | number) {
		console.log('findAll()');
	  
		const skip = (page - 1) * pageSize;
	  
		let whereCondition: Record<string, any> = {};
	  
		if (searchField && searchValue !== undefined) {
		  if (searchField === SearchFieldEnum.Id) {
			const numericSearchValue = parseInt(searchValue as string, 10);
			if (!isNaN(numericSearchValue)) {
				whereCondition = { user_id: numericSearchValue };
			} else {
				throw new Error('Invalid user_id. Must be a number.');
			}
		  } else if (searchField === SearchFieldEnum.Firstname || searchField === SearchFieldEnum.Lastname) {
			whereCondition = {
			  [searchField]: {
				contains: searchValue,
				mode: 'insensitive',
			  },
			};
		  }
		}
	  
		const users = await this.prisma.user.findMany({
		  select: {
			id: true,
			user_id: true,
			user_name: true,
			user_level: true,
			last_name: true,
			first_name: true,
			gender: true,
			address: true,
			birth_date: true,
			contact_no: true,
			blood_type: true,
			status: true,
			dispatch_status: true,
			type: true,
			bart_id: true,
			cso_id: true,
			po_id: true,
			na_id: true,
			Bart: true,
			Cso: true,
			Po: true,
			Na: true,
			teamMembers: true,
			teamLeader: true,
			emergencyContacts: true,
			skills: {
			  include: {
				TrainingSkill: true,
			  },
			},
		  },
		  orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
		  skip,
		  take: pageSize,
		  where: whereCondition,
		});
	  
		const totalUsers = await this.prisma.user.count({
			where: whereCondition,
		});
	  
		return {
		  users,
		  totalUsers,
		  currentPage: page,
		  totalPages: Math.ceil(totalUsers / pageSize),
		};
	}

	async findOne(id: string) {
		console.log('findOne', id)
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				user_id: true,
				user_name: true,
				user_level: true,
				last_name: true,
				first_name: true,
				gender: true,
				address: true,
				birth_date: true,
				contact_no: true,
				blood_type: true,
				status: true,
				dispatch_status: true,
				type: true,
				bart_id: true,
				cso_id: true,
				po_id: true,
				na_id: true,
				Bart: true, 
				Cso: true,  
				Po: true,  
				Na: true,  
				teamMembers: true, 
				teamLeader: true,  
				emergencyContacts: true,
				skills: {
					include: {
						TrainingSkill: true,
					}
				}     
			}
		});
	
		if (!user) {
		  throw new NotFoundException('User not found.');
		}

		return user
	}

	async findByUserName(user_name: string) {
		console.log('UserService: findByUserName()', user_name)
		const user = await this.prisma.user.findUnique({
			where: { user_name },
		});
	
		if (!user) {
		  throw new NotFoundException('User not found.');
		}

		return user
	}

	// User type (team leader) that has no assigned team
	async findOrphanLeaders() {
		const users = await this.prisma.user.findMany({
			where: {
				user_level: UserLevelEnum.Team_Leader,
				teamLeader: null, // user is not yet assigned to a team
				status: UserStatusEnum.Active
			},	
			select: {
				id: true,
				user_id: true,
				first_name: true,
				last_name: true,
				Bart: true, 
				Cso: true,  
				Po: true,  
				Na: true,  
				teamMembers: true, 
				teamLeader: true,  
				emergencyContacts: true,
				skills: {
					include: {
						TrainingSkill: true,
					}
				}     
			},
			orderBy: [
				{ last_name: 'asc' }, 
				{ first_name: 'asc' },
			],
		});

		return users
	}

	// find all users without team
	async findUsersWithoutTeam() {
		const users = await this.prisma.user.findMany({
			where: {
				teamLeader: null, // user is not a team leader
				status: UserStatusEnum.Active,
				teamMembers: { // user is not a team member
					none: {}
				}
			},	
			select: {
				id: true,
				user_id: true,
				first_name: true,
				last_name: true,
				Bart: true, 
				Cso: true,  
				Po: true,  
				Na: true,  
				teamMembers: true, 
				teamLeader: true,  
				emergencyContacts: true,
				skills: {
					include: {
						TrainingSkill: true,
					}
				}     
			},
			orderBy: [
				{ last_name: 'asc' }, 
				{ first_name: 'asc' },
			],
		});

		return users
	}

	async findDispatchers(){
		const users = await this.prisma.user.findMany({
			where: {
				user_level: UserLevelEnum.Dispatcher,
				status: UserStatusEnum.Active
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
			},
			orderBy: [
				{ last_name: 'asc' }, 
				{ first_name: 'asc' },
			],
		})

		return users
	}

	async isUsernameTaken(user_name: string): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
		  where: { user_name },
		});
	
		return !!user; 
	}

	async remove(id: string) {
		const existingUser = await this.findOne(id);
	  
		await this.prisma.user.delete({
		  where: { id },
		});
	  
		return true;
	}

	async truncate() {
		return await this.prisma.user.deleteMany({});
	}

	canManage(payload: {currentUser: User, id?: string}): boolean{

		// this is find all endpoint since no id
		if(!payload.id && payload.currentUser.user_level !== UserLevelEnum.Admin){
			return false 
		}

		// this is read one / update endpoint 
		if(payload.currentUser.user_level !== UserLevelEnum.Admin){
			if(payload.currentUser.id !== payload.id){
				return false 
			}
		}

		return true
	}

	private generateUniqueUserName(firstName: string, lastName: string): string {
		const randomSuffix = Math.floor(Math.random() * 10000); // Generate a random number
		return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomSuffix}`;
	}

	hashPassword(password: string) {
		// Hash the password using bcrypt
		const saltRounds = 10; // You can adjust the number of salt rounds
		return bcrypt.hash(password, saltRounds);
	}

	private async validateTrainingSkillsExist(skillIds: string[]): Promise<boolean> {
		const existingSkills = await this.prisma.trainingSkill.findMany({
		  where: {
			id: {
			  in: skillIds,
			},
		  },
		});

	  
		return existingSkills.length === skillIds.length;
	}

}




/* 




*/