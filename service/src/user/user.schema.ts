import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty} from '@nestjs/swagger';
import {IsByteLength, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength} from 'class-validator';
import {Document} from 'mongoose';

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
	@Matches(/^\w+:/, {message: 'avatar must be a valid URI'})
	@IsByteLength(0, MAX_AVATAR_LENGTH)
	@ApiProperty({format: 'url', required: false, maxLength: MAX_AVATAR_LENGTH})
	avatar?: string;

	@Prop({default: 0})
	@IsInt()
	@ApiProperty({type: 'integer'})
	coffees: number;

	@Prop({default: 0})
	@IsOptional()
	@IsNumber({maxDecimalPlaces: 2})
	balance: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
