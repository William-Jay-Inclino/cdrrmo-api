import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { Dispatch } from '@prisma/client';

@Controller('/api/v1/dispatch')
export class DispatchController {
	constructor(private readonly dispatchService: DispatchService) {}

	@Delete('/truncate')
	@HttpCode(HttpStatus.NO_CONTENT)
	async truncate(): Promise<void> {
		await this.dispatchService.truncate();
	}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createDispatchDtos: CreateDispatchDto[] | CreateDispatchDto): Promise<Dispatch[]> {
    if (!Array.isArray(createDispatchDtos)) {
      throw new BadRequestException('Invalid input. Expected an array.');
    }

    return await this.dispatchService.create(createDispatchDtos);
  }

	@Get()
	async findAll(): Promise<Dispatch[]> {
		return await this.dispatchService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Dispatch> {
		const dispatch = await this.dispatchService.findOne(id);
		return dispatch;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() updateDispatchDto: UpdateDispatchDto
	): Promise<Dispatch> {
		const updatedDispatch = await this.dispatchService.update(id, updateDispatchDto);
		return updatedDispatch;
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		await this.dispatchService.remove(id);
	}
}
