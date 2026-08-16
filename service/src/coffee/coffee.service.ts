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

	async findDiagramData(id: string): Promise<CoffeeDiagramData> {
    const [{hours, days}] = await this.model.aggregate<{
      hours: {_id: number; total: number; }[];
      days: {_id: number; total: number; }[];
    }>([
			{
				$match: {userId: id},
			},
      {
        $facet: {
          hours: [
            {
              $group: {
                _id: {$hour: {date: '$createdAt', timezone: 'Europe/Berlin'}},
                total: {$sum: 1},
              },
            },
          ],
          days: [
            {
              $group: {
                // 1 - Sunday, 7 - Saturday
                _id: {$dayOfWeek: {date: '$createdAt', timezone: 'Europe/Berlin'}},
                total: {$sum: 1},
              },
            },
          ]
        },
      },
		]).exec();

    return {
      hours: Object.fromEntries(hours.map(({_id, total}) => [_id, total])),
      // 0 - Sunday, 6 - Saturday (like Cron)
      days: Object.fromEntries(days.map(({_id, total}) => [_id - 1, total])),
    };
	}
}
