import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {CreatePurchaseDto} from './purchase.dto';
import {Purchase, PurchaseDocument} from './purchase.schema';

@Injectable()
export class PurchaseService {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('purchases') private model: Model<Purchase>,
	) {
	}

	async create(dto: CreatePurchaseDto): Promise<PurchaseDocument> {
		const purchase = await this.model.create(dto);
		this.emit('created', purchase);
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
		purchase && this.emit('deleted', purchase);
		return purchase;
	}

	private emit(event: string, purchase: PurchaseDocument): void {
		this.eventEmitter.emit(`users.${purchase.userId}.purchases.${purchase._id}.${event}`, purchase);
	}
}
