import {NotFound, ObjectIdPipe} from '@mean-stream/nestx';
import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Types} from 'mongoose';

import {CreatePurchaseDto, FindAllPurchaseDto} from './purchase.dto';
import {Purchase} from './purchase.schema';
import {PurchaseService} from './purchase.service';

@Controller('purchases')
@ApiTags('Purchases')
export class PurchaseController {
	constructor(
		private readonly purchaseService: PurchaseService,
	) {
	}

	@Post()
	@ApiCreatedResponse({type: Purchase})
	async create(
		@Body() dto: CreatePurchaseDto,
	): Promise<Purchase> {
		return this.purchaseService.create(dto);
	}

	@Get()
	@ApiOkResponse({type: [Purchase]})
	async findAll(
		@Query() dto: FindAllPurchaseDto,
	): Promise<Purchase[]> {
		return this.purchaseService.findAll(dto);
	}

	@Get('unique/:field')
	@ApiOkResponse({type: Array})
	async findUnique(
		@Query() dto: FindAllPurchaseDto,
		@Param('field') field: keyof Purchase,
	): Promise<unknown[]> {
		return this.purchaseService.distinct(field, dto);
	}

	@Get(':id')
	@NotFound()
	@ApiOkResponse({type: Purchase})
	async findOne(
		@Param('id', ObjectIdPipe) id: Types.ObjectId,
	): Promise<Purchase | null> {
		return this.purchaseService.find(id);
	}

	@Delete(':id')
	@NotFound()
	@ApiOkResponse({type: Purchase})
	async remove(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
	): Promise<Purchase | null> {
		return this.purchaseService.delete(id);
	}
}
