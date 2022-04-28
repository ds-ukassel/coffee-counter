import {OmitType, PartialType} from '@nestjs/swagger';
import {User} from './user.schema';

export class CreateUserDto extends OmitType(User, ['coffees'] as const) {
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
