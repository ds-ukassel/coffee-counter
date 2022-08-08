import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {Coffee} from '../coffee/coffee.schema';
import {Purchase} from '../purchase/purchase.schema';
import {UserService} from '../user/user.service';
import {AchievementService} from './achievement.service';

@Injectable()
export class AchievementHandler {
	constructor(
		private achievementService: AchievementService,
		private userService: UserService,
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

		const bestUsers = await this.userService.model.find().sort({coffees: -1}).limit(1).exec();
		if (bestUsers.length) {
			const bestUserId = bestUsers[0]._id.toString();
			if (bestUserId === coffee.userId) { // no point in updating if their count did not change
				await this.awardOnce(bestUserId, 'most-addicted', coffee.createdAt);
			}
		}
	}

	@OnEvent('users.*.purchases.*.created')
	async onPurchaseCreated(purchase: Purchase) {
		let desc = purchase.description.toLowerCase();
		const milk = ['milk', 'milch'];
		if (milk.some(m => desc.includes(m))) {
			await this.awardRepeatable(purchase.userId, 'buyer-of-milk', purchase.createdAt);
		}
		const coffee = ['coffee', 'kaffee', 'espresso'];
		if (coffee.some(c => desc.includes(c))) {
			await this.awardRepeatable(purchase.userId, 'buyer-of-coffee', purchase.createdAt);
		}
		const notMilk = ['non-milk', 'nicht-milch', 'alt-milch', 'alt-milk', 'hafermilch', 'oat milk'];
		if (notMilk.some(x => desc.includes(x))) {
			await this.awardRepeatable(purchase.userId, 'buyer-of-non-milk', purchase.createdAt);
		}
	}

	private async awardOnce(userId: string, id: string, unlockedAt: Date = new Date()) {
		await this.achievementService.create(userId, id, {
			$setOnInsert: {
				unlockedAt,
			},
		});
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
