import {EventRepository, MongooseRepository} from '@mean-stream/nestx';
import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Purchase, PurchaseDocument} from './purchase.schema';

@Injectable()
@EventRepository()
export class PurchaseService extends MongooseRepository<Purchase> {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('purchases') model: Model<Purchase>,
	) {
    super(model);
	}

	emit(event: string, purchase: PurchaseDocument): void {
		this.eventEmitter.emit(`users.${purchase.userId}.purchases.${purchase._id}.${event}`, purchase);
	}
}
