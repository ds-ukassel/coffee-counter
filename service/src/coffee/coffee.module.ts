import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModule} from '../user/user.module';
import {CoffeeController} from './coffee.controller';
import {CoffeeSchema} from './coffee.schema';
import {CoffeeService} from './coffee.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'coffees',
				schema: CoffeeSchema,
			},
		]),
		UserModule,
	],
	controllers: [
		CoffeeController,
	],
	providers: [
		CoffeeService,
	],
	exports: [
		CoffeeService,
	],
})
export class CoffeeModule {
}
