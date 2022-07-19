import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';

import {CreateAchievementDto, UpdateAchievementDto} from './achievement.dto';
import {Achievement} from './achievement.schema';

@Injectable()
export class AchievementService {
	constructor(
		@InjectModel('achievements') private model: Model<Achievement>,
	) {
	}

	async create(userId: string, id: string, achievement: CreateAchievementDto): Promise<Achievement> {
		const created = await this.model.findOneAndUpdate({userId, id}, {...achievement, userId, id}, {
			upsert: true,
			new: true,
		}).exec();
		this.emit('created', created);
		return created;
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
		// TODO this.eventEmitter.emit(`users.${achievement.userId}.achievements.${achievement.id}.${event}`, achievement);
	}
}
