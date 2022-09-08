import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, UpdateQuery} from 'mongoose';
import {CoffeeDiagramData, CreateCoffeeDto, UpdateCoffeeDto} from './coffee.dto';
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
		return this.model.find(where).sort('-createdAt').limit(20).exec();
	}

	async findOne(id: string): Promise<CoffeeDocument | null> {
		return this.model.findById(id).exec();
	}

	async update(id: string, dto: UpdateQuery<Coffee>): Promise<CoffeeDocument | null> {
		const coffee = await this.model.findByIdAndUpdate(id, dto, {new: true}).exec();
		coffee && this.emit('updated', coffee);
		return coffee;
	}

	async remove(id: string): Promise<CoffeeDocument | null> {
		const coffee = await this.model.findByIdAndDelete(id).exec();
		coffee && this.emit('deleted', coffee);
		return coffee;
	}

	private emit(event: string, coffee: CoffeeDocument): void {
		this.eventEmitter.emit(`users.${coffee.userId}.coffees.${coffee._id}.${event}`, coffee);
	}

	async findDiagramData(id: string): Promise<CoffeeDiagramData[]> {
		return this.model.aggregate([
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
