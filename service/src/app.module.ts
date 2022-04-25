import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CoffeeModule} from './coffee/coffee.module';
import {environment} from './environment';

@Module({
	imports: [
		MongooseModule.forRoot(environment.mongo.uri, environment.mongo.options),
		CoffeeModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
}
