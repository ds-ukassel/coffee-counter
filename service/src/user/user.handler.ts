import {Injectable} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {Achievement} from '../achievement/achievement.schema';
import {UserService} from './user.service';

@Injectable()
export class UserHandler {
	constructor(
		private userService: UserService,
	) {
	}

	@OnEvent('users.*.achievements.*.created')
	async onAchievementCreated(achievement: Achievement): Promise<void> {
		await this.userService.update(achievement.userId, {$inc: {achievements: +1}});
	}

	@OnEvent('users.*.achievements.*.deleted')
	async onAchievementDeleted(achievement: Achievement): Promise<void> {
		await this.userService.update(achievement.userId, {$inc: {achievements: -1}});
	}
}
