import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {CreateCoffeeDto} from './coffee.dto';
import {Coffee} from './coffee.schema';
import {CoffeeService} from './coffee.service';

@Controller('coffees')
@ApiTags('Coffees')
export class CoffeeController {
	constructor(
		private readonly coffeeService: CoffeeService,
	) {
	}

	@Post()
	@ApiCreatedResponse({type: Coffee})
	async create(
		@Body() dto: CreateCoffeeDto,
	): Promise<Coffee> {
		return this.coffeeService.create(dto);
	}

	@Get()
	@ApiOkResponse({type: [Coffee]})
	async findAll(): Promise<Coffee[]> {
		return this.coffeeService.findAll();
	}

	@Get(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: Coffee})
	async findOne(
		@Param('id') id: string,
	): Promise<Coffee | null> {
		return this.coffeeService.findOne(id);
	}

	@Delete(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: Coffee})
	async remove(
		@Param('id') id: string,
	): Promise<Coffee | null> {
		return this.coffeeService.remove(id);
	}
}
