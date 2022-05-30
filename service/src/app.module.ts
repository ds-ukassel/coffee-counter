import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
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
	],
	controllers: [],
	providers: [],
})
export class AppModule {
}
