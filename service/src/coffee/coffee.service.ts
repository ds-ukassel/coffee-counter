import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model} from 'mongoose';
import {CoffeeDiagramData, CreateCoffeeDto} from './coffee.dto';
import {Coffee, CoffeeDocument} from './coffee.schema';

@Injectable()
export class CoffeeService {
	constructor(
		private eventEmitter: EventEmitter2,
		@InjectModel('coffees') private model: Model<Coffee>,
	) {
	}

	async create(dto: CreateCoffeeDto): Promise<CoffeeDocument> {
		const coffee = await this.model.create(dto);
		this.emit('created', coffee);
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
		coffee && this.emit('deleted', coffee);
		return coffee;
	}

	private emit(event: string, coffee: CoffeeDocument): void {
		this.eventEmitter.emit(`users.${coffee.userId}.coffees.${coffee._id}.${event}`, coffee);
	}

	async findDiagramData(id: string): Promise<CoffeeDiagramData[] | null> {
		return await this.model.aggregate([
			{
				$match: { userId: id },
			},
			{
				$group: {
					_id: {$hour: {date: '$createdAt', timezone: 'Europe/Berlin'}},
					total: {$sum: 1},
				},
			},
			{
				$addFields: {
					hour: '$_id',
				},
			},
			{
				$project: {
					_id: 0,
				},
			},
		]).exec();
	}
}
