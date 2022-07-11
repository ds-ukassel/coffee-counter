import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {UserModule} from '../user/user.module';
import {AchievementController} from './achievement.controller';
import {AchievementSchema} from './achievement.schema';
import {AchievementService} from './achievement.service';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: 'achievements',
			schema: AchievementSchema,
		}]),
		UserModule,
	],
	controllers: [AchievementController],
	providers: [AchievementService],
	exports: [AchievementService],
})
export class AchievementModule {
}
