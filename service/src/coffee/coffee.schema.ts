import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsMongoId} from 'class-validator';
import {Document} from 'mongoose';

@Schema({timestamps: {createdAt: true, updatedAt: false}})
export class Coffee {
	@ApiProperty()
	@Type(() => Date)
	createdAt: Date;

	@Prop()
	@ApiProperty({format: 'objectid'})
	@IsMongoId()
	userId: string;
}

export type CoffeeDocument = Coffee & Document;

export const CoffeeSchema = SchemaFactory.createForClass(Coffee)
	.set('toJSON', {virtuals: true})
;
