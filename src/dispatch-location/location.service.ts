import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { DispatchLocation, SearchFieldEnum } from './entities';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      return await this.prisma.location.create({
        data: { ...createLocationDto },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Location with the same data already exists.');
      } else {
        throw new InternalServerErrorException('Failed to create Location.');
      }
    }
  }

  async findAll() {
    return await this.prisma.location.findMany();
  }
  
  async findPerPage(page: number = 1, pageSize: number = 10, searchField?: SearchFieldEnum, searchValue?: string | number) {

    const skip = (page - 1) * pageSize;
	  
		let whereCondition: Record<string, any> = {}

    if (searchField && searchValue !== undefined) {
		  if (searchField === SearchFieldEnum.Name) {
        whereCondition = {
          [searchField]: {
            contains: searchValue,
            mode: 'insensitive',
          },
        };
      }
		}

    const locations = await this.prisma.location.findMany({
      orderBy: {
        name: 'asc'
      },
      skip,
		  take: pageSize,
		  where: whereCondition,
    })

    const totalLocations = await this.prisma.location.count({
			where: whereCondition,
		});

    return {
		  locations,
		  totalLocations,
		  currentPage: page,
		  totalPages: Math.ceil(totalLocations / pageSize),
		};

  }

  async findOne(id: string) {
    const bart = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!bart) {
      throw new NotFoundException('Location not found.');
    }

    console.log('find success')

    return bart;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<DispatchLocation> {
    const existingLocation = await this.findOne(id);
  
    const locationWithSameName = await this.prisma.location.findFirst({
      where: {
        name: updateLocationDto.name,
        id: { not: id }, 
      },
    });
  
    if (locationWithSameName) {
      throw new ConflictException('Location with the same data already exists.');
    }
  
    const updatedLocation = await this.prisma.location.update({
      where: { id },
      data: { ...updateLocationDto },
    })

    console.log('update success')
  
    return updatedLocation;
  }
  
  async remove(id: string) {
    const existingLocation = await this.findOne(id);
  
    await this.prisma.location.delete({
      where: { id },
    });

    console.log('remove success')
  
    return true;
  }

  async truncate() {
    return await this.prisma.location.deleteMany({});
  }
}
