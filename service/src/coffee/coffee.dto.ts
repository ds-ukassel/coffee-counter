import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';
import {Coffee} from './coffee.schema';

export class CreateCoffeeDto extends OmitType(Coffee, [
	'createdAt',
	'price',
] as const) {
}

export class UpdateCoffeeDto extends PartialType(Coffee) {
}

export class FilterCoffeeDto extends PartialType(Coffee) {
}

export class CoffeeDiagramData {
  @ApiProperty({
    description: 'Keys are hours (0-23) and values are the number of coffees',
    type: Object,
  })
  hours!: Record<number, number>;

  @ApiProperty({
    description: 'Keys are days (0 Sunday - 6 Saturday) and values are the number of coffees',
    type: Object,
  })
  days!: Record<number, number>;
}
