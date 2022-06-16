import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {UserService} from '../user/user.service';
import {CreatePurchaseDto} from './purchase.dto';
import {Purchase, PurchaseDocument} from './purchase.schema';

@Injectable()
export class PurchaseService {
	constructor(
		@InjectModel('purchases') private model: Model<Purchase>,
		private userService: UserService,
	) {
	}

	async create(dto: CreatePurchaseDto): Promise<PurchaseDocument> {
		const purchase = await this.model.create(dto);
		await this.userService.update(dto.userId, {
			$inc: {
				balance: dto.total,
			},
		});
		return purchase;
	}

	async findAll(where: FilterQuery<Purchase> = {}): Promise<Purchase[]> {
		return this.model.find(where).exec();
	}

	async unique(field: string, where: FilterQuery<Purchase>): Promise<any[]> {
		return this.model.distinct(field, where).exec();
	}

	async findOne(id: string): Promise<PurchaseDocument | null> {
		return this.model.findById(id).exec();
	}

	async remove(id: string): Promise<PurchaseDocument | null> {
		const purchase = await this.model.findByIdAndDelete(id).exec();
		purchase && await this.userService.update(purchase.userId, {
			$inc: {
				balance: -purchase.total,
			},
		});
		return purchase;
	}
}
