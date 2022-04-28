import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, UpdateQuery} from 'mongoose';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {User} from './user.schema';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('users') private model: Model<User>,
		// TODO private eventEmitter: EventService,
	) {
	}

	async findAll(filter: FilterQuery<User> = {}): Promise<User[]> {
		return this.model.find(filter).sort({name: 1}).exec();
	}

	async find(id: string): Promise<User | undefined> {
		return this.model.findById(id).exec();
	}

	async create(dto: CreateUserDto): Promise<User> {
		const created = await this.model.create(dto);
		created && this.emit('created', created);
		return created;
	}

	async update(id: string, dto: UpdateUserDto | UpdateQuery<User>): Promise<User | undefined> {
		const updated = await this.model.findByIdAndUpdate(id, dto, {new: true}).exec();
		updated && this.emit('updated', updated);
		return updated;
	}

	async delete(id: string): Promise<User | undefined> {
		const deleted = await this.model.findByIdAndDelete(id).exec();
		deleted && this.emit('deleted', deleted);
		return deleted;
	}

	private emit(event: string, user: User) {
		// TODO this.eventEmitter.emit(`users.${user._id}.${event}`, user);
	}
}
