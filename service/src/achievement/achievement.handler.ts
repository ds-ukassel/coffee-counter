import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {Coffee} from '../coffee/coffee.schema';
import {AchievementService} from './achievement.service';

@Injectable()
export class AchievementHandler {
	constructor(
		private achievementService: AchievementService,
	) {
	}

	@OnEvent('users.*.coffees.*.created')
	async onCoffeeCreated(coffee: Coffee) {
		const hours = coffee.createdAt.getHours();
		if (hours >= 20 || hours <= 5) {
			await this.awardRepeatable(coffee.userId, 'night-owl', coffee.createdAt);
		}
		if (hours >= 5 && hours <= 8) {
			await this.awardRepeatable(coffee.userId, 'early-bird', coffee.createdAt);
		}
	}

	private async awardRepeatable(userId: string, id: string, unlockedAt: Date = new Date()) {
		await this.achievementService.create(userId, id, {
			$setOnInsert: {
				unlockedAt,
			},
			$inc: {
				progress: 1,
			},
		});
	}
}
