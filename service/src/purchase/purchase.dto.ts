import {OmitType, PartialType} from '@nestjs/swagger';
import {Purchase} from './purchase.schema';

export class CreatePurchaseDto extends OmitType(Purchase, [
	'createdAt',
] as const) {
}

export class FindAllPurchaseDto extends PartialType(Purchase) {
}
