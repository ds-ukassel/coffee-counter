import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {CreateCoffeeDto} from './coffee.dto';
import {Coffee, CoffeeDocument} from './coffee.schema';

@Injectable()
export class CoffeeService {
	constructor(
		@InjectModel('coffees') private model: Model<Coffee>,
	) {
	}

	async create(dto: CreateCoffeeDto): Promise<CoffeeDocument> {
		return this.model.create(dto);
	}

	async findAll(where: FilterQuery<Coffee> = {}): Promise<Coffee[]> {
		return this.model.find(where).exec();
	}

	async findOne(id: string): Promise<CoffeeDocument | null> {
		return this.model.findById(id).exec();
	}

	async remove(id: string): Promise<CoffeeDocument | null> {
		return this.model.findByIdAndDelete(id).exec();
	}
}
