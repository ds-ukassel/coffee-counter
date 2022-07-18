import {OmitType} from '@nestjs/swagger';
import {Coffee} from './coffee.schema';

export class CreateCoffeeDto extends OmitType(Coffee, [
	'createdAt',
] as const) {
}

export interface CoffeeDiagramData {
	_id: number;
	total: number;
}
