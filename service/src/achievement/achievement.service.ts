import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, UpdateQuery} from 'mongoose';

import {CreateAchievementDto, UpdateAchievementDto} from './achievement.dto';
import {Achievement} from './achievement.schema';

@Injectable()
export class AchievementService {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('achievements') private model: Model<Achievement>,
	) {
	}

	async create(userId: string, id: string, achievement: CreateAchievementDto | UpdateQuery<Achievement>): Promise<Achievement> {
		const res = await this.model.findOneAndUpdate({userId, id}, {...achievement, userId, id}, {
			upsert: true,
			new: true,
			includeResultMetadata: true,
		});
		const value = res.value!;
		const updated = res.lastErrorObject?.updatedExisting;
		this.emit(updated ? 'updated' : 'created', value);
		return value;
	}

	async findAll(userId: string, filter?: FilterQuery<Achievement>): Promise<Achievement[]> {
		return this.model.find({...filter, userId}).exec();
	}

	async findOne(userId: string, id: string): Promise<Achievement | null> {
		return this.model.findOne({userId, id}).exec();
	}

	async update(userId: string, id: string, dto: UpdateAchievementDto): Promise<Achievement | null> {
		const updated = await this.model.findOneAndUpdate({userId, id}, dto, {new: true}).exec();
		updated && this.emit('updated', updated);
		return updated;
	}

	async delete(userId: string, id: string): Promise<Achievement | null> {
		const deleted = await this.model.findOneAndDelete({userId, id}).exec();
		deleted && this.emit('deleted', deleted);
		return deleted;
	}

	private emit(event: string, achievement: Achievement): void {
		this.eventEmitter.emit(`users.${achievement.userId}.achievements.${achievement.id}.${event}`, achievement);
	}
}
