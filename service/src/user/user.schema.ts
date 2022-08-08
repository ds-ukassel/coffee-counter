import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {
	IsByteLength,
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
} from 'class-validator';
import {Document, SchemaTypes, Types} from 'mongoose';

const MAX_AVATAR_LENGTH = 16 * 1024;

@Schema({timestamps: false})
export class User {
	@Prop({index: {type: 1, unique: true}})
	@ApiProperty({minLength: 1, maxLength: 32})
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	name: string;

	@Prop()
	@IsOptional()
	@IsUrl()
	@IsByteLength(0, MAX_AVATAR_LENGTH)
	@ApiProperty({format: 'url', required: false, maxLength: MAX_AVATAR_LENGTH})
	avatar?: string;

	@Prop({default: 0, index: 1})
	@IsInt()
	@ApiProperty({type: 'integer'})
	coffees: number;

	@Prop({default: 0})
	@IsInt()
	@ApiProperty({type: 'integer'})
	achievements: number;

	@Prop({
		default: 0,
		type: SchemaTypes.Decimal128, // going for that overkill
		transform: (value: Types.Decimal128) => value.toString(),
	})
	@ApiProperty({type: 'string', format: 'decimal', example: '1234.56'})
	@IsNumberString({maxDecimalPlaces: 2})
	balance: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
