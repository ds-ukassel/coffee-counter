import {EventRepository, MongooseRepository} from '@mean-stream/nestx';
import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {CoffeeDiagramData} from './coffee.dto';
import {Coffee, CoffeeDocument} from './coffee.schema';

@Injectable()
@EventRepository()
export class CoffeeService extends MongooseRepository<Coffee> {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('coffees') model: Model<Coffee>,
	) {
    super(model);
	}

	emit(event: string, coffee: CoffeeDocument): void {
		this.eventEmitter.emit(`users.${coffee.userId}.coffees.${coffee._id}.${event}`, coffee);
	}

	async findDiagramData(id: string): Promise<CoffeeDiagramData[]> {
		return this.model.aggregate([
			{
				$match: {userId: id},
			},
			{
				$group: {
					_id: {$hour: {date: '$createdAt', timezone: 'Europe/Berlin'}},
					total: {$sum: 1},
				},
			},
			{
				$addFields: {
					hour: '$_id',
				},
			},
			{
				$project: {
					_id: 0,
				},
			},
		]).exec();
	}
}
