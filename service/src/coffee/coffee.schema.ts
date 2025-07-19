import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {Transform, Type} from 'class-transformer';
import {IsDate, IsMongoId, IsNumber} from 'class-validator';
import {Document, Types} from 'mongoose';

@Schema({timestamps: false})
export class Coffee {
	@Prop({default: () => new Date()})
	@ApiProperty()
	@Type(() => Date)
	@Transform(({value}) => new Date(value))
	@IsDate()
	createdAt!: Date;

	@Prop()
	@ApiProperty({format: 'objectid'})
	@IsMongoId()
	userId!: string;

	@Prop()
	@ApiProperty()
	@IsNumber()
	price!: number;
}

export type CoffeeDocument = Coffee & Document<Types.ObjectId>;

export const CoffeeSchema = SchemaFactory.createForClass(Coffee)
	.set('toJSON', {virtuals: true})
;
