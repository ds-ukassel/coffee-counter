import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {CreatePurchaseDto} from './purchase.dto';
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
	async findAll(): Promise<Purchase[]> {
		return this.purchaseService.findAll();
	}

	@Get(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: Purchase})
	async findOne(
		@Param('id') id: string,
	): Promise<Purchase | null> {
		return this.purchaseService.findOne(id);
	}

	@Delete(':id')
	// TODO @NotFound()
	@ApiOkResponse({type: Purchase})
	async remove(
		@Param('id') id: string,
	): Promise<Purchase | null> {
		return this.purchaseService.remove(id);
	}
}
