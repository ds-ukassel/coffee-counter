import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {Types} from 'mongoose';
import {Achievement} from '../achievement/achievement.schema';
import {Coffee} from '../coffee/coffee.schema';
import {Purchase} from '../purchase/purchase.schema';
import {UserService} from './user.service';

@Injectable()
export class UserHandler {
	constructor(
		private userService: UserService,
	) {
	}

	@OnEvent('users.*.achievements.*.created')
	async onAchievementCreated(achievement: Achievement): Promise<void> {
		await this.userService.update(new Types.ObjectId(achievement.userId), {$inc: {achievements: +1}});
	}

	@OnEvent('users.*.achievements.*.deleted')
	async onAchievementDeleted(achievement: Achievement): Promise<void> {
		await this.userService.update(new Types.ObjectId(achievement.userId), {$inc: {achievements: -1}});
	}

	@OnEvent('users.*.coffees.*.created')
	async onCoffeeCreated(coffee: Coffee): Promise<void> {
		await this.userService.update(new Types.ObjectId(coffee.userId), {
			$inc: {
				coffees: +1,
				balance: -coffee.price,
			},
		});
	}

	@OnEvent('users.*.coffees.*.deleted')
	async onCoffeeDeleted(coffee: Coffee): Promise<void> {
		await this.userService.update(new Types.ObjectId(coffee.userId), {
			$inc: {
				coffees: -1,
				balance: +coffee.price,
			},
		});
	}

	@OnEvent('users.*.purchases.*.created')
	async onPurchaseCreated(purchase: Purchase): Promise<void> {
		await this.userService.update(new Types.ObjectId(purchase.userId), {$inc: {balance: +purchase.total}});
	}

	@OnEvent('users.*.purchases.*.deleted')
	async onPurchaseDeleted(purchase: Purchase): Promise<void> {
		await this.userService.update(new Types.ObjectId(purchase.userId), {$inc: {balance: -purchase.total}});
	}
}
