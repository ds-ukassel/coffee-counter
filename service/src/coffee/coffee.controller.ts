import {NotFound, ObjectIdPipe} from '@mean-stream/nestx';
import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Types} from 'mongoose';

import {environment} from '../environment';
import {CoffeeDiagramData, CreateCoffeeDto, FilterCoffeeDto, UpdateCoffeeDto} from './coffee.dto';
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
		return this.coffeeService.create({...dto, price: environment.coffeePrice});
	}

	@Get()
	@ApiOkResponse({type: [Coffee]})
	async findAll(
		@Query() filter: FilterCoffeeDto,
	): Promise<Coffee[]> {
		return this.coffeeService.findAll(filter, {sort: {createdAt: -1}, limit: 20});
	}

	@Get(':id/diagram')
	@ApiOkResponse({type: [CoffeeDiagramData]})
	async findDiagramData(
		@Param('id') id: string,
	): Promise<CoffeeDiagramData[]> {
		return this.coffeeService.findDiagramData(id);
	}

	@Get(':id')
	@NotFound()
	@ApiOkResponse({type: Coffee})
	async findOne(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
	): Promise<Coffee | null> {
		return this.coffeeService.find(id);
	}

	@Patch(':id')
	@NotFound()
	@ApiOkResponse({type: Coffee})
	async update(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
		@Body() dto: UpdateCoffeeDto,
	): Promise<Coffee | null> {
		return this.coffeeService.update(id, dto);
	}

	@Delete(':id')
	@NotFound()
	@ApiOkResponse({type: Coffee})
	async remove(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
	): Promise<Coffee | null> {
		return this.coffeeService.delete(id);
	}
}
