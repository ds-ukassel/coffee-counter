import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModule} from '../user/user.module';
import {PurchaseController} from './purchase.controller';
import {PurchaseSchema} from './purchase.schema';
import {PurchaseService} from './purchase.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'purchases',
				schema: PurchaseSchema,
			},
		]),
		UserModule,
	],
	controllers: [
		PurchaseController,
	],
	providers: [
		PurchaseService,
	],
	exports: [
		PurchaseService,
	],
})
export class PurchaseModule {
}
