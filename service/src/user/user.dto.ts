import {OmitType, PartialType} from '@nestjs/swagger';
import {User} from './user.schema';

export class CreateUserDto extends OmitType(User, [] as const) {
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
