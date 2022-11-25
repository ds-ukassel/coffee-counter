import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsMongoId, IsNumber, IsOptional, IsPositive, IsString} from 'class-validator';
import {Document} from 'mongoose';

@Schema({timestamps: {createdAt: true, updatedAt: false}})
export class Purchase {
	@ApiProperty()
	@Type(() => Date)
	createdAt!: Date;

	@Prop()
	@ApiProperty({format: 'objectid'})
	@IsMongoId()
	userId!: string;

	// TODO maybe a detailed list of items?
	@Prop()
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string;

	@Prop()
	@ApiProperty({minimum: 0.01, multipleOf: 0.01})
	@IsNumber({maxDecimalPlaces: 2})
	total!: number;
}

export type PurchaseDocument = Purchase & Document;

export const PurchaseSchema = SchemaFactory.createForClass(Purchase)
	.set('toJSON', {virtuals: true})
;
