import {NotFound, ObjectIdPipe} from '@mean-stream/nestx';
import {
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {MongooseError, Types} from 'mongoose';

import {CreateUserDto, UpdateUserDto} from './user.dto';
import {User} from './user.schema';
import {UserService} from './user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(
		private userService: UserService,
	) {
	}

	@Get()
	@ApiOkResponse({type: [User]})
	async getUsers(
		@Query('archived', new DefaultValuePipe(false), ParseBoolPipe) archived: boolean,
	): Promise<User[]> {
		return this.userService.findAll({archived: archived ? true : {$ne: true}}, {sort: {name: 1}});
	}

	@Get(':id')
	@NotFound()
	@ApiOkResponse({type: User})
	async getUser(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
  ): Promise<User | null> {
		return this.userService.find(id);
	}

	@Post()
	@ApiCreatedResponse({type: User})
	@ApiConflictResponse({type: User, description: 'Username was already taken.'})
	async create(
    @Body() dto: CreateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.create(dto);
    } catch (e: unknown) {
      if (e instanceof MongooseError && e.message.includes('E11000')) {
        throw new ConflictException('Username already taken');
      } else {
        throw e;
      }
    }
	}

	@Patch(':id')
	@NotFound()
	@ApiOkResponse({type: User})
	async update(
		@Param('id', ObjectIdPipe) id: Types.ObjectId,
		@Body() dto: UpdateUserDto,
	): Promise<User | null> {
		return this.userService.update(id, dto);
	}

	@Delete(':id')
	@NotFound()
	@ApiOkResponse({type: User})
	async delete(
		@Param('id', ObjectIdPipe) id: Types.ObjectId,
	): Promise<User | null> {
		return this.userService.delete(id);
	}
}
