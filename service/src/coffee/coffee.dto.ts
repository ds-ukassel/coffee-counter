import {OmitType, PartialType, PickType} from '@nestjs/swagger';
import {Coffee} from './coffee.schema';

export class CreateCoffeeDto extends OmitType(Coffee, [
	'createdAt',
] as const) {
}

export class FilterCoffeeDto extends PartialType(Coffee) {
}
