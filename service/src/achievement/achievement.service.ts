import {EventRepository, MongooseRepository} from '@mean-stream/nestx';
import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {Model, UpdateQuery} from 'mongoose';

import {CreateAchievementDto} from './achievement.dto';
import {Achievement} from './achievement.schema';

@Injectable()
@EventRepository()
export class AchievementService extends MongooseRepository<Achievement, never> {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('achievements') model: Model<Achievement>,
	) {
    super(model as any);
	}

	async award(userId: string, id: string, achievement: CreateAchievementDto | UpdateQuery<Achievement>): Promise<Achievement> {
    return this.upsert({userId, id}, {...achievement, userId, id});
	}

	emit(event: string, achievement: Achievement): void {
		this.eventEmitter.emit(`users.${achievement.userId}.achievements.${achievement.id}.${event}`, achievement);
	}
}
