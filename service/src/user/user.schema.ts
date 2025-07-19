import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ApiProperty, ApiPropertyOptional, PickType} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {
	IsBoolean,
	IsByteLength,
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import {Document, SchemaTypes, Types} from 'mongoose';
import {Purchase} from '../purchase/purchase.schema';

const MAX_AVATAR_LENGTH = 16 * 1024;

export class Shortcut extends PickType(Purchase, ['description', 'total'] as const) {
	@Prop()
	@ApiProperty()
	@IsString()
	icon!: string;
}

@Schema({timestamps: false})
export class User {
	@Prop({index: {type: 1, unique: true}})
	@ApiProperty({minLength: 1, maxLength: 32})
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	name!: string;

	@Prop()
	@IsOptional()
	@IsUrl()
	@IsByteLength(0, MAX_AVATAR_LENGTH)
	@ApiProperty({format: 'url', required: false, maxLength: MAX_AVATAR_LENGTH})
	avatar?: string;

	@Prop()
	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional()
	archived?: boolean;

	@Prop({default: 0, index: 1})
	@IsInt()
	@ApiProperty({type: 'integer'})
	coffees!: number;

	@Prop({default: 0})
	@IsInt()
	@ApiProperty({type: 'integer'})
	achievements!: number;

	@Prop({
		default: 0,
		type: SchemaTypes.Decimal128, // going for that overkill
		transform: (value: Types.Decimal128) => value.toString(),
	})
	@ApiProperty({type: 'string', format: 'decimal', example: '1234.56'})
	@IsNumberString()
	balance!: string;

	@Prop()
	@ApiPropertyOptional()
	@ValidateNested({each: true})
	@Type(() => Shortcut)
	shortcuts?: Shortcut[];
}

export type UserDocument = User & Document<Types.ObjectId>;

export const UserSchema = SchemaFactory.createForClass(User);
