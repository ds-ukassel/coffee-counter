import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AchievementModule} from './achievement/achievement.module';
import {CoffeeModule} from './coffee/coffee.module';
import {environment} from './environment';
import {PurchaseModule} from './purchase/purchase.module';
import {UserModule} from './user/user.module';

@Module({
	imports: [
		MongooseModule.forRoot(environment.mongo.uri, environment.mongo.options),
		CoffeeModule,
		UserModule,
		PurchaseModule,
		AchievementModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
}
