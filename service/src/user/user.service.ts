import {EventRepository, MongooseRepository} from '@mean-stream/nestx';
import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {User, UserDocument} from './user.schema';

@Injectable()
@EventRepository()
export class UserService extends MongooseRepository<User> {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('users') model: Model<User>,
	) {
    super(model);
	}

	emit(event: string, user: UserDocument) {
		this.eventEmitter.emit(`users.${user._id}.${event}`, user);
	}
}
