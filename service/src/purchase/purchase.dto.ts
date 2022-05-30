import {OmitType} from '@nestjs/swagger';
import {Purchase} from './purchase.schema';

export class CreatePurchaseDto extends OmitType(Purchase, [
	'createdAt',
] as const) {
}
