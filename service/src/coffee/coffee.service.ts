import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {UpdateUserDto} from '../user/user.dto';
import {UserService} from '../user/user.service';
import {CreateCoffeeDto} from './coffee.dto';
import {Coffee, CoffeeDocument} from './coffee.schema';

@Injectable()
export class CoffeeService {
	constructor(
		@InjectModel('coffees') private model: Model<Coffee>,
		private userService: UserService,
	) {
	}

	async create(dto: CreateCoffeeDto): Promise<CoffeeDocument> {
		const coffee = await this.model.create(dto);
		await this.userService.update(dto.userId, {
			$inc: {
				coffees: 1,
			},
		});
		return coffee;
	}

	async findAll(where: FilterQuery<Coffee> = {}): Promise<Coffee[]> {
		return this.model.find(where).exec();
	}

	async findOne(id: string): Promise<CoffeeDocument | null> {
		return this.model.findById(id).exec();
	}

	async remove(id: string): Promise<CoffeeDocument | null> {
		const coffee = await this.model.findByIdAndDelete(id).exec();
		coffee && await this.userService.update(coffee.userId, {
			$inc: {
				coffees: -1,
			},
		});
		return coffee;
	}
}
