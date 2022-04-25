import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsUUID} from 'class-validator';
import {Document} from 'mongoose';

@Schema({timestamps: {createdAt: true, updatedAt: false}})
export class Coffee {
	@ApiProperty()
	@Type(() => Date)
	createdAt: Date;

	@Prop()
	@ApiProperty({format: 'uuid'})
	@IsUUID()
	userId: string;
}

export type CoffeeDocument = Coffee & Document;

export const CoffeeSchema = SchemaFactory.createForClass(Coffee)
	.set('toJSON', {virtuals: true})
;
