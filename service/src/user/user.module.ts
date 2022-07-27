import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {UserController} from './user.controller';
import {UserHandler} from './user.handler';
import {UserSchema} from './user.schema';
import {UserService} from './user.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'users',
				schema: UserSchema,
			},
		]),
	],
	providers: [UserService, UserHandler],
	controllers: [UserController],
	exports: [
		UserService,
	],
})
export class UserModule {
}
